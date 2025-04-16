from django.urls import path
from . import views

urlpatterns = [
    path("",views.home,name="homepage"),
    path('send-otp/<str:mobile_number>/', views.send_otp, name='send_otp'),
    path('verify-otp/<str:mobile_number>/', views.verify_otp, name='verify_otp'),
    path('register-bus/', views.register_bus, name='register_bus'),
    path('register-passenger/',views.register_passenger, name='register_pass'),
    path('conductor-login/',views.conductor_login,name="conductor_login"),
    path('conductor_dashboard/',views.conductor_dashboard,name="conductor_interface"),
    path('passenger-login/',views.passenger_login,name="passenger_login"),
    path('passenger_dashboard/',views.passenger_dashboard,name="passenger_interface"),
    path('conductor_dashboard/add_route/',views.add_route,name="add_routes"),
    path('get_routes/<str:bus_id>/',views.get_routes, name='get_routes'),
    path('save_ticket_code/', views.save_ticket_code, name='save_ticket_code'),
    path('verify_code/<str:code>/<str:busno>/',views.verification_code,name='verify_code'),
    path("auto_delete",views.move_expired_tickets,name="auto_delete"),
    path("history_code/<int:verification_code>/",views.move_ticket_to_history,name="print_after_delete"),
    path("pass_history",views.pass_history,name="pass_history"),
    path("logout",views.logout_view,name="pass_history"),
    path("pass_code",views.pass_code,name="pass_history"),
    path("delete",views.reset_stops,name="pass_history")

    
]
