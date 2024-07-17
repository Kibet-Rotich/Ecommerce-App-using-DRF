
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
                        <p>Order ID: ${order.id}</p>
                        <p>Customer Name: ${order.customer_name}</p>
                        <p>Customer Email: ${order.customer_email}</p>
                        <p>Location: ${order.location}</p>
                        <p>Status: ${order.status}</p>
                        <p>Created At: ${order.created_at}</p>
                        <p>Order Items: ${order.order_items.id}</p>
                        <p>Order Items: ${order.order_items.quantity}</p>
                        <p>Order Items: ${order.order_items.price}</p>
                        <p>Order Items: ${order.order_items.item}</p>
                    `;
                    orderContainer.appendChild(orderCard);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    fetchOrders(); // Call the function to fetch orders when the DOM is loaded
});