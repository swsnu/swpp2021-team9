"""
Test codes for song
"""
from django.test import TestCase, Client


class SongTestCase(TestCase):
    """Tests for song"""

    def setUp(self):
        pass

    def test_song(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/song/")
        self.assertEqual(response.status_code, 200)

        response = client.post("/api/song/", {})
        self.assertEqual(response.status_code, 201)

    def test_song_main(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/song/main/")
        self.assertEqual(response.status_code, 200)

    def test_song_search(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/song/search/?q=123/")
        self.assertEqual(response.status_code, 200)

    def test_song_info(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/song/info/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put("/api/song/info/1/", {})
        self.assertEqual(response.status_code, 200)
