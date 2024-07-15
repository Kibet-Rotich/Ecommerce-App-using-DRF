document.addEventListener('DOMContentLoaded', () => {
    updateCheckoutCart();
    fetchLocations();
});

function updateCheckoutCart() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalAmountElement = document.getElementById('checkout-total-amount');
    checkoutItemsContainer.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0;

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<tr><td colspan="4">Your cart is empty</td></tr>';
    } else {
        cart.forEach(item => {
            const checkoutItem = document.createElement('tr');
            const itemTotal = item.price * item.quantity;

            checkoutItem.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;

            checkoutItemsContainer.appendChild(checkoutItem);
            totalAmount += itemTotal;
        });
    }

    checkoutTotalAmountElement.textContent = totalAmount.toFixed(2);
}

function fetchLocations() {
    fetch('http://127.0.0.1:8000/api/locations/')
        .then(response => response.json())
        .then(data => {
            const locationSelect = document.getElementById('location-select');
            data.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = `${location.location} (Shop: ${location.shop.name}, Cost: $${location.cost_of_shipment.toFixed(2)})`;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching locations:', error));
}

function finalizeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedLocationId = document.getElementById('location-select').value;
    const selectedLocationText = document.getElementById('location-select').selectedOptions[0].textContent;

    // Get customer information from the form
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const order = {
        customer_name: customerName,
        customer_email: customerEmail,
        location_id: selectedLocationId,
        location_details: selectedLocationText,
        status: 'pending',
        order_items: cart.map(item => ({
            item: item.id,
            quantity: item.quantity,
            price: item.price,
        }))
    };

    fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
    .then(response => response.json())
    .then(data => {
        alert('Order placed successfully');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';  // Redirect to the landing page after successful checkout
    })
    .catch(error => console.error('Error placing order:', error));
}

