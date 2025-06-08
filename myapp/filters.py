import django_filters
from .models import Venta

class VentaFilter(django_filters.FilterSet):
    fecha_desde = django_filters.DateFilter(field_name='fecha_venta', lookup_expr='gte')
    fecha_hasta = django_filters.DateFilter(field_name='fecha_venta', lookup_expr='lte')

    class Meta:
        model = Venta
        fields = ['fecha_desde', 'fecha_hasta']