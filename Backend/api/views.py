from rest_framework import viewsets, permissions
from .models import (
    User, Role, Categoria, Producto, Cliente, Proveedor, Venta, DetalleVenta
)
from .serializers import (
    UserSerializer, RoleSerializer, CategoriaSerializer, ProductoSerializer,
    ClienteSerializer, ProveedorSerializer, VentaSerializer, DetalleVentaSerializer
)

# Permiso personalizado para verificar roles
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role and request.user.role.name == 'Administrador'

class IsCajaUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role and request.user.role.name == 'Caja'

# ViewSets para cada modelo

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] # Solo admins pueden gestionar usuarios

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser] # Solo admins pueden gestionar roles

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [IsAdminUser] # Solo admins gestionan proveedores

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Admins y Cajeros pueden ver las ventas
            return [permissions.IsAuthenticated(), (IsAdminUser | IsCajaUser)()]
        # Solo Admins y Cajeros pueden crear ventas
        return [permissions.IsAuthenticated(), (IsAdminUser | IsCajaUser)()]

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [permissions.IsAuthenticated, (IsAdminUser | IsCajaUser)] # Admins y Cajeros pueden ver/gestionar detalles