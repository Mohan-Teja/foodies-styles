# Generated by Django 4.1.1 on 2022-10-02 16:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recipe", "0002_alter_listing_main_photo_alter_listing_photo_1_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="listing",
            name="contributor",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
