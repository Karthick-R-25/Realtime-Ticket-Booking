from django.db import models
from django.utils import timezone,text

from datetime import datetime


class Bus(models.Model):
    bus_id = models.CharField(max_length=20,null=True)
    chassis_number = models.CharField(max_length=30)
    mobile_number = models.CharField(max_length=10)
    password = models.CharField(max_length=100)
    registration_certificate = models.FileField(upload_to='registration_certificates/')
    date_add = models.DateField(default=timezone.now) 
class Passenger(models.Model):
    username = models.CharField(max_length=150, )
    mobile_number = models.CharField(max_length=10, unique=True)
    password = models.CharField(max_length=128) 
    date_add = models.DateField(default=timezone.now) 
class Add_route(models.Model):
     bus_id=models.TextField()
     from_stop = models.CharField(max_length=100)
     to_stop = models.CharField(max_length=100)
     price=models.IntegerField()



class TicketCode(models.Model):
    route = models.CharField(max_length=100)
    travel=models.IntegerField(default=1)
    price = models.IntegerField()
    ticket_code = models.CharField(max_length=10)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    user=models.CharField(max_length=30,default="User")
    created_at = models.DateTimeField(auto_now_add=True)
    bus_id=models.TextField(default="TN00V000")

    def __str__(self):
        return f"{self.route} - {self.ticket_code}"
class PassengerHistory(models.Model):
    route = models.CharField(max_length=255)
    price = models.IntegerField()
    travel = models.IntegerField()
    user = models.TextField(default="user")
    ticket_code = models.CharField(max_length=10)
    bus_id = models.CharField(max_length=20)
    created_at=models.TextField(default="not apply")
    moved_at=models.TextField(default="0:0")


