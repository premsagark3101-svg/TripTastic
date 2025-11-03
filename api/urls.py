from django.urls import path
from . import views


urlpatterns = [
    path('signup/', views.signup_view, name='api-signup'),
    path('login/', views.login_view, name='api-login'),
    path('itineraries/', views.itineraries_view, name='api-itineraries'),
    path('generate-itinerary/', views.generate_itinerary_view, name='api-generate-itinerary'),
    path('save-itinerary/', views.save_itinerary_view, name='api-save-itinerary'),
]


