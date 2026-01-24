"""
Inventory Serializers
"""
from rest_framework import serializers
from ..models import Inventory, StockMovement


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = [
            'id', 'inventory', 'type', 'quantity',
            'reason', 'performed_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    stock_status = serializers.CharField(read_only=True)
    recent_movements = StockMovementSerializer(
        source='movements', 
        many=True, 
        read_only=True
    )

    class Meta:
        model = Inventory
        fields = [
            'id', 'fragrance', 'product', 'sku', 'size',
            'product_name', 'product_image',
            'current_stock', 'reorder_level', 'cost_per_unit',
            'supplier_name', 'location', 'last_restocked',
            'stock_status', 'recent_movements',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'stock_status', 'created_at', 'updated_at']

    def get_product_name(self, obj):
        if obj.fragrance:
            return obj.fragrance.name
        elif obj.product:
            return obj.product.name
        return 'Unknown'

    def get_product_image(self, obj):
        if obj.fragrance:
            cover = obj.fragrance.images.filter(is_cover=True).first()
            if cover:
                return cover.image.url
            first = obj.fragrance.images.first()
            return first.image.url if first else None
        elif obj.product:
            cover = obj.product.images.filter(is_cover=True).first()
            if cover:
                return cover.image.url
            first = obj.product.images.first()
            return first.image.url if first else None
        return None


class InventoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    product_name = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    stock_status = serializers.CharField(read_only=True)

    class Meta:
        model = Inventory
        fields = [
            'id', 'sku', 'size', 'product_name', 'product_image',
            'current_stock', 'reorder_level', 'cost_per_unit',
            'supplier_name', 'location', 'stock_status', 'last_restocked'
        ]

    def get_product_name(self, obj):
        if obj.fragrance:
            return obj.fragrance.name
        elif obj.product:
            return obj.product.name
        return 'Unknown'

    def get_product_image(self, obj):
        if obj.fragrance:
            cover = obj.fragrance.images.filter(is_cover=True).first()
            if cover:
                return cover.image.url
        elif obj.product:
            cover = obj.product.images.filter(is_cover=True).first()
            if cover:
                return cover.image.url
        return None


class StockAdjustmentSerializer(serializers.Serializer):
    """For adjusting stock levels"""
    type = serializers.ChoiceField(choices=['in', 'out', 'adjustment'])
    quantity = serializers.IntegerField(min_value=1)
    reason = serializers.CharField(required=False, allow_blank=True)
