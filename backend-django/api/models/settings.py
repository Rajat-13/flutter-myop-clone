"""
Settings Model
"""
from django.db import models


class BrandSettings(models.Model):
    brand_name = models.CharField(max_length=100, default='RIMAE')
    tagline = models.CharField(max_length=200, default='A SCENT THAT REFLECTS YOU')
    currency = models.CharField(max_length=10, default='INR')
    currency_symbol = models.CharField(max_length=5, default='₹')
    
    support_email = models.EmailField(default='support@rimae.com')
    support_phone = models.CharField(max_length=15, blank=True)
    
    # Social links
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # Shipping settings
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=999)
    default_shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=49)
    
    # Tax settings
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'brand_settings'
        verbose_name = 'Brand Settings'
        verbose_name_plural = 'Brand Settings'

    def __str__(self):
        return self.brand_name

    def save(self, *args, **kwargs):
        # Ensure only one settings record exists
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
