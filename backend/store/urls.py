from django.urls import path
from .views import initiate_payment, LocationListCreateView, ShopListCreateView

urlpatterns = [
    path('initiate-payment/', initiate_payment, name='initiate-payment'),
    path('locations/', LocationListCreateView.as_view(), name='location-list-create'),
    path('shops/', ShopListCreateView.as_view(), name='shop-list-create'),
]
