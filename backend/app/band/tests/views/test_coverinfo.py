"""
Test codes for band cover info
"""
import json
from django.test import TestCase, Client
from rest_framework import status

from band.models import Cover, CoverTag, Instrument
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
        client = Client(enforce_csrf_checks=False)

        cover: Cover = Cover.objects.first()
        last_cover: Cover = Cover.objects.all().order_by("-id").first()

        response = client.get(f"/api/cover/info/{cover.pk}/")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK, "Success to get cover info"
        )

        response = client.get(f"/api/cover/info/{last_cover.pk + 1}/")
        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND, "Not exist id"
        )

        client.force_login(cover.user)  # login as cover maker

        response = client.put(
            f"/api/cover/info/{cover.pk}/",
            json.dumps(
                {
                    "title": "NEW_TITLE",
                    "description": "NEW_DESCRIPTION",
                    "tags": ["COVER_TAG_1", "COVER_TAG_4"],
                    "instrument": 2,
                }
            ),
            content_type="application/json",
        )
        cover: Cover = Cover.objects.get(pk=cover.pk)

        self.assertEqual(
            response.status_code, status.HTTP_200_OK, "Success to put cover info"
        )
        self.assertEqual(cover.title, "NEW_TITLE", "Cover title will be changed")
        self.assertEqual(
            cover.description, "NEW_DESCRIPTION", "Cover description will be changed"
        )
        new_instrument: Instrument = Instrument.objects.get(pk=2)
        self.assertEqual(
            cover.instrument.name, new_instrument.name, "Instrument will be changed"
        )

        for tag in cover.tags.all():
            self.assertIn(
                tag.name,
                ["COVER_TAG_1", "COVER_TAG_4"],
                "Cover description will changed",
            )
        self.assertEqual(
            cover.tags.all().count(),
            CoverTag.objects.filter(name__in=["COVER_TAG_1", "COVER_TAG_4"]).count(),
        )

        response = client.delete(f"/api/cover/info/{cover.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            Cover.objects.filter(pk=cover.pk).count(), 0, "Delete a Cover success"
        )
