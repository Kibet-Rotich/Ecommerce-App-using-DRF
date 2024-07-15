document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');

    fetch('http://127.0.0.1:8000/api/items/')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';

                itemCard.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p class="price">$${item.price}</p>
                    <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
                `;

                itemsContainer.appendChild(itemCard);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
});

function addToCart(id, name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
}

function viewCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
            `;

            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartContainer.style.display = 'block';
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const order = {
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        location: '123 Main St',
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
        document.getElementById('cart-container').style.display = 'none';
    })
    .catch(error => console.error('Error placing order:', error));
}
