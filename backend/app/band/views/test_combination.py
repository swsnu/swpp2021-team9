"""
Test codes for combination
"""
from django.test import TestCase, Client


class CombinationTestCase(TestCase):
    """Tests for combination"""

    def setUp(self):
        pass

    def test_combination_song(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/combination/1/")
        self.assertEqual(response.status_code, 501)

        response = client.post("/api/combination/1/", {})
        self.assertEqual(response.status_code, 501)

    def test_combination_info(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/combination/info/1/")
        self.assertEqual(response.status_code, 501)

    def test_combination_like(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/combination/like/1/")
        self.assertEqual(response.status_code, 501)

        response = client.put("/api/combination/like/1/", {})
        self.assertEqual(response.status_code, 501)
