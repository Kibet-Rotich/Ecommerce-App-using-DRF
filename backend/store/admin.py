from django.contrib import admin
from .models import Item, Order, OrderItem,Location,Shop

admin.site.register(Item)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Location)
admin.site.register(Shop)


