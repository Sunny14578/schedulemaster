# Generated by Django 4.2.5 on 2023-09-23 13:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apiapp', '0002_rename_username_user_name_user_groups_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='user_id',
            new_name='id',
        ),
    ]
