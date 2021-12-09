""" testing tools
tools for test band app
"""
from typing import List
from django.contrib.auth import get_user_model
from django.test import Client
from band.models import Combination, Instrument, Song, Cover, CoverTag
from user.models import CustomUser

User = get_user_model()

# pre datas
instrument_name_list = ["Bass", "Guitar", "Vocals", "Drum", "Keyboard"]


def make_user_data(i: int):
    return {"email": f"setup_{i}", "password": f"pwdpwd{i}"}


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


def make_instruments(name_list) -> List[Instrument]:
    instruments: List[Instrument] = []
    for name in name_list:
        instrument = Instrument(name=name)
        instrument.save()
        instruments.append(instrument)
    return instruments


def make_cover_tags(num: int) -> List[CoverTag]:
    cover_tags: List[CoverTag] = []
    for i in range(num):
        tag = CoverTag(name=f"COVER_TAG_{i}")
        tag.save()
        cover_tags.append(tag)
    return cover_tags


def make_users(num: int) -> List[User]:
    users: List[User] = []
    for i in range(num):
        user = User.objects.create_user(**make_user_data(i))
        users.append(user)
    return users


def make_songs(num: int) -> List[Song]:
    songs: List[Song] = []
    for i in range(num):
        song_data = make_song_data(i)
        song = Song(**song_data)
        song.save()
        songs.append(song)
    return songs


def set_up_data():
    """
      This func makes 5 instrument, 10 coverTags, 10 users,
    10 songs, 5 cover for each songs, combinations
    """
    instruments = make_instruments(instrument_name_list)
    cover_tags = make_cover_tags(10)
    users = make_users(10)
    songs = make_songs(10)
    covers: List[Cover] = []

    # make 5 cover for each Song
    for song in songs:
        for i in range(3):
            cover_data = make_cover_data(song.id, i)
            cover = Cover(
                **cover_data,
                user=users[(song.id + i) % len(users)],
                instrument=instruments[(song.id + i) % len(instruments)],
                song=song,
                audio="audio",
            )
            cover.save()
            cover.tags.set(
                [cover_tags[(idx * 7) % len(cover_tags)] for idx in range((i * 13) % 3)]
            )
            covers.append(cover)

    # make combinations
    for i, song in enumerate(songs):
        combi = Combination(view=i, song=song)
        combi.save()
        song_cover = Cover.objects.filter(song__id=song.id)
        combi_covers = []
        for j in range(3):
            cover = song_cover.filter(instrument__id=j).first()
            if cover is not None:
                combi_covers.append(cover)
        combi.covers.set(combi_covers)
        cover: Cover = song_cover.filter(instrument__id=4).first()
        if (cover is not None) and combi_covers:
            cover.combination = combi


def get_logined_client(user_id=1):
    client = Client(enforce_csrf_checks=False)
    user: CustomUser = User.objects.get(pk=user_id)
    client.force_login(user)
    return client
