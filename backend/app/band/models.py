from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.contrib.auth import get_user_model


User = get_user_model()


class Instrument(models.Model):
    name: str = models.CharField(max_length=30, db_column='name')

    def __str__(self):
        return f'([{self.pk}] {self.name})'

    class Meta:
        db_table = "Instrument"


class Song(models.Model):
    title: str = models.CharField(max_length=50, db_column='title')
    singer: str = models.CharField(max_length=50, db_column='singer')
    category: str = models.CharField(max_length=30, db_column='category')
    reference: str = models.CharField(max_length=255, db_column='reference')
    description: str = models.TextField(db_column='description')

    def __str__(self):
        return f'([{self.pk}] {self.title})'

    class Meta:
        db_table = "Song"


class Cover(models.Model):
    audio = models.FileField(upload_to='cover_audio')
    title: str = models.CharField(max_length=50, db_column='title')
    category: str = models.CharField(max_length=30, db_column='category')
    description: str = models.TextField(db_column='description')
    user: User = ForeignKey(User, related_name='covers', on_delete=models.SET_NULL, null=True)
    instrument: Instrument = ForeignKey(Instrument, related_name='+', on_delete=models.SET_NULL, null=True)
    song: Song = ForeignKey(Song, related_name='covers', on_delete=models.CASCADE)
    tags = ManyToManyField('CoverTag', db_table='Cover_Tags')
    likes = ManyToManyField(User, db_table='Cover_Likes', related_name='like_covers')
    view: int = IntegerField(db_column='view', default=0)

    def __str__(self):
        return f'([{self.pk}] {self.title})'

    class Meta:
        db_table = "Cover"


class Combination(models.Model):
    view: int = IntegerField(db_column='view', default=0)
    song: Song = ForeignKey(Song, related_name='combinations', on_delete=models.CASCADE)
    covers = ManyToManyField(Cover, db_table='Cover_Combination', related_name='+')
    likes = ManyToManyField(User, db_table='Combination_Likes', related_name='like_combinations')

    def __str__(self):
        return f'([{self.pk}] {self.song.title} combination)'

    class Meta:
        db_table = "Combination"


class CoverTag(models.Model):
    name: str = CharField(max_length=30, db_column='name')

    def __str__(self):
        return f'([{self.pk}] {self.name})'

    class Meta:
        db_table = "CoverTag"


class CoverLog(models.Model):
    user: User = ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True)
    cover: Cover = ForeignKey(Cover, related_name='+', on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'([{self.pk}] {self.cover.title})'

    class Meta:
        db_table = "CoverLog"


class CombinationLog(models.Model):
    user: User = ForeignKey(User, related_name='+', on_delete=models.SET_NULL, null=True)
    combination: Combination = ForeignKey(Combination, on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'([{self.pk}] {self.combination.title})'

    class Meta:
        db_table = "CombinationLog"
