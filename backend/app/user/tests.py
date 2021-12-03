"""
Test codes for user app
"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from rest_framework import status
from .models import CustomUser

# pylint: disable=C0114
User = get_user_model()


class UserManagersTests(TestCase):
    """
    TestCase Class for User managements

    Test creation of normal user and super user
    """

    def test_create_user(self):
        user = User.objects.create_user(
            email="calli@bandcruit.com", password="ppwwddaa"
        )
        self.assertEqual(user.email, "calli@bandcruit.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email="")
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="foo")

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email="super@user.com", password="foo"
        )
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="super@user.com", password="foo", is_superuser=False
            )
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="super@user.com",
                password="foo",
                is_superuser=True,
                is_staff=False,
            )

    def test_user_str(self):
        user = User.objects.create_user(email="super@user.com", password="foo")
        preview_str = str(user)
        self.assertEqual(f"([{user.id}] {user.email})", preview_str)


class UserTestCase(TestCase):
    """Tests for user"""

    @classmethod
    def setUpClass(cls):
        super(UserTestCase, cls).setUpClass()
        User.objects.create_user(email="EMAIL_1", password="PASSWORD_1")
        User.objects.create_user(email="EMAIL_2", password="PASSWORD_2")

    def test_user_sign(self):
        client = Client(enforce_csrf_checks=False)

        test_user_info = {"email": "EMAIL_TEST", "password": "PASSWORD_TEST"}

        # signup with wrong format
        response = client.post(
            "/api/user/signup/",
            json.dumps(
                {
                    "email": "EMAIL_TEST",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # signup with correct format
        response = client.post(
            "/api/user/signup/",
            json.dumps(test_user_info),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user: CustomUser = User.objects.get(email="EMAIL_TEST")
        self.assertTrue(new_user)

        # signout without signing in
        response = client.get("/api/user/signout/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # signin with wrong format
        response = client.post(
            "/api/user/signin/",
            json.dumps(
                {
                    "email": "EMAIL_TEST",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # signin with wrong info
        response = client.post(
            "/api/user/signin/",
            json.dumps(
                {
                    "email": "EMAIL_WRONG",
                    "password": "PASSWORD_WRONG",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # signin with correct info
        response = client.post(
            "/api/user/signin/",
            json.dumps(test_user_info),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # signout
        response = client.get("/api/user/signout/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_info(self):
        client = Client(enforce_csrf_checks=False)
        user: CustomUser = User.objects.get(pk=1)

        response = client.get(f"/api/user/info/{user.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_dict = json.loads(response.content)
        self.assertEqual(content_dict["email"], user.email)

        # login
        client.force_login(user)

        response = client.put(
            f"/api/user/info/{user.pk}/",
            {"description": "DESCRIPTION_TEST"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user_edited: CustomUser = User.objects.first()
        self.assertEqual(user_edited.description, "DESCRIPTION_TEST")

        # try changing different user's data
        user_new: CustomUser = User.objects.get(pk=2)
        response = client.put(
            f"/api/user/info/{user_new.pk}/",
            {"description": "DESCRIPTION_TEST"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete user
        response = client.delete(f"/api/user/info/{user.pk}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertEqual(
            User.objects.filter(pk=user.pk).count(), 0, "Delete User success"
        )
