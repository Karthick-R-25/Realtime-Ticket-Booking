# Generated by Django 4.2.20 on 2025-04-04 16:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bus', '0009_ticketcode_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticketcode',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
