# Generated by Django 4.1.2 on 2022-11-02 10:24

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_customabstractuser_profile_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customabstractuser',
            name='subscriptions',
            field=models.ManyToManyField(blank=True, null=True, to=settings.AUTH_USER_MODEL),
        ),
    ]