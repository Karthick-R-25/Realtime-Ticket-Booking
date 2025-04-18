# **Real-Time Ticket Booking System**

This is a **Real-Time Ticket Booking System** for bus routes, built with the following technologies:

### **Frontend:**
- **HTML**
- **CSS**
- **JavaScript**
- **Bootstrap**

### **Backend:**
- **Python**
- **Django**
- **REST API**
- **SQL** (PostgreSQL)

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
   git clone https://github.com/yourusername/Realtime-Ticket-Booking.git
