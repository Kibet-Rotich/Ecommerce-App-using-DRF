function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    checkoutItemsContainer.innerHTML = '';
    let totalAmount = 0;

    cart.forEach(item => {
        const totalItemPrice = item.price * item.quantity;
        totalAmount += totalItemPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)"></td>
            <td>${totalItemPrice.toFixed(2)}</td>
            <td><button onclick="deleteItem(${item.id})">Delete</button></td>
        `;
        checkoutItemsContainer.appendChild(row);
    });

    document.getElementById('checkout-total-amount').textContent = totalAmount.toFixed(2);
    return totalAmount;
}

function updateQuantity(itemId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.map(item => {
        if (item.id === itemId) {
            item.quantity = parseInt(newQuantity, 10);
        }
        return item;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCheckoutItems(); // Refresh the checkout items list
}

function deleteItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCheckoutItems(); // Refresh the checkout items list
}



function fetchLocations() {
    fetch('http://127.0.0.1:8000/api/locations/')
        .then(response => response.json())
        .then(data => {
            const locationSelect = document.getElementById('location-select');
            data.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = `${location.location} (Shop: ${location.shop.name}, Cost: $${parseFloat(location.cost_of_shipment).toFixed(2)})`;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching locations:', error));
}
function finalizeCheckout() {
    const totalAmount = loadCheckoutItems(); // Ensure totalAmount is calculated
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const selectedLocationId = document.getElementById('location-select').value;
    const phoneNumber = document.getElementById('customer-phone').value; // Assuming there's an input for the phone number

    if (!customerName || !customerEmail || !selectedLocationId || !phoneNumber) {
        alert('Please fill in all required fields.');
        return;
    }

    // Fetch selected location details
    fetch(`http://127.0.0.1:8000/api/locations/${selectedLocationId}/`)
        .then(response => response.json())
        .then(location => {
            const totalCost = totalAmount + parseFloat(location.cost_of_shipment);

            // Prepare order data
            const orderData = {
                customer_name: customerName,
                customer_email: customerEmail,
                location_id: selectedLocationId,
                total_amount: totalCost,
                order_items: JSON.parse(localStorage.getItem('cart')) || [],
                phone_number: phoneNumber,
                amount: totalCost
            };

            // Make payment request to Daraja API (simulated here)
            fetch('http://127.0.0.1:8000/api/initiate-payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.ResponseCode === '0') {
                    alert('Payment initiated successfully. Please complete the payment on your phone.');
                } else {
                    alert('Payment initiation failed, please try again.');
                }
            })
            .catch(error => {
                console.error('Error initiating payment:', error);
                alert('An error occurred, please try again.');
            });
        })
        .catch(error => console.error('Error fetching location:', error));
}




document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutItems();
    fetchLocations();
});
