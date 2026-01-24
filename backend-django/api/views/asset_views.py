"""
Asset Views (Admin)
Assets are stored in Supabase storage, metadata in PostgreSQL
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Asset
from ..viewmodels import (
    AssetSerializer, 
    AssetCreateSerializer,
    AssetUpdateUsageSerializer
)


class AssetViewSet(viewsets.ModelViewSet):
    """
    GET    /assets/                    - List all assets
    POST   /assets/                    - Create asset record (after upload to Supabase)
    GET    /assets/<id>/               - Get single asset
    PUT    /assets/<id>/               - Update asset metadata
    DELETE /assets/<id>/               - Delete asset record
    PUT    /assets/<id>/update-usage/  - Update where asset is used
    """
    queryset = Asset.objects.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['name', 'used_in']
    ordering_fields = ['created_at', 'name', 'size_bytes']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return AssetCreateSerializer
        return AssetSerializer

    @action(detail=True, methods=['put'], url_path='update-usage')
    def update_usage(self, request, pk=None):
        """Update where an asset is used"""
        asset = self.get_object()
        serializer = AssetUpdateUsageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        asset.used_in = serializer.validated_data['used_in']
        asset.save()
        
        return Response(AssetSerializer(asset).data)


class AssetStatsView(APIView):
    """GET /assets/stats/ - Get asset statistics"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        assets = Asset.objects.all()
        
        total_count = assets.count()
        image_count = assets.filter(type='image').count()
        video_count = assets.filter(type='video').count()
        total_size = sum(asset.size_bytes for asset in assets)
        unused_count = assets.filter(used_in=[]).count()

        return Response({
            'total_count': total_count,
            'image_count': image_count,
            'video_count': video_count,
            'total_size_bytes': total_size,
            'unused_count': unused_count
        })
