from django.test import TestCase, Client
from band.models import *
from django.contrib.auth import get_user_model

User = get_user_model()


class SongTestCase(TestCase):
    """Tests for user"""

    def setUp(self):
        pass

    def test_user_signup(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.post("/api/user/signup/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

    def test_user_signin(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.post("/api/user/signin/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

    def test_user_signout(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/user/signout/", HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

    def test_user_info(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/user/info/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put("/api/user/info/1/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.delete("/api/user/info/1/", HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)
