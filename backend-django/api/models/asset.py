"""
Asset Model - For Asset Management
Stores metadata for files uploaded to Supabase storage
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Asset(models.Model):
    """Asset metadata storage (files stored in Supabase storage)"""
    TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    storage_path = models.TextField()  # Path in Supabase storage
    url = models.TextField()  # Public URL
    size_bytes = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    used_in = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    uploaded_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assets'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assets'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.type})"

    @property
    def size_formatted(self):
        """Return human-readable file size"""
        size = self.size_bytes
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
