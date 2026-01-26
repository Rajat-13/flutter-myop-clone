"""
RIMAE Views
"""
from .auth_views import RegisterView, LoginView, SendOTPView, VerifyOTPView, LogoutView, ProfileView
from .product_views import ProductViewSet, BestsellersView, ProductSearchView
from .fragrance_views import (
    FragranceViewSet, FragranceImageUploadView, FragranceImageDeleteView,
    PublicFragrancesView, FragranceBestsellersView
)
from .ingredient_views import IngredientViewSet
from .order_views import OrderViewSet, AdminOrderViewSet
from .address_views import AddressViewSet
from .cart_views import CartViewSet
from .wishlist_views import WishlistViewSet
from .review_views import ReviewViewSet
from .customer_views import CustomerViewSet
from .analytics_views import AnalyticsView
from .payment_views import PaymentViewSet
from .notification_views import NotificationViewSet
from .settings_views import SettingsView
