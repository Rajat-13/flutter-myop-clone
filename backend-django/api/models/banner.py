"""
Banner Model - For Landing Page Hero Banners
"""
from django.db import models


class Banner(models.Model):
    """Hero slider banners for landing page"""
    image = models.ImageField(upload_to='banners/')
    link = models.CharField(max_length=500, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'banners'
        ordering = ['order']

    def __str__(self):
        return f"Banner {self.id} - {self.alt_text or 'No alt text'}"


class MarqueeSetting(models.Model):
    """Marquee announcement banner settings"""
    text = models.TextField()
    link = models.CharField(max_length=500, blank=True)
    speed = models.IntegerField(default=30)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'marquee_settings'

    def __str__(self):
        return f"Marquee: {self.text[:50]}..."
