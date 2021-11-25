"""
Test codes for cover
"""
from django.test import TestCase, Client


class CoverTestCase(TestCase):
    """Tests for cover"""

    def setUp(self):
        pass

    def test_cover_song(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/cover/1/")
        self.assertEqual(response.status_code, 501)

        response = client.post("/api/cover/1/", {})
        self.assertEqual(response.status_code, 501)

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/cover/1/1/")
        self.assertEqual(response.status_code, 501)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/cover/like/1/")
        self.assertEqual(response.status_code, 501)

        response = client.put("/api/cover/like/1/", {})
        self.assertEqual(response.status_code, 501)
