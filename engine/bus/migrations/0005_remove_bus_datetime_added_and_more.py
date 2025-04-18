# Generated by Django 4.2.20 on 2025-03-25 03:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bus', '0004_bus_datetime_added_passenger_datetime_added'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bus',
            name='datetime_added',
        ),
        migrations.RemoveField(
            model_name='passenger',
            name='datetime_added',
        ),
        migrations.AddField(
            model_name='bus',
            name='date_add',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='passenger',
            name='date_add',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
