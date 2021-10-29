from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager


class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, db_column='Username', default='')
    email = models.EmailField(_('email address'), unique=True, max_length=30)
    first_name = None
    last_name = None
    description = models.TextField(db_column='description', default='')
    photo = models.ImageField(upload_to='profile_pic', default=None)
    followings = models.ManyToManyField('CustomUser', related_name='followers', db_table='User_Following')
    instruments = models.ManyToManyField('band.Instrument', related_name='+', db_table='User_Instruments')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f'([{self.id}] {self.email})'

    class Meta:
        db_table = "User"
