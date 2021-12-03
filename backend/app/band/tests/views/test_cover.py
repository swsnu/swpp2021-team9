"""
Test codes for band cover
"""
import json
from django.test import TestCase, Client
from rest_framework import status

from band.models import Cover, CoverTag, Song, Instrument
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

        song: Song = Song.objects.first()
        last_song: Song = Song.objects.all().order_by("-id").first()
        instrument: Instrument = Instrument.objects.first()
        tag: CoverTag = CoverTag.objects.first()

        response = client.get(f"/api/cover/{song.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.post(
            f"/api/cover/{song.pk}/",
            json.dumps(
                {
                    "audio": None,
                    "title": "TEST_TITLE",
                    "description": "TEST_DESCRIPTION",
                    "instrument": instrument.pk,
                    "tags": [tag.pk],
                }
            ),
            content_type="form/data",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = client.post(
            f"/api/cover/{last_song.pk + 1}/",
            json.dumps({}),
            content_type="form/data",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=False)

        song: Song = Song.objects.first()
        instrument: Instrument = Instrument.objects.first()

        response = client.get(f"/api/cover/{song.pk}/{instrument.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=False)

        cover: Cover = Cover.objects.first()
        last_cover: Cover = Cover.objects.all().order_by("-id").first()

        response = client.get(f"/api/cover/like/{cover.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get(f"/api/cover/like/{last_cover.pk + 1}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        like_count = cover.like_count
        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": True}),
            content_type="application/json",
        )
        cover: Cover = Cover.objects.get(pk=cover.pk)
        self.assertEqual(cover.like_count, like_count + 1)

        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": False}),
            content_type="application/json",
        )
        cover: Cover = Cover.objects.get(pk=cover.pk)
        self.assertEqual(cover.like_count, like_count)
