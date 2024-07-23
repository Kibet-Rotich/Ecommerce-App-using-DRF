from rest_framework import viewsets, generics
from .models import Item, Order, OrderItem, Location, Shop
from .serializers import ItemSerializer, OrderSerializer, OrderItemSerializer, LocationSerializer, ShopSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class LocationListCreateView(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ShopListCreateView(generics.ListCreateAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


import base64
import requests
from datetime import datetime
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view

def get_access_token():
    consumer_key = settings.DARAJA_CONSUMER_KEY
    consumer_secret = settings.DARAJA_CONSUMER_SECRET
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    r = requests.get(api_url, auth=(consumer_key, consumer_secret))
    json_response = r.json()
    return json_response['access_token']

import base64
import requests
from datetime import datetime
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view

def get_access_token():
    consumer_key = settings.DARAJA_CONSUMER_KEY
    consumer_secret = settings.DARAJA_CONSUMER_SECRET
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    r = requests.get(api_url, auth=(consumer_key, consumer_secret))
    json_response = r.json()
    return json_response['access_token']

@api_view(['POST'])
def initiate_payment(request):
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')
    
    if not phone_number or not amount:
        return JsonResponse({'error': 'Phone number and amount are required'}, status=400)

    access_token = get_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    business_short_code = settings.DARAJA_BUSINESS_SHORTCODE
    lipa_na_mpesa_online_passkey = settings.DARAJA_PASSKEY
    data_to_encode = business_short_code + lipa_na_mpesa_online_passkey + timestamp
    encoded_string = base64.b64encode(data_to_encode.encode())
    password = encoded_string.decode('utf-8')
    
    payload = {
        "BusinessShortCode": business_short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": business_short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.DARAJA_CALLBACK_URL,
        "AccountReference": "CompanyXLTD",
        "TransactionDesc": "Payment for order"
    }
    
    response = requests.post(api_url, json=payload, headers=headers)
    return JsonResponse(response.json())

@api_view(['POST'])
def payment_confirmation(request):
    # Extract payment confirmation data
    payment_data = request.data

    # Assuming you receive these fields from the Daraja API confirmation
    order_id = payment_data.get('order_id')
    transaction_id = payment_data.get('transaction_id')
    status = payment_data.get('status')  # e.g., 'completed', 'failed'
    amount = payment_data.get('amount')
    phone_number = payment_data.get('phone_number')
    payment_time = payment_data.get('payment_time')

    # Validate the received data
    if not order_id or not transaction_id or not status or not amount or not phone_number or not payment_time:
        return JsonResponse({'error': 'Invalid payment confirmation data'}, status=400)

    try:
        # Find the corresponding order
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)

    # Update the order status and save payment details
    if status == 'completed':
        order.status = 'completed'
    else:
        order.status = 'failed'

    order.save()

    # Save additional payment details if needed
    # For example, create a Payment model to store transaction details

    return JsonResponse({'result': 'Payment confirmation received and order updated'})




from django.shortcuts import render

def orders(request):
    orders = Order.objects.all()
    return render(request, 'orders.html', {"orders": orders})