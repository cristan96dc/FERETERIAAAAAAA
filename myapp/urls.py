from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    VentaViewSet,
    ProveedorViewSet,
    FacturaViewSet,
    EmitirFacturaViewSet,
    hola_desde_django,
    tipo_producto_choices,
    home_view,
    emitir_factura_view
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'ventas', VentaViewSet, basename='ventas')
router.register(r'proveedores', ProveedorViewSet)
router.register(r'emitir-factura', EmitirFacturaViewSet, basename='emitir-factura')
router.register(r'facturas', FacturaViewSet, basename='factura')


urlpatterns = [
    path('', include(router.urls)),
    path('hola/', hola_desde_django),
    path('api/producto-tipos/', tipo_producto_choices, name='producto-tipos'),
    path('bienvenida/', home_view),
    path('emitir-factura/', emitir_factura_view, name='emitir_factura'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
