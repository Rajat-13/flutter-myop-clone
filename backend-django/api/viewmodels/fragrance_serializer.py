"""
Fragrance Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Fragrance, FragranceImage, Ingredient, FragranceNote


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'category', 'description', 'origin',
            'cost_per_unit', 'stock_quantity', 'unit', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FragranceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceImage
        fields = ['id', 'image', 'is_cover', 'order']


class FragranceNoteSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)

    class Meta:
        model = FragranceNote
        fields = ['id', 'ingredient', 'ingredient_name', 'note_type', 'percentage']


class FragranceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list/table views"""
    cover_image = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    image_count = serializers.SerializerMethodField()

    class Meta:
        model = Fragrance
        fields = [
            'id', 'name', 'sku', 'slug', 'type', 'concentration', 'gender', 'category',
            'price', 'discount', 'final_price',
            'stock_quantity', 'min_order_threshold', 'watching_count',
            'status', 'is_active', 'is_bestseller', 'cover_image', 'image_count',
            'top_notes', 'middle_notes', 'base_notes',
            'created_at', 'updated_at'
        ]

    def get_cover_image(self, obj):
        cover = obj.images.filter(is_cover=True).first()
        if cover:
            return cover.image.url
        first_image = obj.images.first()
        return first_image.image.url if first_image else None

    def get_image_count(self, obj):
        return obj.images.count()


class FragranceSerializer(serializers.ModelSerializer):
    """Full serializer for detail/edit views"""
    images = FragranceImageSerializer(many=True, read_only=True)
    notes = FragranceNoteSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Fragrance
        fields = [
            'id', 'name', 'sku', 'slug', 'type', 'concentration', 'gender', 'category',
            'description', 'short_description',
            'price', 'discount', 'final_price',
            'stock_quantity', 'min_order_threshold', 'watching_count',
            'status', 'is_active', 'is_bestseller',
            'top_notes', 'middle_notes', 'base_notes',
            'images', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
