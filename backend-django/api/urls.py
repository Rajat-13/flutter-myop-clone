"""
=============================================================================
RIMAE API - ALL ENDPOINTS IN ONE FILE
=============================================================================

BASE URL: /api/v1/

=============================================================================
AUTHENTICATION ENDPOINTS
=============================================================================
POST   /auth/register/              - Register new user
POST   /auth/login/                 - Login with phone/email
POST   /auth/send-otp/              - Send OTP to phone
POST   /auth/verify-otp/            - Verify OTP
POST   /auth/token/refresh/         - Refresh JWT token
POST   /auth/logout/                - Logout user
GET    /auth/profile/               - Get current user profile
PUT    /auth/profile/               - Update user profile

=============================================================================
PRODUCT ENDPOINTS
=============================================================================
GET    /products/                   - List all products (paginated)
GET    /products/<id>/              - Get single product
GET    /products/bestsellers/       - Get bestseller products
GET    /products/category/<slug>/   - Get products by category
GET    /products/type/<type>/       - Get products by type (perfume/attar)
GET    /products/search/            - Search products

=============================================================================
FRAGRANCE ENDPOINTS (Admin)
=============================================================================
GET    /fragrances/                 - List all fragrances (paginated)
POST   /fragrances/                 - Create new fragrance
GET    /fragrances/<id>/            - Get single fragrance
PUT    /fragrances/<id>/            - Update fragrance
DELETE /fragrances/<id>/            - Delete fragrance
POST   /fragrances/<id>/images/     - Upload fragrance images
DELETE /fragrances/<id>/images/<img_id>/ - Delete fragrance image

=============================================================================
INGREDIENT ENDPOINTS (Admin)
=============================================================================
GET    /ingredients/                - List all ingredients
POST   /ingredients/                - Create new ingredient
GET    /ingredients/<id>/           - Get single ingredient
PUT    /ingredients/<id>/           - Update ingredient
DELETE /ingredients/<id>/           - Delete ingredient

=============================================================================
BANNER ENDPOINTS
=============================================================================
GET    /banners/                    - List all banners
POST   /banners/                    - Create banner (Admin)
GET    /banners/<id>/               - Get single banner
PUT    /banners/<id>/               - Update banner (Admin)
DELETE /banners/<id>/               - Delete banner (Admin)
GET    /banners/active/             - Get active banners for frontend

=============================================================================
MARQUEE ENDPOINTS
=============================================================================
GET    /marquee/                    - List marquee settings
POST   /marquee/                    - Create marquee setting (Admin)
PUT    /marquee/<id>/               - Update marquee setting (Admin)
GET    /marquee/active/             - Get active marquee for frontend

=============================================================================
INVENTORY ENDPOINTS (Admin)
=============================================================================
GET    /inventory/                  - List all inventory (paginated)
POST   /inventory/                  - Create inventory item
GET    /inventory/<id>/             - Get single inventory item
PUT    /inventory/<id>/             - Update inventory item
DELETE /inventory/<id>/             - Delete inventory item
POST   /inventory/<id>/adjust/      - Adjust stock level
GET    /inventory/stats/            - Get inventory statistics
GET    /stock-movements/            - List all stock movements

=============================================================================
ASSET ENDPOINTS (Admin)
=============================================================================
GET    /assets/                     - List all assets
POST   /assets/                     - Create asset record
GET    /assets/<id>/                - Get single asset
PUT    /assets/<id>/                - Update asset metadata
DELETE /assets/<id>/                - Delete asset record
PUT    /assets/<id>/update-usage/   - Update where asset is used
GET    /assets/stats/               - Get asset statistics

=============================================================================
ORDER ENDPOINTS
=============================================================================
GET    /orders/                     - List user orders (paginated)
POST   /orders/                     - Create new order
GET    /orders/<id>/                - Get single order
PUT    /orders/<id>/status/         - Update order status (Admin)
GET    /orders/admin/               - List all orders (Admin)

=============================================================================
ADDRESS ENDPOINTS
=============================================================================
GET    /addresses/                  - List user addresses
POST   /addresses/                  - Create new address
GET    /addresses/<id>/             - Get single address
PUT    /addresses/<id>/             - Update address
DELETE /addresses/<id>/             - Delete address
PUT    /addresses/<id>/default/     - Set as default address

=============================================================================
CART ENDPOINTS
=============================================================================
GET    /cart/                       - Get user cart
POST   /cart/add/                   - Add item to cart
PUT    /cart/update/<item_id>/      - Update cart item quantity
DELETE /cart/remove/<item_id>/      - Remove item from cart
DELETE /cart/clear/                 - Clear entire cart

=============================================================================
WISHLIST ENDPOINTS
=============================================================================
GET    /wishlist/                   - Get user wishlist
POST   /wishlist/add/               - Add item to wishlist
DELETE /wishlist/remove/<id>/       - Remove from wishlist

=============================================================================
REVIEW ENDPOINTS
=============================================================================
GET    /products/<id>/reviews/      - Get product reviews
POST   /products/<id>/reviews/      - Add product review
PUT    /reviews/<id>/               - Update review
DELETE /reviews/<id>/               - Delete review

=============================================================================
CUSTOMER ENDPOINTS (Admin)
=============================================================================
GET    /customers/                  - List all customers (paginated)
GET    /customers/<id>/             - Get customer details
GET    /customers/<id>/orders/      - Get customer orders
PUT    /customers/<id>/status/      - Update customer status

=============================================================================
ANALYTICS ENDPOINTS (Admin)
=============================================================================
GET    /analytics/dashboard/        - Get dashboard stats
GET    /analytics/sales/            - Get sales analytics
GET    /analytics/products/         - Get product analytics
GET    /analytics/customers/        - Get customer analytics

=============================================================================
PAYMENT ENDPOINTS
=============================================================================
GET    /payments/                   - List all payments (Admin)
POST   /payments/initiate/          - Initiate payment
POST   /payments/verify/            - Verify payment
GET    /payments/<id>/              - Get payment details

=============================================================================
NOTIFICATION ENDPOINTS (Admin)
=============================================================================
GET    /notifications/              - List notifications
POST   /notifications/broadcast/    - Send broadcast notification
PUT    /notifications/<id>/read/    - Mark as read

=============================================================================
SETTINGS ENDPOINTS (Admin)
=============================================================================
GET    /settings/                   - Get all settings
PUT    /settings/brand/             - Update brand settings
PUT    /settings/security/          - Update security settings
=============================================================================
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth_views import (
    RegisterView, LoginView, SendOTPView, VerifyOTPView,
    LogoutView, ProfileView
)
from .views.product_views import (
    ProductViewSet, BestsellersView, ProductSearchView
)
from .views.fragrance_views import (
    FragranceViewSet, FragranceImageUploadView, FragranceImageDeleteView
)
from .views.ingredient_views import IngredientViewSet
from .views.order_views import OrderViewSet, AdminOrderViewSet
from .views.address_views import AddressViewSet
from .views.cart_views import CartViewSet
from .views.wishlist_views import WishlistViewSet
from .views.review_views import ReviewViewSet
from .views.customer_views import CustomerViewSet
from .views.analytics_views import AnalyticsView
from .views.payment_views import PaymentViewSet
from .views.notification_views import NotificationViewSet
from .views.settings_views import SettingsView
from .views.banner_views import (
    BannerViewSet, PublicBannersView, 
    MarqueeSettingViewSet, ActiveMarqueeView
)
from .views.inventory_views import (
    InventoryViewSet, InventoryStatsView, StockMovementViewSet
)
from .views.asset_views import AssetViewSet, AssetStatsView

# Router setup
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'fragrances', FragranceViewSet, basename='fragrance')
router.register(r'ingredients', IngredientViewSet, basename='ingredient')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'marquee', MarqueeSettingViewSet, basename='marquee')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'stock-movements', StockMovementViewSet, basename='stock-movement')
router.register(r'assets', AssetViewSet, basename='asset')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # ===== Authentication =====
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    
    # ===== Products =====
    path('products/bestsellers/', BestsellersView.as_view(), name='bestsellers'),
    path('products/search/', ProductSearchView.as_view(), name='product-search'),
    
    # ===== Fragrances (Admin) =====
    path('fragrances/<int:pk>/images/', FragranceImageUploadView.as_view(), name='fragrance-image-upload'),
    path('fragrances/<int:pk>/images/<int:img_id>/', FragranceImageDeleteView.as_view(), name='fragrance-image-delete'),
    
    # ===== Banners =====
    path('banners/active/', PublicBannersView.as_view(), name='active-banners'),
    
    # ===== Marquee =====
    path('marquee/active/', ActiveMarqueeView.as_view(), name='active-marquee'),
    
    # ===== Inventory (Admin) =====
    path('inventory/stats/', InventoryStatsView.as_view(), name='inventory-stats'),
    
    # ===== Assets (Admin) =====
    path('assets/stats/', AssetStatsView.as_view(), name='asset-stats'),
    
    # ===== Reviews =====
    path('products/<int:product_id>/reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-reviews'),
    
    # ===== Admin Orders =====
    path('orders/admin/', AdminOrderViewSet.as_view({'get': 'list'}), name='admin-orders'),
    path('orders/<int:pk>/status/', AdminOrderViewSet.as_view({'put': 'update_status'}), name='order-status'),
    
    # ===== Analytics (Admin) =====
    path('analytics/dashboard/', AnalyticsView.as_view(), name='analytics-dashboard'),
    path('analytics/sales/', AnalyticsView.as_view(), name='analytics-sales'),
    path('analytics/products/', AnalyticsView.as_view(), name='analytics-products'),
    path('analytics/customers/', AnalyticsView.as_view(), name='analytics-customers'),
    
    # ===== Settings (Admin) =====
    path('settings/', SettingsView.as_view(), name='settings'),
    path('settings/brand/', SettingsView.as_view(), name='settings-brand'),
    path('settings/security/', SettingsView.as_view(), name='settings-security'),
]
