"""
RIMAE Models - PostgreSQL Database Schema
"""
from .user import User, OTP
from .product import Product, ProductImage, Category
from .fragrance import Fragrance, FragranceImage, Ingredient, FragranceNote
from .order import Order, OrderItem
from .address import Address
from .cart import Cart, CartItem
from .wishlist import Wishlist
from .review import Review
from .payment import Payment
from .notification import Notification
from .settings import BrandSettings
from .banner import Banner, MarqueeSetting
from .inventory import Inventory, StockMovement
from .asset import Asset

__all__ = [
    'User', 'OTP',
    'Product', 'ProductImage', 'Category',
    'Fragrance', 'FragranceImage', 'Ingredient', 'FragranceNote',
    'Order', 'OrderItem',
    'Address',
    'Cart', 'CartItem',
    'Wishlist',
    'Review',
    'Payment',
    'Notification',
    'BrandSettings',
    'Banner', 'MarqueeSetting',
    'Inventory', 'StockMovement',
    'Asset',
]
