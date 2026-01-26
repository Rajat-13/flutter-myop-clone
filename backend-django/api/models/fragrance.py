"""
Fragrance Model - For Admin Management
"""
from django.db import models


class Ingredient(models.Model):
    CATEGORY_CHOICES = [
        ('top', 'Top Note'),
        ('middle', 'Middle Note'),
        ('base', 'Base Note'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    origin = models.CharField(max_length=100, blank=True)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, default='ml')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ingredients'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class Fragrance(models.Model):
    TYPE_CHOICES = [
        ('perfume', 'Perfume'),
        ('attar', 'Attar'),
    ]

    CONCENTRATION_CHOICES = [
        ('parfum', 'Parfum'),
        ('edp', 'Eau de Parfum'),
        ('edt', 'Eau de Toilette'),
        ('edc', 'Eau de Cologne'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('discontinued', 'Discontinued'),
    ]

    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
    ]

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='perfume')
    concentration = models.CharField(max_length=20, choices=CONCENTRATION_CHOICES, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='unisex')
    category = models.CharField(max_length=50, blank=True)
    
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    stock_quantity = models.IntegerField(default=0)
    min_order_threshold = models.IntegerField(default=10)
    watching_count = models.IntegerField(default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_active = models.BooleanField(default=True)
    is_bestseller = models.BooleanField(default=False)
    
    # Fragrance notes stored as JSON arrays
    top_notes = models.JSONField(default=list, blank=True)
    middle_notes = models.JSONField(default=list, blank=True)
    base_notes = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fragrances'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def final_price(self):
        if self.discount > 0:
            return self.price - (self.price * self.discount / 100)
        return self.price


class FragranceImage(models.Model):
    fragrance = models.ForeignKey(Fragrance, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='fragrances/')
    is_cover = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'fragrance_images'
        ordering = ['order']


class FragranceNote(models.Model):
    NOTE_TYPE_CHOICES = [
        ('top', 'Top Note'),
        ('middle', 'Middle Note'),
        ('base', 'Base Note'),
    ]

    fragrance = models.ForeignKey(Fragrance, on_delete=models.CASCADE, related_name='notes')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    note_type = models.CharField(max_length=20, choices=NOTE_TYPE_CHOICES)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        db_table = 'fragrance_notes'
        unique_together = ['fragrance', 'ingredient', 'note_type']
