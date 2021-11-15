from django.test import TestCase, Client


class CoverTestCase(TestCase):
    """Tests for cover"""

    def setUp(self):
        pass

    def test_cover_song(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/cover/1/")
        self.assertEqual(response.status_code, 200)

        response = client.post("/api/cover/1/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=True)

        response = client.get("/api/cover/1/1/")
        self.assertEqual(response.status_code, 200)

    def test_cover_info(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/cover/info/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put("/api/cover/info/1/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)

        response = client.delete("/api/cover/info/1/", HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value

        response = client.get("/api/cover/like/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put("/api/cover/like/1/", {}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
