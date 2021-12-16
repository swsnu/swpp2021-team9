"""
Test codes for band cover info
"""
from django.test import TestCase, Client
from rest_framework import status

from band.models import Cover, Combination
from band.tests.tools import set_up_data


class CoverInfoTestCase(TestCase):
    """
    TestCase Class for band app's cover info view
    """

    @classmethod
    def setUpClass(cls):
        super(CoverInfoTestCase, cls).setUpClass()
        set_up_data()

    def test_cover_info(self):
        client = Client(enforce_csrf_checks=True)

        cover: Cover = Cover.objects.first()
        last_cover: Cover = Cover.objects.all().order_by("-id").first()

        response = client.post("/api/log/cover/", {"cover_id": cover.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.post("/api/log/cover/", {"cover_id": cover.id})

        self.assertEqual(response.status_code, status.HTTP_208_ALREADY_REPORTED)

        response = client.post("/api/log/cover/", {"cover_id": last_cover.id + 1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_combination_info(self):
        client = Client(enforce_csrf_checks=True)

        combination: Combination = Combination.objects.first()
        last_combination: Combination = (
            Combination.objects.all().order_by("-id").first()
        )

        response = client.post(
            "/api/log/combination/", {"combination_id": combination.id}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.post(
            "/api/log/combination/", {"combination_id": combination.id}
        )

        self.assertEqual(response.status_code, status.HTTP_208_ALREADY_REPORTED)

        response = client.post(
            "/api/log/combination/", {"combination_id": last_combination.id + 1}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
