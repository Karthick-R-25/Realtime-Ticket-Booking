# Generated by Django 4.2.20 on 2025-04-05 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bus', '0012_ticketcode_travel'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticketcode',
            name='user',
            field=models.CharField(default='User', max_length=30),
        ),
    ]
