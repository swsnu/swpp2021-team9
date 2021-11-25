"""
Test codes for band cover
"""
import json
from django.test import TestCase, Client
from rest_framework import status

from band.models import Cover, CoverTag
from band.tests.tools import set_up_data


class CoverSongTestCase(TestCase):
    """
    TestCase Class for band app's cover info view
    """

    @classmethod
    def setUpClass(cls):
        super(CoverSongTestCase, cls).setUpClass()
        set_up_data()

    def test_cover_song(self):
        client = Client(enforce_csrf_checks=False)

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=False)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/cover/like/1/")
        self.assertEqual(response.status_code, 501)

        response = client.put("/api/cover/like/1/", {})
        self.assertEqual(response.status_code, 501)
