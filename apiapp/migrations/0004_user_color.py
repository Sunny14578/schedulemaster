# Generated by Django 4.2.5 on 2023-10-01 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiapp', '0003_rename_user_id_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='color',
            field=models.CharField(default='#000000', max_length=255),
        ),
    ]