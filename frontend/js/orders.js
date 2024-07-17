document.addEventListener('DOMContentLoaded', () => {
    const orderContainer = document.getElementById('orders');

    function fetchOrders() {
        fetch('http://127.0.0.1:8000/api/orders/')
            .then(response => response.json())
            .then(data => {
                data.forEach(order => {
                    const orderCard = document.createElement('div');
                    orderCard.className = 'order-card';
                    orderCard.innerHTML = `
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Customer Name:</strong> ${order.customer_name}</p>
                        <p><strong>Customer Email:</strong> ${order.customer_email}</p>
                        <p><strong>Location:</strong> ${order.location}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Created At:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                        <p><strong>Order Items:</strong></p>
                        <div id="order-items-${order.id}"></div>
                    `;
                    orderContainer.appendChild(orderCard);
                    
                    const orderItemsContainer = document.getElementById(`order-items-${order.id}`);
                    order.order_items.forEach(item => {
                        const orderItem = document.createElement('div');
                        orderItem.className = 'order-item';
                        orderItem.innerHTML = `
                            <p>Item ID: ${item.id}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ${item.price}</p>
                        `;
                        orderItemsContainer.appendChild(orderItem);
                    });
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    fetchOrders(); // Call the function to fetch orders when the DOM is loaded
});