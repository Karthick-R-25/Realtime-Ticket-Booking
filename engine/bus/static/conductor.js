let routeadder=document.getElementById("add-stops")
let ticetprint=document.getElementById("ticketer")
let history=document.getElementById("pass-history")
let routesec=document.getElementById("route-con")
let v_code=document.getElementById("coder")
let historys=document.getElementById("history")
let table = document.getElementById("center-table");
ticetprint.addEventListener("click",function(){
    v_code.classList.remove("con-tabs")
    routesec.classList.add("con-tabs")
    historys.classList.add("con-tabs")
    
})
routeadder.addEventListener("click",function(){
    routesec.classList.remove("con-tabs")
    v_code.classList.add("con-tabs")
    historys.classList.add("con-tabs")
    table.classList.remove("center-table")
    table.innerHTML=""
})
history.addEventListener("click",function(){
    v_code.classList.add("con-tabs")
    routesec.classList.add("con-tabs")
    historys.classList.remove("con-tabs")
    table.classList.remove("center-table")
    table.innerHTML=""
})

let stopCount = 1;
          document.getElementById('add-stop').addEventListener('click', function () {
            stopCount++;
            const stopsContainer = document.getElementById('stops-container');
            const stopSection = document.createElement('div');
            stopSection.classList.add('stop-section');
            stopSection.innerHTML = `
                <label for="stop_${stopCount}">Stop Name:</label>
                <input type="text" id="stop_${stopCount}" name="stop[]" required placeholder="Enter stop name">
            `;
            stopsContainer.appendChild(stopSection);
        });

        // Generate pricing fields dynamically for each stop-to-stop combination
        document.getElementById('generate-pricing').addEventListener('click', function () {
            const stops = document.querySelectorAll('input[name="stop[]"]');
            const pricingContainer = document.getElementById('pricing-container');
            pricingContainer.innerHTML = '';

            // Create a pricing field for each pair of stops
            for (let i = 0; i < stops.length; i++) {
                for (let j = i + 1; j < stops.length; j++) {
                    const fromStop = stops[i].value || `Stop ${i + 1}`;
                    const toStop = stops[j].value || `Stop ${j + 1}`;

                    const priceField = document.createElement('div');
                    priceField.innerHTML = `
                        <label>Price from ${fromStop} to ${toStop}:</label>
                        <input type="number" name="price_${i}_${j}" required placeholder="Enter price">
                    `;
                    pricingContainer.appendChild(priceField);
                }
            }
        });

        // Handle form submission
        document.getElementById('route-form').addEventListener('submit', function (event) {
            event.preventDefault();
        
            const formData = new FormData(this);
            const stopNames = formData.getAll('stop[]');
            const pricingData = {};
            const startStop = stopNames[0];  // First stop (e.g., Bangalore)
            const endStop = stopNames[stopNames.length - 1];  // Last stop (e.g., Chennai)
            let mainRoutePrice = 0;  // Store the price of the direct route from first to last stop
           
            // Collect pricing for all stop pairs
            stopNames.forEach((fromStop, i) => {
                stopNames.forEach((toStop, j) => {
                    if (i < j) {
                        const priceKey = `price_${i}_${j}`;
                        pricingData[`${fromStop} to ${toStop}`] = formData.get(priceKey);
        
                        // If it's the main route from start to end, store its price separately
                        if (fromStop === startStop && toStop === endStop) {
                            mainRoutePrice = formData.get(priceKey);
                        }
                    }
                });
            });
            let bus_id=document.getElementById("busid").textContent
           
            // Prepare request data with the direct route and stop pairs
            const requestData = {
                bus_id:bus_id,
                prices: pricingData     
            };
           
            // Send POST request to Django with CSRF token
            fetch('conductor_dashboard/add_route/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(requestData),
            })
            .then(response => response.json())
            .then(data => {
                console.log(requestData)
                alert(data.message || 'Route and pricing submitted successfully!');
                
                
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the route.');
            });
        });

        document.getElementById("verify-but").addEventListener("click", function () {
            const code = document.getElementById("v-code").value;
            const busno = document.getElementById("busid").textContent;
            const table = document.getElementById("center-table");
            table.classList.remove("center-table")
            table.classList.add("visi")
        
            fetch(`/verify_code/${code}/${busno}/`)
                .then(response => {
                   
                    return response.json();
                })
                .then(data => {
                  
                    const tbody = table.querySelector("tbody");
                    tbody.innerHTML = "";
        
                    const row = document.createElement("tr");
                    console.log(data)
                    data.forEach(text => {
                        const cell = document.createElement("td");
                        cell.textContent = text;
                        row.appendChild(cell);
                    });
                    tbody.appendChild(row);
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("verifycode not found");
                });
        });
        document.getElementById("code-but").addEventListener("click",function(){
            alert("Ticket printed Successfully")
            const code = document.getElementById("v-code").value;
            fetch(`/history_code/${code}/`)
            .then(response=>response.json())
            .then(data=>console.log(data))
           
        })

        history.addEventListener("click",function(){
            let busid=document.getElementById("busid").textContent
            console.log(busid)
            fetch("pass_history")
            .then(response=>response.json())
            .then(data => {
                const historyList = document.querySelector(".list-table"); // Ensure <ul class="list-table"> exists
                historyList.innerHTML = "";
               let wanted2 = data
               .filter(val => val.bus_id === busid)
               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                wanted2.forEach(item => {
                  const row = document.createElement("li");
                  row.className = "list-row";
            
                  const route = document.createElement("li");
                  route.textContent = item.route;
                 

                  const price = document.createElement("li");
                  price.textContent = item.price;
            
                  const travel = document.createElement("li");
                  travel.textContent = item.travel;
            
                  const user = document.createElement("li");
                  user.textContent = item.user; // If this is a foreign key, make sure it returns a name
            
                  row.appendChild(route);
                  row.appendChild(price);
                  row.appendChild(travel);
                  row.appendChild(user);
                  historyList.appendChild(row);
                });
              });
        })
        
        document.getElementById("con-logout").addEventListener("click", function () {

            fetch("/logout/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }).then(() => {
                window.location.href = "http://127.0.0.1:8000/";
            });
        });
        document.getElementById("Reset-stops").addEventListener("click",function reset(){
            let delbus=document.getElementById("busid").textContent
            console.log(delbus)
            fetch('delete',{
                method:"POST",
                headers:{
                    "content-type":"application/json",
                    "X-CSRFToken":getCookie("csrftoken")
                },
                body:JSON.stringify({"delbus":delbus})

            })
            .then((response)=>response.json())
            .then((data)=>{
                alert(data.message)
            })
        })

      

            
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            } 
