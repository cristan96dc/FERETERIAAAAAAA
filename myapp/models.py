from django.db import models

# Modelo de proveedor
class Proveedor(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    contacto = models.CharField(max_length=100, blank=True)
    telefono = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.nombre
class Proveedor2(models.Model):
    proveedor = models.OneToOneField(
        Proveedor,
        on_delete=models.CASCADE,
        related_name='datos_extra'
    )
    cuit = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=255, blank=True)
    comentarios = models.TextField(blank=True)
    contacto2 = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Datos extra de {self.proveedor.nombre}"
# Modelo de producto
class Producto(models.Model):
    TIPO_PRODUCTO_CHOICES = [
        ('MARTILLO', 'Martillo'),
        ('DESTORNILLADOR', 'Destornillador'),
        ('TUERCA', 'Tuerca'),
        ('CLAVO', 'Clavo'),
    ]

    numero_item = models.CharField(max_length=50, unique=True)
    nombre_articulo = models.CharField(
        max_length=200,
        choices=TIPO_PRODUCTO_CHOICES,
    )
    descripcion = models.TextField(blank=True)
    proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_disponible = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_nombre_articulo_display()} - {self.numero_item}"
    
    
### extra

class Venta(models.Model):
    METODOS_PAGO = [
        ('EF', 'Efectivo'),
        ('TD', 'Tarjeta Débito'),
        ('TC', 'Tarjeta Crédito'),
        ('TR', 'Transferencia'),
    ]

    fecha_venta = models.DateTimeField(auto_now_add=True)
    total_venta = models.DecimalField(max_digits=12, decimal_places=2)
    metodo_pago = models.CharField(max_length=2, choices=METODOS_PAGO)
    
    
class Factura(models.Model):
    TIPOS_FACTURA = [
        ('A', 'Factura A'),
        ('B', 'Factura B'),
        ('C', 'Factura C'),
    ]

    venta = models.OneToOneField(Venta, on_delete=models.CASCADE, null=True, blank=True)
    tipo_factura = models.CharField(max_length=1, choices=TIPOS_FACTURA)
    #punto_venta = models.IntegerField()
    numero_factura = models.CharField(max_length=20, unique=True)
    codigo_autorizacion = models.CharField(max_length=100, null=True, blank=True)
    fecha_factura = models.DateTimeField(auto_now_add=True)
    total_factura = models.DecimalField(max_digits=12, decimal_places=2)
    exito = models.BooleanField(default=False)
    mensaje_error = models.TextField(null=True, blank=True)
    cae = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"Factura {self.numero_factura} - {'Éxito' if self.exito else 'Error'}"
