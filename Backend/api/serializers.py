from rest_framework import serializers
from .models import (
    User, Role, Categoria, Producto, Cliente, Proveedor, Venta, DetalleVenta
)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ('producto','cantidad')
        read_only_fields = ('precio_unitario', 'subtotal')

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ('id', 'fecha', 'total', 'cliente', 'vendedor', 'detalles')
        read_only_fields = ('total',)

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        
        # El total se ignora del request, se calculará
        validated_data.pop('total', None)
        
        venta = Venta.objects.create(total=0, **validated_data)
        total_venta = 0

        for detalle_data in detalles_data:
            producto = detalle_data['producto']
            cantidad = detalle_data['cantidad']
            
            # Usar el precio de la base de datos
            precio_unitario = producto.precio
            subtotal = cantidad * precio_unitario
            total_venta += subtotal

            DetalleVenta.objects.create(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=subtotal
            )

        # Actualizar el total de la venta
        venta.total = total_venta
        venta.save()

        return venta
