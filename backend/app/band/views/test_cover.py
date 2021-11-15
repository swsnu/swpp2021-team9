from django.test import TestCase, Client
from band.models import *
from django.contrib.auth import get_user_model
User = get_user_model()


class CoverTestCase(TestCase):
    def setUp(self):
        pass

    def test_cover(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value
