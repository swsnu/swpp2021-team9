"""
Test codes for user app
"""
from django.contrib.auth import get_user_model
from django.test import TestCase, Client

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


class SongTestCase(TestCase):
    """Tests for user"""

    def setUp(self):
        pass

    def test_user_signup(self):
        client = Client(enforce_csrf_checks=False)

        response = client.post("/api/user/signup/", {})
        self.assertEqual(response.status_code, 201)

    def test_user_signin(self):
        client = Client(enforce_csrf_checks=False)

        response = client.post("/api/user/signin/", {})
        self.assertEqual(response.status_code, 204)

    def test_user_signout(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/user/signout/")
        self.assertEqual(response.status_code, 204)

    def test_user_info(self):
        client = Client(enforce_csrf_checks=False)

        response = client.get("/api/user/info/1/")
        self.assertEqual(response.status_code, 200)

        response = client.put("/api/user/info/1/", {})
        self.assertEqual(response.status_code, 200)

        response = client.delete("/api/user/info/1/")
        self.assertEqual(response.status_code, 204)
