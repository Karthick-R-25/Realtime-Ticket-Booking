let popup=document.getElementById("pass")
let conup=document.getElementById("conduct")
let psign=document.getElementById("signpass")
let pcon=document.getElementById("signconduct")
let statuses=document.getElementById("statuses")
let status_h2=document.getElementById("status-h2")
let status_img=document.getElementById("status-img")
let errors=document.getElementById("con-reg-error")
let paserrors=document.getElementById("pas-reg-error")
let otperror=document.getElementById("otp-reg-error")
let cotperror=document.getElementById("otp-reg-error")
let passotp=document.getElementById("otp-pass2")
let conotp=document.getElementById("otp-con")
console.log(passotp)
console.log(conotp)
console.log(conup)
console.log(popup)
function pop(){
    setTimeout(()=>
    popup.classList.add("visi"),200)
}
function clean(){
    setTimeout(()=>
        popup.classList.remove("visi"),200)
}
function push(){
    setTimeout(()=>
    conup.classList.add("visi"),200)
}
function clean1(){
    setTimeout(()=>
        conup.classList.remove("visi"),200)
}
function spush(){
    setTimeout(()=>
    psign.classList.add("visi"),200)
}
function clean2(){
    setTimeout(()=>
        psign.classList.remove("visi"),200)
}
function scrollToTarget() {
    const target = document.getElementById("p-start");
    target.scrollIntoView({ behavior: "smooth" });

  
    target.style.bottom = "30vh";
    
}


function spop(){
    setTimeout(()=>
    pcon.classList.add("visi"),200)
}
function clean3(){
    setTimeout(()=>
        pcon.classList.remove("visi"),200)
}
function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}
function passreg(display,content,image){
    setTimeout(()=>
    statuses.classList.add(display),200);
    status_h2.textContent=content;
    status_img.src = image;

}
function failreg(display,content,image){
    setTimeout(()=>
    statuses.classList.add(display),200);
    status_h2.textContent=content;
    status_img.src = image;

}


document.getElementById('send-otp-con').addEventListener('click', function () {
    const mobileNumber = document.getElementById('mobile_con').value;

    if (!mobileNumber || mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const baseUrl = window.location.origin;
    const otpUrl = `${baseUrl}/send-otp/${mobileNumber}/`;

    window.history.pushState({}, '', `/send-otp/${mobileNumber}/`);

    fetch(otpUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                conotp.textContent=`OTP is ${data.otp}`
                enableOTPInput();
                
            } else {
                alert('Failed to send OTP. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            alert('An error occurred while sending OTP.');
        });
});

// OTP verification and form submission after OTP check
document.getElementById('bus-register-form').addEventListener('submit', function (event) {
   
    event.preventDefault()
    const mobileNumber = document.getElementById('mobile_con').value;
    const otp=document.getElementById('con-otp').value
    window.history.pushState({}, '', `/verify-otp/${mobileNumber}/`);
    console.log(otp)
    fetch(`/verify-otp/${mobileNumber}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ otp }),
        
    })
    
       
        .then(response => response.json())
        .then(data => {
            if (data.otp_match) {
               window.history.pushState({}, '', `/register-bus/`);
                
               const busId = document.getElementById('bus_id').value;
               const chassisNumber = document.getElementById('chassis_number').value;
               const regCertificate = document.getElementById('registration_certificate').value;
               const password = document.getElementById('password-con').value;
               const confirmPassword = document.getElementById('confirm_password').value;
               if (password != confirmPassword) {
                errors.textContent="password does not match"
                return;
                }
              
        
               console.log("Sending form data...");
               console.log(busId)

            // Create payload with the form data
               const formData = {
                bus_id: busId,
                chassis_number: chassisNumber,
                registration_certificate: regCertificate,
                mobile_number: mobileNumber,
                password: password,
                confirm_password: confirmPassword,
               }; 
               console.log(formData.bus_id)
             
               fetch('/register-bus/', {  // Adjust URL to match your Django endpoint for bus registration
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),  // CSRF protection
                },
                body: JSON.stringify(formData),  // Send form data as JSON
                })
               .then(response => response.json())
               .then(data => {
                if (data.success) {
                    clean3();
                    passreg("visi","Conductor registration successful!", "/static/img/check.png")
                } else {
                    clean3();
                    
                   
                    failreg("visi",data.message, "/static/img/fail.png")
                }
             })
                
            } else {
                errors.textContent= 'Incorrect OTP. Please try again.';
            }
        });
});


// Enable OTP input after sending OTP
function enableOTPInput() {
    document.querySelector('input[name="otp"]').disabled = false;
}

document.getElementById('send-otp-pass').addEventListener('click', function () {
    const mobileNumber = document.getElementById('mobile_number_pass').value;

    if (!mobileNumber || mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const baseUrl = window.location.origin;
    const otpUrl = `${baseUrl}/send-otp/${mobileNumber}/`;

    window.history.pushState({}, '', `/send-otp/${mobileNumber}/`);

    fetch(otpUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
         
             passotp.textContent=`OTP is ${data.otp}`
            enableOTPInput();
              
        } else {
            alert('Failed to send OTP. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error sending OTP:', error);
        alert('An error occurred while sending OTP.');
    });
});


document.getElementById('passenger-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const mobileNumber = document.getElementById('mobile_number_pass').value;
    const otp = document.getElementById('otp-pass').value;
    const username = document.getElementById('username-pass').value;
    const password = document.getElementById('password-pass').value;
    const confirmPassword = document.getElementById('confirm_password-pass').value;

    if (password != confirmPassword) {
        paserrors.textContent="password does not match"
        return;
    }
   

    try {
        // 1. Verify OTP
        const otpResponse = await fetch(`/verify-otp/${mobileNumber}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ otp })
        });

        const otpData = await otpResponse.json();

        if (!otpData.otp_match) {
            otperror.textContent="Incorrect otp try again"
            return;
        }

        // 2. Register Passenger
        const registrationData = {
            username,
            mobile_number: mobileNumber,
            password,
            confirm_password: confirmPassword
        };

        const registerResponse = await fetch('/register-passenger/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify(registrationData)
        });

        const result = await registerResponse.json();

        if (result.success) {
            clean2();
            passreg("visi", "Passenger registration successful!", "/static/img/check.png");
        } else {
            clean2();
            failreg("visi",result.message, "/static/img/fail.png");
        }

    } catch (error) {
        console.error("An error occurred:", error);
        alert("Something went wrong. Please try again.");
    }
});

function statusclean(){
    statuses.classList.remove("visi")
}
let problem= document.getElementById('conductor-login-form')
console.log(problem)
//this is conductor login
document.getElementById('conductor-login-form').addEventListener('click', function (event) {
  
    event.preventDefault();  
   
    const bus_id = document.getElementById('con-log').value;
    let password = document.getElementById('con-log-pass').value;
    console.log(bus_id,password)
   
    fetch('/conductor-login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()  // Function to get CSRF token
        },
        body: JSON.stringify({ bus_id: bus_id, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login-message').innerText = "";
            window.location.href = '/conductor_dashboard/';
        } else {
         
            document.getElementById('login-message').innerText = data.message;
        }
    })
    .catch(error => {
        
        window.location.href = "http://127.0.0.1:8000/";
        console.error('Error:', error);
        document.getElementById('login-message').innerText = 'An error occurred while logging in.';
    });
});


// this is passenger login

document.getElementById('passenger-login-form').addEventListener('click', function (event) {
   
    event.preventDefault();  
   
    const mobile = document.getElementById('pass-log').value;
    let password = document.getElementById('pass-log-pass').value;
    console.log(mobile,password)
    // Sending the login data to the backend using fetch API
    fetch('/passenger-login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()  // Function to get CSRF token
        },
        body: JSON.stringify({ mobile: mobile, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           
            window.location.href = '/passenger_dashboard/';
            document.getElementById('c-login-message').innerText ="";
        }
        else if(!data.success){
            console.log(data.message)
            document.getElementById('c-login-message').innerText = data.message;
        }
        else{
            document.getElementById('c-login-message').innerText = data.message;
        }
       
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('login-message').innerText = 'An error occurred while logging in.';
    });
});



function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        if (cookie.trim().startsWith('csrftoken=')) {
            return cookie.split('=')[1];
        }
    }
    return '';
}
