from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelo para Tipos de Usuario (Roles)
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Modelo de Usuario Personalizado
class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

# Modelo para Categorías de Productos
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, help_text="Nombre de la categoría")
    descripcion = models.TextField(blank=True, null=True, help_text="Descripción de la categoría")
    ubicacion_pasillo = models.CharField(max_length=50, blank=True, help_text="Pasillo donde se encuentra la categoría")
    activa = models.BooleanField(default=True, help_text="Indica si la categoría está activa")

    def __str__(self):
        return self.nombre

# Modelo para Productos
class Producto(models.Model):
    nombre = models.CharField(max_length=200, help_text="Nombre del producto")
    descripcion = models.TextField(blank=True, null=True, help_text="Descripción detallada del producto")
    precio = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio de venta del producto")
    stock = models.PositiveIntegerField(default=0, help_text="Cantidad en inventario")
    codigo_barra = models.CharField(max_length=100, unique=True, help_text="Código de barras del producto")
    categoria = models.ForeignKey(Categoria, related_name='productos', on_delete=models.CASCADE, help_text="Categoría a la que pertenece el producto")
    proveedor = models.ForeignKey('Proveedor', on_delete=models.SET_NULL, null=True, blank=True, help_text="Proveedor del producto")

    def __str__(self):
        return self.nombre

# Modelo para Clientes
class Cliente(models.Model):
    nombre = models.CharField(max_length=100, help_text="Nombre del cliente")
    apellido = models.CharField(max_length=100, help_text="Apellido del cliente")
    cedula = models.CharField(max_length=20, unique=True, help_text="Cédula o identificador único del cliente")
    telefono = models.CharField(max_length=15, blank=True, help_text="Número de teléfono del cliente")
    email = models.EmailField(unique=True, blank=True, null=True, help_text="Correo electrónico del cliente")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# Modelo para Proveedores
class Proveedor(models.Model):
    nombre_empresa = models.CharField(max_length=200, help_text="Nombre de la empresa proveedora")
    contacto_nombre = models.CharField(max_length=100, blank=True, help_text="Nombre del contacto principal")
    telefono = models.CharField(max_length=15, help_text="Número de teléfono del proveedor")
    email = models.EmailField(unique=True, help_text="Correo electrónico del proveedor")
    direccion = models.TextField(blank=True, null=True, help_text="Dirección física del proveedor")

    def __str__(self):
        return self.nombre_empresa

# Modelo para Ventas
class Venta(models.Model):
    fecha = models.DateTimeField(auto_now_add=True, help_text="Fecha y hora de la venta")
    total = models.DecimalField(max_digits=12, decimal_places=2, help_text="Monto total de la venta")
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True, help_text="Cliente que realizó la compra")
    vendedor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, help_text="Empleado que realizó la venta")

    def __str__(self):
        return f"Venta #{self.id} - {self.fecha.strftime('%Y-%m-%d')}"

# Modelo para el Detalle de la Venta
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE, help_text="Venta a la que pertenece este detalle")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, help_text="Producto vendido")
    cantidad = models.PositiveIntegerField(help_text="Cantidad de unidades vendidas")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio del producto al momento de la venta")
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, help_text="Subtotal (cantidad * precio_unitario)")

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} @ ${self.precio_unitario}"