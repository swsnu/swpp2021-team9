""" band models
Django models for band
"""
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.contrib.auth import get_user_model


User = get_user_model()


class Instrument(models.Model):
    """Model for Instrument
    :type name: str
    :field name: The name of instrument
    """

    name: str = models.CharField(max_length=30, db_column="name")

    def __str__(self):
        return f"([{self.pk}] {self.name})"

    class Meta:
        db_table = "Instrument"


class Song(models.Model):
    """Model for Song
    :field title: The title of this song
    :field singer: The singer of this song
    :field category: The genre of this song
    :field reference: Youtube link url of this song
    :field description: The description of this song
    """

    title: str = models.CharField(max_length=50, db_column="title")
    singer: str = models.CharField(max_length=50, db_column="singer")
    category: str = models.CharField(max_length=30, db_column="category")
    reference: str = models.CharField(max_length=255, db_column="reference")
    description: str = models.TextField(db_column="description", blank=True)

    def __str__(self):
        return f"([{self.pk}] {self.title})"

    class Meta:
        db_table = "Song"


class Cover(models.Model):
    """Model for Cover
    :field audio: The audio file of this cover
    :field title: The title of this cover
    :field category: The genre of this cover
    :field description: Youtube link url of this cover
    :field user: The 'User' of this cover
    :field instrument: The instrument played with.
    :field song: The 'Song' of this cover
    :field tags: The 'CoverTag's of this cover
    :field likes: The 'User's who likes this cover.
    :field views: The view count for this cover
    :field combination: The 'Combination' this cover was made to / null if there was no combination
    """

    audio = models.FileField(upload_to="cover_audio", editable=False)
    title: str = models.CharField(max_length=50, db_column="title")
    category: str = models.CharField(
        max_length=30, db_column="category", editable=False
    )
    description: str = models.TextField(db_column="description", blank=True)
    user: User = ForeignKey(
        User, related_name="covers", on_delete=models.SET_NULL, null=True
    )
    instrument: Instrument = ForeignKey(
        Instrument, related_name="+", on_delete=models.SET_NULL, null=True
    )
    song: Song = ForeignKey(Song, related_name="covers", on_delete=models.CASCADE)
    tags = ManyToManyField("CoverTag", db_table="Cover_Tags", blank=True)
    likes = ManyToManyField(
        User, db_table="Cover_Likes", related_name="like_covers", blank=True
    )
    views: int = IntegerField(db_column="view", default=0)
    combination: "Combination" = ForeignKey(
        "Combination",
        related_name="+",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def __str__(self):
        return f"([{self.pk}] {self.title})"

    class Meta:
        db_table = "Cover"


class Combination(models.Model):
    """Combination model"""

    view: int = IntegerField(db_column="view", default=0)
    song: Song = ForeignKey(Song, related_name="combinations", on_delete=models.CASCADE)
    covers = ManyToManyField(Cover, db_table="Cover_Combination", related_name="+")
    likes = ManyToManyField(
        User, db_table="Combination_Likes", related_name="like_combinations", blank=True
    )

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def __str__(self):
        return f"([{self.pk}] {self.song} combination)"

    class Meta:
        db_table = "Combination"


class CoverTag(models.Model):
    """CoverTag model"""

    name: str = CharField(max_length=30, db_column="name")

    class Meta:
        db_table = "CoverTag"


class CoverLog(models.Model):
    """CoverLog model"""

    user: User = ForeignKey(
        User, related_name="+", on_delete=models.SET_NULL, null=True
    )
    cover: Cover = ForeignKey(Cover, related_name="+", on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CoverLog"


class CombinationLog(models.Model):
    """CombinationLog model"""

    user: User = ForeignKey(
        User, related_name="+", on_delete=models.SET_NULL, null=True
    )
    combination: Combination = ForeignKey(Combination, on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CombinationLog"
