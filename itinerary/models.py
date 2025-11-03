from django.db import models


class Itinerary(models.Model):
    username = models.CharField(max_length=150)
    destination = models.CharField(max_length=200)
    duration = models.PositiveIntegerField(default=1)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.destination} ({self.duration} days)"


