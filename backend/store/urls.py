from django.urls import path
from .views import initiate_payment, LocationListCreateView, ShopListCreateView,orders

urlpatterns = [
    path('initiate-payment/', initiate_payment, name='initiate-payment'),
    path('htm/orders/',orders,name='orders')
]