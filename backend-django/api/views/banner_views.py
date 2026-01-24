"""
Banner Views
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import Banner, MarqueeSetting
from ..viewmodels import BannerSerializer, MarqueeSettingSerializer


class BannerViewSet(viewsets.ModelViewSet):
    """
    Admin endpoints:
    GET    /banners/           - List all banners
    POST   /banners/           - Create banner
    GET    /banners/<id>/      - Get single banner
    PUT    /banners/<id>/      - Update banner
    DELETE /banners/<id>/      - Delete banner
    """
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action == 'list':
            # Allow public access for list (for frontend display)
            return [AllowAny()]
        return [IsAdminUser()]


class PublicBannersView(APIView):
    """GET /banners/active/ - Get active banners for frontend"""
    permission_classes = [AllowAny]

    def get(self, request):
        banners = Banner.objects.filter(enabled=True).order_by('order')
        serializer = BannerSerializer(banners, many=True, context={'request': request})
        return Response(serializer.data)


class MarqueeSettingViewSet(viewsets.ModelViewSet):
    """
    Admin endpoints:
    GET    /marquee/           - List marquee settings
    POST   /marquee/           - Create marquee setting
    PUT    /marquee/<id>/      - Update marquee setting
    """
    queryset = MarqueeSetting.objects.all()
    serializer_class = MarqueeSettingSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAdminUser()]


class ActiveMarqueeView(APIView):
    """GET /marquee/active/ - Get active marquee for frontend"""
    permission_classes = [AllowAny]

    def get(self, request):
        marquee = MarqueeSetting.objects.filter(enabled=True).first()
        if marquee:
            serializer = MarqueeSettingSerializer(marquee)
            return Response(serializer.data)
        return Response({'text': '', 'link': '', 'enabled': False})
