"""
Inventory Views (Admin)
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from django.db.models import Sum, Count

from ..models import Inventory, StockMovement
from ..viewmodels import (
    InventorySerializer, 
    InventoryListSerializer,
    StockMovementSerializer,
    StockAdjustmentSerializer
)


class InventoryViewSet(viewsets.ModelViewSet):
    """
    GET    /inventory/                    - List all inventory (paginated)
    GET    /inventory/<id>/               - Get single inventory item
    POST   /inventory/                    - Create inventory item
    PUT    /inventory/<id>/               - Update inventory item
    DELETE /inventory/<id>/               - Delete inventory item
    POST   /inventory/<id>/adjust/        - Adjust stock level
    """
    queryset = Inventory.objects.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['size', 'location']
    search_fields = ['sku', 'fragrance__name', 'product__name', 'supplier_name']
    ordering_fields = ['current_stock', 'cost_per_unit', 'last_restocked', 'updated_at']
    ordering = ['-updated_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return InventoryListSerializer
        return InventorySerializer

    @action(detail=True, methods=['post'])
    def adjust(self, request, pk=None):
        """Adjust stock levels with movement tracking"""
        inventory = self.get_object()
        serializer = StockAdjustmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        movement_type = data['type']
        quantity = data['quantity']
        reason = data.get('reason', '')

        # Calculate new stock
        if movement_type == 'out':
            new_stock = max(0, inventory.current_stock - quantity)
        else:
            new_stock = inventory.current_stock + quantity

        # Update inventory
        inventory.current_stock = new_stock
        if movement_type == 'in':
            inventory.last_restocked = timezone.now()
        inventory.save()

        # Record movement
        StockMovement.objects.create(
            inventory=inventory,
            type=movement_type,
            quantity=quantity if movement_type != 'out' else -quantity,
            reason=reason,
            performed_by=request.user.username or 'Admin'
        )

        return Response(InventorySerializer(inventory).data)


class InventoryStatsView(APIView):
    """GET /inventory/stats/ - Get inventory statistics"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        inventory = Inventory.objects.all()
        
        total_units = inventory.aggregate(Sum('current_stock'))['current_stock__sum'] or 0
        total_value = sum(
            item.current_stock * float(item.cost_per_unit) 
            for item in inventory
        )
        low_stock = inventory.filter(current_stock__lte=models.F('reorder_level')).count()
        out_of_stock = inventory.filter(current_stock=0).count()

        return Response({
            'total_units': total_units,
            'total_value': total_value,
            'low_stock_count': low_stock,
            'out_of_stock_count': out_of_stock,
            'total_items': inventory.count()
        })


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /stock-movements/           - List all movements
    GET /stock-movements/<id>/      - Get single movement
    """
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['type', 'inventory']
    ordering = ['-created_at']
