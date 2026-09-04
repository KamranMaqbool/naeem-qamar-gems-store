from django.db.models import Count, F, Sum
from django.db.models.functions import TruncDay, TruncMonth
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory.models import Inventory
from apps.orders.models import Order, OrderItem


class DashboardKPIsView(APIView):
    """GET: high-level dashboard metrics."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        total_revenue = (
            Order.objects.filter(order_status=Order.Status.COMPLETED)
            .aggregate(total=Sum('total_amount'))['total']
        ) or 0

        active_orders_count = Order.objects.exclude(
            order_status__in=[Order.Status.COMPLETED, Order.Status.CANCELLED],
        ).count()

        low_stock_count = Inventory.objects.filter(
            stock_status=Inventory.StockStatus.LOW_STOCK,
        ).count()

        total_orders = Order.objects.count()

        return Response({
            'total_revenue': str(total_revenue),
            'active_orders_count': active_orders_count,
            'low_stock_count': low_stock_count,
            'total_orders': total_orders,
        })


class RevenueChartView(APIView):
    """GET: revenue aggregated by day or month.

    Query param: period=daily|monthly (defaults to daily)
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        period = request.query_params.get('period', 'daily')

        trunc_fn = TruncDay if period == 'daily' else TruncMonth

        data = (
            Order.objects.filter(order_status=Order.Status.COMPLETED)
            .annotate(period=trunc_fn('created_at'))
            .values('period')
            .annotate(revenue=Sum('total_amount'), order_count=Count('id'))
            .order_by('period')
        )

        return Response([
            {
                'period': entry['period'].isoformat(),
                'revenue': str(entry['revenue']),
                'order_count': entry['order_count'],
            }
            for entry in data
        ])


class SalesByGemstoneView(APIView):
    """GET: sales aggregated by gemstone cut/type from order item snapshots."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        items = OrderItem.objects.filter(
            gemstone_snapshot__isnull=False,
            order__order_status=Order.Status.COMPLETED,
        ).values_list('gemstone_snapshot', 'quantity', 'unit_price_at_purchase')

        aggregation = {}
        for snapshot, qty, price in items:
            if not snapshot:
                continue
            key = snapshot.get('cut_shape', 'Unknown')
            if key not in aggregation:
                aggregation[key] = {'cut_shape': key, 'total_quantity': 0, 'total_revenue': 0}
            aggregation[key]['total_quantity'] += qty
            aggregation[key]['total_revenue'] += float(price) * qty

        result = sorted(aggregation.values(), key=lambda x: x['total_revenue'], reverse=True)
        for entry in result:
            entry['total_revenue'] = f"{entry['total_revenue']:.2f}"

        return Response(result)


class TopProductsView(APIView):
    """GET: best-selling products by completed-order revenue."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        rows = (
            OrderItem.objects.filter(order__order_status=Order.Status.COMPLETED)
            .values('product_id', 'product__title', 'product__sku')
            .annotate(quantity=Sum('quantity'), revenue=Sum(F('unit_price_at_purchase') * F('quantity')))
            .order_by('-revenue')[:10]
        )
        return Response([
            {
                'id': row['product_id'],
                'name': row['product__title'] or 'Deleted product',
                'sku': row['product__sku'] or '-',
                'quantity': row['quantity'] or 0,
                'revenue': str(row['revenue'] or 0),
            }
            for row in rows
        ])
