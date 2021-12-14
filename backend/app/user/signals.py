"""Handle signal about CustomUser"""
import os
from django.db.models.signals import pre_save
from django.dispatch import receiver
from user.models import CustomUser


@receiver(pre_save, sender=CustomUser)
# pylint: disable=unused-argument
def pre_save_user(sender, instance, *arg, **kwargs):
    """Delete old profile image when update profile"""
    try:
        old_img = instance.__class__.objects.get(id=instance.id).photo.path
        new_img = instance.photo.path
        if new_img != old_img:
            if os.path.exists(old_img):
                os.remove(old_img)
    except (ValueError, instance.__class__.DoesNotExist):
        # no exist file
        pass
