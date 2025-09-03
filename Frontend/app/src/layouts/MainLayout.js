import React, { useState } from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, 
  ListItemButton, ListItemText, CssBaseline, Box, IconButton 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import ClientList from '../components/ClientList';
import SupplierList from '../components/SupplierList';
import SaleList from '../components/SaleList'; // Importar SaleList

// Placeholder para el futuro dashboard
function Dashboard() {
  return <Typography variant="h4">Bienvenido al Dashboard</Typography>;
}

const drawerWidth = 240;

function MainLayout({ setToken }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/categorias">
            <ListItemText primary="Categorías" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/productos">
            <ListItemText primary="Productos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/clientes">
            <ListItemText primary="Clientes" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/proveedores">
            <ListItemText primary="Proveedores" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/ventas">
            <ListItemText primary="Ventas" />
          </ListItemButton>
        </ListItem>
        {/* Aquí se agregarán más items de menú para otros CRUDs */}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Mi Aplicación
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer para escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categorias" element={<CategoryList />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/clientes" element={<ClientList />} />
          <Route path="/proveedores" element={<SupplierList />} />
          <Route path="/ventas" element={<SaleList />} /> {/* Nueva ruta para ventas */}
          {/* Aquí se agregarán las rutas para los demás CRUDs */}
        </Routes>
      </Box>
    </Box>
  );
}

export default MainLayout;