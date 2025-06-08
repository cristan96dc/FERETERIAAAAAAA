from rest_framework import serializers
from .models import Producto, Proveedor, Proveedor2

class Proveedor2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor2
        fields = ['cuit', 'direccion', 'comentarios', 'contacto2']

# Serializer principal para Proveedor, incluyendo Proveedor2 anidado
class ProveedorSerializer(serializers.ModelSerializer):
    datos_extra = Proveedor2Serializer()

    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'contacto', 'telefono', 'datos_extra']

    def create(self, validated_data):
        datos_extra_data = validated_data.pop('datos_extra')
        proveedor = Proveedor.objects.create(**validated_data)
        Proveedor2.objects.create(proveedor=proveedor, **datos_extra_data)
        return proveedor

    def update(self, instance, validated_data):
        datos_extra_data = validated_data.pop('datos_extra')
        # Actualizar campos de Proveedor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar campos de Proveedor2
        datos_extra = instance.datos_extra
        for attr, value in datos_extra_data.items():
            setattr(datos_extra, attr, value)
        datos_extra.save()

from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    tipo_producto_choices = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = '__all__'  # o los campos que uses
        # o agregar explícitamente 'tipo_producto_choices' si no usas '__all__'

    def get_tipo_producto_choices(self, obj):
        return [{'value': choice[0], 'label': choice[1]} for choice in Producto.TIPO_PRODUCTO_CHOICES]

class CantidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'numero_item', 'cantidad_disponible']
        
from rest_framework import serializers
from .models import Venta

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

from .models import Factura

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'
