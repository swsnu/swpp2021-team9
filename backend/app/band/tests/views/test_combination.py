"""
Test codes for band combination
"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from rest_framework import status
from band.models import Combination, Cover, Song
from band.tests.tools import set_up_data, get_logined_client
from user.models import CustomUser

User = get_user_model()


class CombinationTestCase(TestCase):
    """
    TestCase Class for band app's combination view
    """

    @classmethod
    def setUpClass(cls):
        super(CombinationTestCase, cls).setUpClass()
        set_up_data()

    def test_combination_song_get(self):
        client = Client(enforce_csrf_checks=False)

        song: Song = Song.objects.get(pk=1)

        response = client.get(f"/api/combination/{song.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        combinations = json.loads(response.content)
        self.assertGreater(len(combinations), 0)

    def test_combination_song_post(self):
        client = get_logined_client()

        song: Song = Song.objects.get(pk=1)
        last_song: Song = Song.objects.all().order_by("-id").first()
        cover: Cover = Cover.objects.filter(song=song).first()

        # cover song post with valid data
        response = client.post(
            f"/api/combination/{song.pk}/",
            json.dumps({"covers": [cover.pk]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        res_content = json.loads(response.content)
        self.assertEqual(res_content["song"]["id"], song.pk)
        self.assertEqual(len(res_content["covers"]), 1)
        self.assertEqual(res_content["covers"][0]["id"], cover.pk)

        # cover song post with bad song id
        response = client.post(
            f"/api/combination/{last_song.pk + 1}/",
            json.dumps({"covers": [cover.pk]}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "Song does not exist.")

        # cover song post with no covers
        response = client.post(
            f"/api/combination/{song.pk}/",
            json.dumps({"covers": []}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "No covers provided.")

    def test_combination_info(self):
        client = Client(enforce_csrf_checks=False)

        combination: Combination = Combination.objects.get(pk=1)
        last_combination: Combination = (
            Combination.objects.all().order_by("-id").first()
        )

        response = client.get(f"/api/combination/info/{combination.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get(f"/api/combination/info/{last_combination.pk + 1}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_combination_like(self):
        client = Client(enforce_csrf_checks=False)

        combination: Combination = Combination.objects.get(pk=1)
        last_combination: Combination = (
            Combination.objects.all().order_by("-id").first()
        )
        like_count = combination.like_count

        # get without login
        response = client.get(f"/api/combination/like/{combination.pk}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        user: CustomUser = User.objects.get(pk=1)
        client.force_login(user)

        # get like
        response = client.get(f"/api/combination/like/{combination.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res_content = json.loads(response.content)
        self.assertFalse(res_content["isLike"])

        # get like with bad combination id
        response = client.get(f"/api/combination/like/{last_combination.pk + 1}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # put like with bad request
        response = client.put(
            f"/api/combination/like/{combination.pk}/",
            json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # like
        response = client.put(
            f"/api/combination/like/{combination.pk}/",
            json.dumps({"isLike": True}),
            content_type="application/json",
        )
        res_content = json.loads(response.content)
        self.assertTrue(res_content["isLike"])
        self.assertEqual(combination.like_count, like_count + 1)

        # unlike
        response = client.put(
            f"/api/combination/like/{combination.pk}/",
            json.dumps({"isLike": False}),
            content_type="application/json",
        )
        res_content = json.loads(response.content)
        self.assertFalse(res_content["isLike"])
        self.assertEqual(combination.like_count, like_count)
