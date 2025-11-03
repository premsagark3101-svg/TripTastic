from rest_framework import serializers
from .models import Itinerary


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['id', 'username', 'destination', 'duration', 'details', 'created_at']
        read_only_fields = ['id', 'created_at']


