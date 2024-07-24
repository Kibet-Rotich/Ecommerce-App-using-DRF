from django.urls import path
from .views import initiate_payment, LocationListCreateView, ShopListCreateView,orders,payment_confirmation

urlpatterns = [
    path('initiate-payment/', initiate_payment, name='initiate-payment'),
    path('payment-confirmation/', payment_confirmation, name='payment-confirmation'),
    path('htm/orders/',orders,name='orders')
]


