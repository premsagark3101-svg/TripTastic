from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('guides/', TemplateView.as_view(template_name='guides.html'), name='guides'),
    path('hotels/', TemplateView.as_view(template_name='hotels.html'), name='hotels'),
    path('itinerary/', include('itinerary.urls')),
    path('api/', include('api.urls')),
]


