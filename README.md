# **Real-Time Ticket Booking System**

This is a **Real-Time Ticket Booking System** for local and overcrowded Buses  , built with the following technologies:
[![🔗 View GitHub](https://youtu.be/PUGRdFZtRf4)](https://github.com/Karthick-R-25/Realtime-Ticket-Booking)

### **Frontend:**
- **HTML**
- **CSS**
- **JavaScript**
- **Bootstrap**

### **Backend:**
- **Python**
- **Django**
- **REST API**
- **SQL** (MYSQL)

### **Authentication and Security:**
- **CSRF Token** for protection against cross-site request forgery

### **Features:**
- **Passenger Registration:** Passengers register with their details, including mobile number.
- **Bus Owner Registration:** Bus owners register with their license plate number and required details.
- **Conductor Dashboard:** The conductor can log in and manage routes, along with their prices.
- **Dynamic Pricing for Passengers:** Passengers log in, enter the bus ID and passenger count to see available stops and dynamic pricing.
- **Payment and Verification:** After making a payment, passengers receive a unique 3-digit code for verifying their route, price, and details.
- **Ticket Generation:** Conductor verifies the code, confirms passenger details, and prints the ticket. All information is stored in the passenger history.

### **Technologies Used:**
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Python, Django, REST API, PostgreSQL, SQL
- **Security:** CSRF Token, User Authentication

### **Setup and Installation:**

1. Clone the repository:
   ```bash
   git clone https://github.com/Karthick-R-25/Realtime-Ticket-Booking.git
### **Setup and Running the Project**
2.### MySQL Database Configuration in Django

To configure your MySQL database in Django, update the `DATABASES` setting in your `settings.py` file like the following:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Use MySQL database engine
        'NAME': 'yourdb_name',                 # Your database name
        'USER': 'root',                        # Your MySQL username
        'PASSWORD': 'Your_password',           # Your MySQL password
        'HOST': 'localhost',                   # Host of the database, use 'localhost' or your server IP
        'PORT': '3306',                        # Default MySQL port
    }
}


3. **Create and Activate Virtual Environment:**
   For Linux/MacOS:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   cd engine
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver



