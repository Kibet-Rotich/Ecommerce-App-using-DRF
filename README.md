
# Ecommerce App using Django REST Framework

This is a simple web application built using Django REST Framework (DRF) for the backend and vanilla JavaScript (JS), HTML, and CSS for the frontend. The backend and frontend communicate solely through APIs.

## Features

- Fetches data from the backend using APIs provided by Django REST Framework.
- Allows users to view items, add items to a cart, update cart contents, and place orders.
- Utilizes local storage to maintain cart state across sessions.
- Includes functionality for administrators to view orders placed.

## Project Structure

The project is organized into two main directories:

1. **Backend**: Contains all server-side logic implemented with Django REST Framework.
   - `manage.py`: Django's command-line utility for administrative tasks.
   - `store/`: Django application directory where models, views, and serializers are defined.
   - Virtual environment (`env/`): Contains Python dependencies isolated from the system environment.

2. **Frontend**: Contains the user interface components.
   - Three HTML files: `index.html`, `checkout.html`, and `orders.html`.
   - `js/`: Directory for JavaScript files containing frontend logic.
   - `css/`: Directory for CSS stylesheets.

## Setup Instructions

To run the application locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Set Up Virtual Environment**:
   ```bash
   cd backend
   cd env\Scripts
   activate
   cd ..\..\  # Navigate back to the 'backend' directory
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server**:
   ```bash
   python manage.py runserver
   ```

5. **Access the Application**:
   Open a web browser and go to `http://127.0.0.1:8000/` to view the application.

## Usage

- **View Items**: Navigate through the items displayed on the homepage.
- **Add to Cart**: Click on "Add to Cart" buttons to add items to your shopping cart.
- **Update Cart**: Modify item quantities or remove items from the cart.
- **Checkout**: Proceed to checkout, enter required details, and place an order.
- **Admin Dashboard**: Access `http://127.0.0.1:8000/admin/` to view orders placed.

## Technologies Used

- **Backend**: Django, Django REST Framework
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (default configuration)

## Notes

This project demonstrates how to build a simple ecommerce application using Django REST Framework for the backend API and JavaScript for frontend interactions. Feel free to explore and modify the codebase as needed.
