# Generated by Django 4.1.2 on 2022-10-12 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customabstractuser',
            name='profile_description',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='customabstractuser',
            name='profile_photo',
            field=models.ImageField(default='profile_photos/default_m_photo.png', upload_to='profile_photos/%Y/%m/%d'),
        ),
    ]
