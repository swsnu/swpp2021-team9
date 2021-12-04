"""
Test codes for band cover
"""
import json
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client
from rest_framework import status
from band.models import Cover, CoverTag, Instrument, Song
from band.tests.tools import set_up_data, get_logined_client
from user.models import CustomUser
from bandcruit.settings import FILE_UPLOAD_MAX_MEMORY_SIZE

User = get_user_model()


class CoverTestCase(TestCase):
    """
    TestCase Class for band app's cover view
    """

    @classmethod
    def setUpClass(cls):
        super(CoverTestCase, cls).setUpClass()
        set_up_data()

    def test_cover_song_get(self):
        client = Client(enforce_csrf_checks=False)

        song: Song = Song.objects.get(pk=1)

        response = client.get(f"/api/cover/{song.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        covers = json.loads(response.content)
        self.assertGreater(len(covers), 0)

    def test_cover_song_post(self):
        client = get_logined_client()

        song: Song = Song.objects.get(pk=1)
        last_song: Song = Song.objects.all().order_by("-id").first()
        tag: CoverTag = CoverTag.objects.get(pk=1)
        tags = json.dumps([tag.name])

        # cover song post with valid data
        response = client.post(
            f"/api/cover/{song.pk}/",
            {
                "audio": SimpleUploadedFile(
                    "file.mp3", content=b"", content_type="audio/mpeg"
                ),
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": tags,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        res_content = json.loads(response.content)
        self.assertEqual(res_content["title"], "TEST_TITLE")
        self.assertEqual(res_content["description"], "TEST_DESCRIPTION")
        self.assertTrue(res_content["audio"])

        # cover song post with bad song id
        response = client.post(
            f"/api/cover/{last_song.pk + 1}/",
            {
                "audio": SimpleUploadedFile(
                    "file.mp3", content=b"", content_type="audio/mpeg"
                ),
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": tags,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "Song does not exist.")

        # cover song post with no audio
        response = client.post(
            f"/api/cover/{song.pk}/",
            {
                "audio": "",
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": tags,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "No audio file.")

        # cover song post with too big audio
        response = client.post(
            f"/api/cover/{song.pk}/",
            {
                "audio": SimpleUploadedFile(
                    "file.mp3",
                    content=bytes(FILE_UPLOAD_MAX_MEMORY_SIZE + 1),
                    content_type="audio/mpeg",
                ),
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": tags,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "File size larger than 15MB.")

        # cover song post with bad tags format
        response = client.post(
            f"/api/cover/{song.pk}/",
            {
                "audio": SimpleUploadedFile(
                    "file.mp3", content=b"", content_type="audio/mpeg"
                ),
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": "WRONG_TAG",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content), "'tags' is not in json format.")

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=False)
        song: Song = Song.objects.get(pk=1)
        cover: Cover = Cover.objects.filter(song_id=song.pk).first()
        instrument: Instrument = cover.instrument

        response = client.get(f"/api/cover/{song.pk}/{instrument.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        covers = json.loads(response.content)
        self.assertGreater(len(covers), 0)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=False)

        cover: Cover = Cover.objects.get(pk=1)
        last_cover: Cover = Cover.objects.all().order_by("-id").first()
        like_count = cover.like_count

        # get without login
        response = client.get(f"/api/cover/like/{cover.pk}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        user: CustomUser = User.objects.get(pk=1)
        client.force_login(user)

        # get like
        response = client.get(f"/api/cover/like/{cover.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res_content = json.loads(response.content)
        self.assertFalse(res_content["isLike"])

        # get like with bad cover id
        response = client.get(f"/api/cover/like/{last_cover.pk + 1}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # like
        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": True}),
            content_type="application/json",
        )
        res_content = json.loads(response.content)
        self.assertTrue(res_content["isLike"])
        self.assertEqual(cover.like_count, like_count + 1)

        # unlike
        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": False}),
            content_type="application/json",
        )
        res_content = json.loads(response.content)
        self.assertFalse(res_content["isLike"])
        self.assertEqual(cover.like_count, like_count)
