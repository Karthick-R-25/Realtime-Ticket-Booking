import json
import random
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from .models import Bus

# Utility to simulate OTP sending
def send_otp(mobile_number, otp):
    print(f"OTP sent to {mobile_number}: {otp}")  # Simulate OTP sending (can be integrated with SMS API)


# View to send OTP to the provided mobile number
def send_otp_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        mobile_number = data.get('mobile_number')

        if len(mobile_number) != 10 or not mobile_number.isdigit():
            return JsonResponse({'message': 'Invalid mobile number. Please enter a 10-digit number.'})

        otp = str(random.randint(100000, 999999))
        send_otp(mobile_number, otp)  # Simulate sending the OTP
        request.session['otp'] = otp  # Store OTP in session
        return JsonResponse({'message': f'OTP sent successfully to {mobile_number}!'})

    return JsonResponse({'message': 'Invalid request method.'})


# View to handle bus registration form submission
def register_bus_view(request):
    if request.method == 'POST':
        bus_id = request.POST['bus_id']
        chassis_number = request.POST['chassis_number']
        mobile_number = request.POST['mobile_number']
        otp = request.POST['otp']
        password = request.POST['password']
        file = request.FILES['registration_certificate']

        # Verify the OTP
        if otp != request.session.get('otp'):
            return JsonResponse({'message': 'Invalid OTP. Please try again!'})

        # Check if the bus ID, chassis number, or mobile number already exists
        if Bus.objects.filter(bus_id=bus_id).exists():
            return JsonResponse({'message': 'Bus ID already registered.'})
        if Bus.objects.filter(chassis_number=chassis_number).exists():
            return JsonResponse({'message': 'Chassis number already registered.'})
        if Bus.objects.filter(mobile_number=mobile_number).exists():
            return JsonResponse({'message': 'Mobile number already registered.'})

        # Save bus details with hashed password
        Bus.objects.create(
            bus_id=bus_id,
            chassis_number=chassis_number,
            mobile_number=mobile_number,
            password=make_password(password),  # Hash the password for security
            registration_certificate=file
        )

        return JsonResponse({'message': 'Bus registration successful!'})

    return JsonResponse({'message': 'Invalid request method.'})