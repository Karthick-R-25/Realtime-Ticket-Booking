function fetchStops() {
    const busId = document.getElementById('bus_id').value;
    if (!busId) {
        alert("Please enter a Bus ID!");
        return;
    }

    fetch(`/get_routes/${busId}/`)
        .then(response => response.json())
        .then(data => {
            const selectMenu = document.getElementById('route-select');
            
           

            selectMenu.innerHTML = '<option value="">Select a route</option>'; // Reset dropdown

            data.forEach(route => {
                const option = document.createElement('option');
                option.value = route.price;
                option.textContent = `${route.from_stop} to ${route.to_stop}`;
                selectMenu.appendChild(option);
            });

            selectMenu.addEventListener('change', function () {
                const priceDisplay = document.getElementById('price-display');
                const routeDirection = document.getElementById('route-direction');
                const counts=document.getElementById('p-count').value
                const selectedOption = this.options[this.selectedIndex];
                priceDisplay.classList.add("router-button")
                
                if (this.value) {
                    const [fromStop, rest] = selectedOption.textContent.split(" to ");
                    const [toStop] = rest.split(" - ₹");
        
                   priceDisplay.value=this.value*counts
                    priceDisplay.textContent = `Pay: ₹${this.value*counts}`;
        
                    // Set route direction with arrow
                    routeDirection.innerHTML = `${fromStop.trim()} <img src="/static/img/green-arrow.jpg" style="height:20px; vertical-align:middle;"> ${toStop.trim()}`;
                } else {
                    priceDisplay.textContent = "";
                    routeDirection.innerHTML = "";
                }
            });
        })
        .catch(error => console.error('Error fetching stops:', error));
}   
document.getElementById('price-display').addEventListener('click', function () {
    const directionText = document.getElementById('route-direction').textContent.trim();
    const [from, to] = directionText.split(/\s+/);
    const routeFormatted = `${from} to ${to}`;
    const busId = document.getElementById('bus_id').value;
    const counts = document.getElementById('p-count').value;
    const username = document.getElementById('username').textContent;
    const rawPrice = document.getElementById('price-display').textContent;
    const price = parseInt(rawPrice.replace(/\D/g, ''), 10); // Extracts digits only
     const mobile=document.getElementById("usermobile").textContent


    function generateUniqueCode() {
        const code = Math.floor(100 + Math.random() * 900);
        const codeDisplay = document.getElementById('ticket-code');

        fetch('pass_code', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify({ code: code, busid: busId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.available) {
                codeDisplay.classList.add("main-code");
                codeDisplay.textContent = `Ticket Code: ${code}`;
                document.getElementById('price-display').textContent = "Paid";

                // ✅ Now save the ticket code AFTER successful validation
                fetch('/save_ticket_code/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        route: routeFormatted,
                        price: price,
                        Travel: counts,
                        passenger: counts,
                        username: username,
                        ticket_code: code,
                        busId: busId,
                        mobile:mobile
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Ticket saved:", data);
                });
            } else {
                generateUniqueCode(); // Try again
            }
        });
    }

    generateUniqueCode();
});

    
    
   
   
document.getElementById("pass-logout").addEventListener("click", function () {

    fetch("/logout/", {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
        },
    }).then(() => {
        window.location.href = "http://127.0.0.1:8000/";
    });
});
document.getElementById("code-history").addEventListener('click',async function(){
            const basecontain=document.getElementById("book-form")
            const subcontain=document.getElementById("booking-form")
            basecontain.innerHTML=""
            const mobile=document.getElementById("usermobile").textContent
            let response=await fetch(`bus_history/${mobile}`)
            let data=await response.json()
            const historyList = document.getElementById('lister');
            let backbut=document.getElementById("back-main")
            backbut.classList.remove("his-hide")
            backbut.classList.add("visi")
           
            data.data.map(item=>{
                
                const row = document.createElement("li");
                row.className = "list-row";
          
                const route = document.createElement("li");
                route.textContent = item.route;
               

                const price = document.createElement("li");
                price.textContent = item.price;
          
                const travel = document.createElement("li");
                travel.textContent = item.travel;
          
                const user = document.createElement("li");
                user.textContent = item.user;
                row.appendChild(route);
                row.appendChild(price);
                row.appendChild(travel);
                row.appendChild(user); // If this is a foreign key, make sure it returns a name
                historyList.appendChild(row);
                basecontain.appendChild(historyList)
            })
            document.getElementById("back-main").addEventListener('click',function(){
              
                basecontain.removeChild(historyList)
                basecontain.appendChild(subcontain)
                backbut.classList.add("his-hide")
                backbut.classList.remove("visi")
            })
            
})

   

   

// Function to get CSRF token from cookies (for Django's CSRF protection)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

