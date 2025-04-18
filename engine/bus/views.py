from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from itertools import chain
from django.shortcuts import render,redirect
from django.utils import timezone,text
from datetime import timedelta
from django.contrib.auth import logout
from .models import Bus,Passenger,Add_route,TicketCode,PassengerHistory
import random, json


otp_storage = {}
def home(request):
    return render(request,"base.html")
@csrf_exempt
def send_otp(request, mobile_number):
    otp = str(random.randint(100000, 999999))
    otp_storage[mobile_number] = otp  # Store OTP (temporary - replace with real DB)
    print(f"OTP sent to {mobile_number}: {otp}")  # Debug (send SMS in real implementation)
    return JsonResponse({'success': True,'otp':otp})
@csrf_exempt
def verify_otp(request, mobile_number):
    if request.method == 'POST':  # Ensure it processes POST requests only
        try:
            # Parse JSON body from POST request
            data = json.loads(request.body)
            user_otp = data.get('otp')

            # Debugging: Check if OTP exists in storage and is correct
            stored_otp = otp_storage.get(mobile_number)
            print(f"Stored OTP: {stored_otp}, User OTP: {user_otp}")  # For debugging

            if stored_otp is None:
                return JsonResponse({'otp_match': False, 'error': 'OTP not found for this mobile number'}, status=404)

            if stored_otp == user_otp:
                return JsonResponse({'otp_match': True})
            else:
                return JsonResponse({'otp_match': False, 'error': 'Incorrect OTP'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in the request body'}, status=400)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed on this endpoint'}, status=405)
@csrf_exempt
def register_bus(request):
    
    if request.method == 'POST':
        data = json.loads(request.body)
        bus_id = data.get('bus_id')
        chassis_number = data.get('chassis_number')
        mobile_number = data.get('mobile_number')
        password = data.get('password')
        registration_certificate = request.FILES.get('registration_certificate')
        print(bus_id)
      
        if Bus.objects.filter(bus_id=bus_id).exists():
                return JsonResponse({"success": False, "message": "Bus id already registered"}, status=400)
        Bus.objects.create(
            bus_id=bus_id,
            chassis_number=chassis_number,
            mobile_number=mobile_number,
            password=password,
            registration_certificate=registration_certificate
        )
        print(Bus.objects.all)

        return JsonResponse({'success': True})
@csrf_exempt    
def register_passenger(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        username = data.get('username')
        mobile_number = data.get('mobile_number')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        # Validate input fields
        if not all([username, mobile_number, password, confirm_password]):
            return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
        
    
        # Check if the mobile number is already registered
        if Passenger.objects.filter(mobile_number=mobile_number).exists():
            return JsonResponse({"success": False, "message": "Mobile number already registered."}, status=400)

        # Save the new passenger
        Passenger.objects.create(
            username=username,
            mobile_number=mobile_number,
            password=password 
        )

        return JsonResponse({"success": True, "message": "Passenger registered successfully."})

    return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

# this is for login
@csrf_exempt
def conductor_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        bus_id = data.get('bus_id')
        password = data.get('password')

        try:
            conductor = Bus.objects.get(bus_id=bus_id)
            if conductor.password == password:  # Simplified check (for production, hash passwords)
                request.session['bus_id'] = conductor.bus_id
                request.session['password'] = conductor.password
                
                
                return JsonResponse({'success': True,'bus_id': conductor.bus_id, 'password': conductor.password})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid password.'}, status=400)
        except Bus.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid Bus ID.'}, status=400)
@csrf_exempt    
def conductor_dashboard(request):
    move_expired_tickets(request)
    if 'password' in request.session and 'bus_id' in request.session:
        
        password = request.session['password']
        bus_id = request.session['bus_id']
        return render(request,'conduct.html',{ 'password':password,'bus_id': bus_id})
    else:
        return redirect('/conductor-login/')
#    this is for passenger login
@csrf_exempt
def passenger_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        mobile_number= data.get('mobile')
        password = data.get('password')

        try:
            Passengers =Passenger.objects.get(mobile_number=mobile_number)
            if Passengers.password == password:  # Simplified check (for production, hash passwords)
                request.session['mobile'] = Passengers.mobile_number
                request.session['password'] = Passengers.password
                request.session['username'] = Passengers.username

                
                return JsonResponse({'success': True, 'password': Passengers.password, 'mobile': Passengers.mobile_number,"username":Passengers.username})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid password.'}, status=400)
        except Passenger.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid mobile number'}, status=400)
@csrf_exempt
def passenger_dashboard(request):
    if 'password' in request.session and 'mobile' in request.session:
        password = request.session['password']
        mobile = request.session['mobile']
        username=request.session['username']
        return render(request,'buspassen.html',{ 'password':password,'mobile':mobile,'username':username})
    else:
        return redirect('/passenger-login/')    
@csrf_exempt
def add_route(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request
            data = json.loads(request.body)
            bus_id = data.get('bus_id')
            prices = data.get('prices')

            # Validate that bus_id and prices are not missing
            if not bus_id or not prices:
                return JsonResponse({"error": "Missing bus_id or prices data"}, status=400)

            # Loop through the stop combinations and save to the database
            for route_key, price in prices.items():
                try:
                    # Splitting 'from_stop' and 'to_stop'
                    from_stop, to_stop = route_key.split(" to ")
                    Add_route.objects.create(
                        bus_id=bus_id,
                        from_stop=from_stop.strip(),
                        to_stop=to_stop.strip(),
                        price=price
                    )
                except ValueError:
                    return JsonResponse({"error": f"Invalid route format: {route_key}"}, status=400)

            return JsonResponse({"message": "Stop-to-stop pricing data saved successfully!"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return redirect('conductor_dashboard/') 
@csrf_exempt
def get_routes(request, bus_id):
    routes = Add_route.objects.filter(bus_id=bus_id).values('from_stop', 'to_stop', 'price')
    return JsonResponse(list(routes), safe=False)
@csrf_exempt
def save_ticket_code(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            route = data.get('route')
            price = data.get('price')
            Travel=data.get('Travel')
            username=data.get('username')
            ticket_code = data.get('ticket_code')
            busId=data.get('busId'),
            mobile=data.get("mobile")
            
            TicketCode.objects.create(
                route=route,
                price=price,
                travel=Travel,
                user=username,
                ticket_code=ticket_code,
                bus_id=busId,
                mobile=mobile
            )
            allticket=TicketCode.objects.all()
            print(allticket)
            return JsonResponse({"message": "Ticket saved successfully!"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
@csrf_exempt
def verification_code(request, code, busno):
    try:
        print(busno)
        allticket=TicketCode.objects.all()
        print(allticket)
        ticket = TicketCode.objects.get(ticket_code=code, bus_id=busno)
        ticket_data = [
            ticket.route,
            ticket.price,
            ticket.travel,
            ticket.user
           
        ]
       
        return JsonResponse(ticket_data, safe=False)
    except TicketCode.DoesNotExist:
        return JsonResponse({"message": "Invalid code or bus number"}, status=404)
@csrf_exempt
def move_expired_tickets(request):
    expiration_time = timezone.now() - timedelta(hours=2)
    expired_tickets = TicketCode.objects.filter(created_at__lte=expiration_time)

    for ticket in expired_tickets:
        PassengerHistory.objects.create(
            route=ticket.route,
            price=ticket.price,
            travel=ticket.travel,
            user=ticket.user,
            ticket_code=ticket.ticket_code,
            bus_id=ticket.bus_id,
            mobile=ticket.mobile
        )
        ticket.delete()
@csrf_exempt
def move_ticket_to_history(request,verification_code):
    try:
        ticket = TicketCode.objects.get(ticket_code=verification_code)

        # Create history entry before deleting
        PassengerHistory.objects.create(
            route=ticket.route,
            price=ticket.price,
            travel=ticket.travel,
            user=ticket.user,  # Must be a valid Passenger instance
            bus_id=ticket.bus_id,
            ticket_code=ticket.ticket_code,
            mobile=ticket.mobile,#changed
            created_at=ticket.created_at,
            moved_at=timezone.now(),  # If you have a moved_at field
        )
        ticket.delete()
        return JsonResponse({"message":"History created successfully"})

    except TicketCode.DoesNotExist:
        return JsonResponse({"error": "Ticket not found"}, status=404)
@csrf_exempt
def pass_history(request):
        data = PassengerHistory.objects.all()
        result = []
        try:
          for item in data:
            result.append({
                "route": item.route,
                "price": item.price,
                "travel": item.travel,
                "user": item.user,
                "bus_id":item.bus_id
            })
          return JsonResponse(result, safe=False)
        except:
            return JsonResponse({"message":"passenger history failed"},status=400)
@csrf_exempt
def logout_view(request):
    logout(request)  # Ends session
    return redirect('base.html')
@csrf_exempt
def pass_code(request):
       if request.method=="POST":
           data = json.loads(request.body)
           passcode=data.get('code')
           bus_id=data.get('busid')
           codes= TicketCode.objects.all()
           exists = TicketCode.objects.filter(bus_id=bus_id, ticket_code=passcode).exists()
           return JsonResponse({"available": not exists,"codes":passcode})
@csrf_exempt
def reset_stops(request):
         if request.method=="POST":
            data=json.loads(request.body)
            busid=data.get("delbus")
            print(busid)
            Add_route.objects.filter(bus_id=busid).delete()
            return JsonResponse({"message":"Stop deleted Sucessfully"})
@csrf_exempt
def bus_history(request,mobilenum):
      if request.method=="GET":
          qs1=TicketCode.objects.filter(mobile=mobilenum)
          qs2=PassengerHistory.objects.filter(mobile=mobilenum)
          combined_qs=chain(qs1, qs2)
          result=[]
          for item in combined_qs:
              result.append({
                  "route":item.route,
                   "price": item.price,
                   "travel": item.travel,
                    "user": item.user,
                    "bus_id":item.bus_id,
                    "mobile":item.mobile

              })
          return JsonResponse({"data":result})

        

        
