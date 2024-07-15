// Assuming cart is an array of items stored in localStorage
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
            <td>${item.quantity}</td>
            <td>${totalItemPrice.toFixed(2)}</td>
        `;
        checkoutItemsContainer.appendChild(row);
    });

    document.getElementById('checkout-total-amount').textContent = totalAmount.toFixed(2);
    return totalAmount;
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

    if (!customerName || !customerEmail || !selectedLocationId) {
        alert('Please fill in all required fields.');
        return;
    }

    // Fetch selected location details
    fetch(`http://127.0.0.1:8000/api/locations/${selectedLocationId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Get response as text for debugging
        })
        .then(text => {
            try {
                const location = JSON.parse(text);  // Try parsing the text to JSON
                const totalCost = totalAmount + parseFloat(location.cost_of_shipment);

                // Prepare order data
                const orderData = {
                    customer_name: customerName,
                    customer_email: customerEmail,
                    location_id: selectedLocationId,
                    total_amount: totalCost,
                    order_items: JSON.parse(localStorage.getItem('cart')) || []
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
                    if (data.success) {
                        alert('Payment successful and order placed!');
                        localStorage.removeItem('cart'); // Clear cart after successful order
                    } else {
                        alert('Payment failed, please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error placing order:', error);
                    alert('An error occurred, please try again.');
                });
            } catch (error) {
                console.error('Error parsing location JSON:', error);
                console.log('Response text was:', text);  // Log the text response for debugging
            }
        })
        .catch(error => console.error('Error fetching location:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutItems();
    fetchLocations();
});
