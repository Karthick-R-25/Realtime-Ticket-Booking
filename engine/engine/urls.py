"""
URL configuration for engine project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("bus.urls")),
    path('send-otp/',include("bus.urls")),
    path('register-bus/',include("bus.urls")),
    path('register-passenger/',include("bus.urls")),
    path('/conductor-login/',include("bus.urls")),
    path('conductor_dashboard/',include("bus.urls")),
    path('passenger-login/',include("bus.urls")),
    path('passenger_dashboard/',include("bus.urls")),
    path('conductor_dashboard/add_route/',include("bus.urls")),
    path('get_routes/<str:bus_id>/',include("bus.urls")),
    path('save_ticket_code/', include("bus.urls")),
    path('verify_code/<str:code>/<str:busno>/',include("bus.urls")),
    path("auto_delete",include("bus.urls")),
    path("history_code/<int:verification_code>/",include("bus.urls")),
    path("logout",include("bus.urls")),
    path("pass_code",include("bus.urls")),
    path("delete",include("bus.urls")),
    path("bus_history/<str:mobilenum>/",include("bus.urls"))
   
]
