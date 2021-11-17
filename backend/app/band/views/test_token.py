"""
Test codes for token
"""
from django.test import TestCase, Client


class TokenTestCase(TestCase):
    """Tests for token"""

    def test_token(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get("/api/token/")
        self.assertEqual(response.status_code, 204)
        # csrftoken = response.cookies["csrftoken"].value
