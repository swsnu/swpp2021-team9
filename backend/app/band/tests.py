"""
Test codes for band app
"""
from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Combination, Instrument, Song, Cover


# pylint: disable=C0114
User = get_user_model()
instrument_name_list = ["Bass", "Guitar", "Vocals", "Drum", "Keyboard"]


def make_song_data(i: int):
    return {
        "title": f"SONG_TITLE{i}",
        "singer": f"SONG_SINGER{i}",
        "category": f"SONG_CATEGORY{i}",
        "reference": f"SONG_REFERENCE{i}",
        "description": f"SONG_DESCRIPTION{i}",
    }


def make_cover_data(song_id: int, i: int):
    return {
        "title": f"COVER_TITLE{song_id}_{i}",
        "category": f"COVER_CATEGORY{song_id}_{i}",
        "description": f"COVER_DESCRIPTION{song_id}_{i}",
        "views": (song_id * i * 100000) % 9883,
    }


class BandModelTest(TestCase):
    """
    TestCase Class for band app's models
    """

    @classmethod
    def setUpClass(cls):
        super(BandModelTest, cls).setUpClass()

        # Make user
        user = User.objects.create_user(
            email="setup@bandcruit.com", password="setuppwd"
        )

        # Make Instruments
        for instrument_name in instrument_name_list:
            Instrument(name=instrument_name).save()

        # Make Songs and Covers
        for i in range(100):
            song_data = make_song_data(i)
            song = Song(**song_data)
            song.save()

            for j in range(10):
                cover_data = make_cover_data(i, j)
                cover = Cover(
                    **cover_data,
                    user=user,
                    instrument=Instrument.objects.order_by("?").first(),
                    song=Song.objects.order_by("?").first(),
                )
                cover.save()

    def test_instruments(self):
        self.assertEqual(Instrument.objects.count(), len(instrument_name_list))
        instrument = Instrument.objects.get(name=instrument_name_list[0])
        self.assertEqual(f"([{instrument.pk}] {instrument.name})", str(instrument))

    def test_song(self):
        self.assertEqual(Song.objects.count(), 100)
        random_song = Song.objects.order_by("?").first()

        self.assertEqual(f"([{random_song.pk}] {random_song.title})", str(random_song))

    def test_cover(self):
        user = User.objects.create_user(
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

        # test __str__
        self.assertEqual(f"([{cover.pk}] {cover.title})", str(cover))

        # test on user delete
        user.delete()
        cover = Cover.objects.get(id=cover.id)
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
