"""
Inventory Model - For Stock Management
"""
from django.db import models


class Inventory(models.Model):
    """Inventory tracking for products/fragrances"""
    fragrance = models.ForeignKey(
        'Fragrance', 
        on_delete=models.CASCADE, 
        related_name='inventory_items',
        null=True, 
        blank=True
    )
    product = models.ForeignKey(
        'Product', 
        on_delete=models.CASCADE, 
        related_name='inventory_items',
        null=True, 
        blank=True
    )
    sku = models.CharField(max_length=50, unique=True)
    size = models.CharField(max_length=20, default='8ml')
    current_stock = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=20)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    supplier_name = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=100, blank=True)
    last_restocked = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory'
        verbose_name_plural = 'Inventory'
        ordering = ['-updated_at']

    def __str__(self):
        name = self.fragrance.name if self.fragrance else (self.product.name if self.product else 'Unknown')
        return f"{name} - {self.sku} ({self.current_stock} units)"

    @property
    def stock_status(self):
        if self.current_stock == 0:
            return 'out_of_stock'
        elif self.current_stock <= self.reorder_level:
            return 'low_stock'
        return 'healthy'


class StockMovement(models.Model):
    """Track stock movements (in/out/adjustments)"""
    MOVEMENT_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Adjustment'),
    ]

    inventory = models.ForeignKey(
        Inventory, 
        on_delete=models.CASCADE, 
        related_name='movements'
    )
    type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    reason = models.TextField(blank=True)
    performed_by = models.CharField(max_length=100, default='System')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_movements'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type.upper()} {self.quantity} - {self.inventory.sku}"
