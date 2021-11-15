"""
Test codes for combination
"""
from django.test import TestCase, Client


class CombinationTestCase(TestCase):
    """Tests for combination"""

    def setUp(self):
        pass

    def test_combination_song(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/combination/1/")
        self.assertEqual(response.status_code, 200)

        response = client.post("/api/combination/1/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

    def test_combination_info(self):
        client = Client(enforce_csrf_checks=True)

        response = client.get("/api/combination/info/1/")
        self.assertEqual(response.status_code, 200)

    def test_combination_like(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/combination/like/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put(
            "/api/combination/like/1/", {}, HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 200)
