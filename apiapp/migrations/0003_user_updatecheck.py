# Generated by Django 4.2.5 on 2023-11-01 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiapp', '0002_alter_schedulecell_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='updateCheck',
            field=models.IntegerField(default=0),
        ),
    ]