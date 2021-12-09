"""
Test codes for band app
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from band.tests.tools import set_up_data, make_cover_data

from band.models import Combination, Instrument, Song, Cover


# pylint: disable=C0114
User = get_user_model()
instrument_name_list = ["Bass", "Guitar", "Vocal", "Drum", "Keyboard"]


class BandModelTest(TestCase):
    """
    TestCase Class for band app's models
    """

    @classmethod
    def setUpClass(cls):
        super(BandModelTest, cls).setUpClass()
        set_up_data()

    def test_instruments(self):
        self.assertEqual(Instrument.objects.count(), len(instrument_name_list))
        instrument = Instrument.objects.get(name=instrument_name_list[0])
        self.assertEqual(f"([{instrument.pk}] {instrument.name})", str(instrument))

    def test_song(self):
        self.assertEqual(Song.objects.count(), 10)
        random_song = Song.objects.order_by("?").first()

        self.assertEqual(f"([{random_song.pk}] {random_song.title})", str(random_song))

    def test_cover(self):
        user: User = User.objects.create_user(
            email="calli@bandcruit.com", password="ppwwddaa"
        )

        cover_data = make_cover_data(0, 0)
        cover = Cover(
            **cover_data,
            user=user,
            instrument=Instrument.objects.order_by("?").first(),
            song=Song.objects.order_by("?").first(),
        )
        cover.save()

        # test count likes
        self.assertEqual(cover.like_count, 0)

        # test __str__
        self.assertEqual(f"([{cover.pk}] {cover.title})", str(cover))

        # test on user delete
        user.delete()
        cover: Cover = Cover.objects.get(id=cover.id)
        self.assertIsNone(cover.user)

    def test_combination(self):
        sample_song: Song = Song.objects.order_by("?").first()
        sample_covers = sample_song.covers.all()

        combination = Combination(view=100, song=sample_song)
        combination.save()
        combination.covers.set(sample_covers)

        combination = Combination.objects.get(id=combination.id)
        # test __str__
        self.assertEqual(
            f"([{combination.pk}] {combination.song} combination)", str(combination)
        )
