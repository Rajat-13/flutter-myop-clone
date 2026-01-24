"""
RIMAE ViewModels (Serializers)
"""
from .user_serializer import UserSerializer, UserCreateSerializer, OTPSerializer, LoginSerializer
from .product_serializer import ProductSerializer, ProductListSerializer, CategorySerializer
from .fragrance_serializer import FragranceSerializer, FragranceListSerializer, IngredientSerializer
from .order_serializer import OrderSerializer, OrderListSerializer, OrderItemSerializer
from .address_serializer import AddressSerializer
from .cart_serializer import CartSerializer, CartItemSerializer
from .wishlist_serializer import WishlistSerializer
from .review_serializer import ReviewSerializer
from .payment_serializer import PaymentSerializer
from .notification_serializer import NotificationSerializer
from .settings_serializer import BrandSettingsSerializer
from .banner_serializer import BannerSerializer, MarqueeSettingSerializer
from .inventory_serializer import (
    InventorySerializer, 
    InventoryListSerializer, 
    StockMovementSerializer,
    StockAdjustmentSerializer
)
from .asset_serializer import AssetSerializer, AssetCreateSerializer, AssetUpdateUsageSerializer

__all__ = [
    'UserSerializer', 'UserCreateSerializer', 'OTPSerializer', 'LoginSerializer',
    'ProductSerializer', 'ProductListSerializer', 'CategorySerializer',
    'FragranceSerializer', 'FragranceListSerializer', 'IngredientSerializer',
    'OrderSerializer', 'OrderListSerializer', 'OrderItemSerializer',
    'AddressSerializer',
    'CartSerializer', 'CartItemSerializer',
    'WishlistSerializer',
    'ReviewSerializer',
    'PaymentSerializer',
    'NotificationSerializer',
    'BrandSettingsSerializer',
    'BannerSerializer', 'MarqueeSettingSerializer',
    'InventorySerializer', 'InventoryListSerializer', 'StockMovementSerializer', 'StockAdjustmentSerializer',
    'AssetSerializer', 'AssetCreateSerializer', 'AssetUpdateUsageSerializer',
]
