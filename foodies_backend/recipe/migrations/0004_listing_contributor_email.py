# Generated by Django 4.1.1 on 2022-10-02 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipe", "0003_alter_listing_contributor"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="contributor_email",
            field=models.EmailField(max_length=255, null=True),
        ),
    ]