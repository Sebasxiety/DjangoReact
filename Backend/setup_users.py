from api.models import Role, User

# Crear roles
admin_role, _ = Role.objects.get_or_create(name='Administrador')
caja_role, _ = Role.objects.get_or_create(name='Caja')

print("Roles creados.")

# Crear usuario Administrador
if not User.objects.filter(username='admin').exists():
    admin_user = User.objects.create_user(
        username='admin',
        password='admin123',
        email='admin@ferreteria.com',
        first_name='Admin',
        last_name='User',
        is_staff=True,
        is_superuser=True # Para acceso al panel de admin de Django
    )
    admin_user.role = admin_role
    admin_user.save()
    print("Usuario Administrador creado (admin / admin123)")
else:
    print("Usuario Administrador ya existe.")

# Crear usuario Caja
if not User.objects.filter(username='cajero1').exists():
    caja_user = User.objects.create_user(
        username='cajero1',
        password='caja123',
        email='caja1@ferreteria.com',
        first_name='Caja',
        last_name='User'
    )
    caja_user.role = caja_role
    caja_user.save()
    print("Usuario Cajero creado (cajero1 / caja123)")
else:
    print("Usuario Cajero ya existe.")
