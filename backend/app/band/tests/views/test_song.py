"""
Test codes for band song
"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from rest_framework import status
from band.models import Song
from band.tests.tools import set_up_data, get_logined_client

User = get_user_model()


class SongTestCase(TestCase):
    """
    TestCase Class for band app's song view
    """

    @classmethod
    def setUpClass(cls):
        super(SongTestCase, cls).setUpClass()
        set_up_data()

    def test_song_get(self):
        client = Client(enforce_csrf_checks=False)

        song_count = Song.objects.count()

        response = client.get("/api/song/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        songs = json.loads(response.content)
        self.assertEqual(len(songs), song_count)

    def test_song_post(self):
        client = get_logined_client()

        response = client.post(
            "/api/song/",
            json.dumps(
                {
                    "title": "TEST_TITLE",
                    "singer": "TEST_SINGER",
                    "category": "TEST_CATEGORY",
                    "reference": "TEST_REFERENCE",
                    "description": "TEST_DESCRIPTION",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        res_content = json.loads(response.content)
        self.assertEqual(res_content["title"], "TEST_TITLE")
        self.assertEqual(res_content["singer"], "TEST_SINGER")
        self.assertEqual(res_content["category"], "TEST_CATEGORY")
        self.assertEqual(res_content["reference"], "TEST_REFERENCE")
        self.assertEqual(res_content["description"], "TEST_DESCRIPTION")

    def test_song_search(self):
        client = Client(enforce_csrf_checks=False)
        song: Song = Song.objects.get(pk=1)
        song_title = song.title

        response = client.get(f"/api/song/search/?search={song_title}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        songs = json.loads(response.content)
        self.assertGreater(len(songs), 0)

    def test_song_info_get(self):
        client = Client(enforce_csrf_checks=False)
        song: Song = Song.objects.get(pk=1)

        response = client.get("/api/song/info/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res_content = json.loads(response.content)
        self.assertEqual(res_content["title"], song.title)

    def test_song_info_put(self):
        client = get_logined_client()

        response = client.put(
            "/api/song/info/1/",
            json.dumps(
                {
                    "title": "CHANGED_TITLE",
                    "singer": "CHANGED_SINGER",
                    "category": "CHANGED_CATEGORY",
                    "reference": "CHANGED_REFERENCE",
                    "description": "CHANGED_DESCRIPTION",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res_content = json.loads(response.content)
        self.assertEqual(res_content["title"], "CHANGED_TITLE")
        changed_song: Song = Song.objects.get(pk=1)
        self.assertEqual(changed_song.title, "CHANGED_TITLE")
