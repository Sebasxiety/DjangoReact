import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, 
  Grid, IconButton, Typography, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import apiClient from '../api';

// Función para obtener el ID de usuario del token JWT
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id; // Asegúrate de que el payload del token contenga 'user_id'
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

function SaleModal({ open, onClose, onSave, sale }) {
  const [formData, setFormData] = useState({
    cliente: '',
    vendedor: '',
    total: 0,
    detalles: [],
  });
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effect to fetch data and populate form
  useEffect(() => {
    if (open) {
      setLoading(true);
      const dataPromise = Promise.all([
        apiClient.get('/clientes/'),
        apiClient.get('/productos/')
      ]);

      dataPromise.then(([clientesRes, productosRes]) => {
        setClientes(clientesRes.data);
        setProductos(productosRes.data);

        if (sale && sale.id) {
          // Editing an existing sale, fetch its full details
          apiClient.get(`/ventas/${sale.id}/`).then(saleRes => {
            const detailedSale = saleRes.data;
            setFormData({
              cliente: detailedSale.cliente.id || detailedSale.cliente,
              vendedor: detailedSale.vendedor.id || detailedSale.vendedor,
              total: parseFloat(detailedSale.total) || 0,
              detalles: detailedSale.detalles ? detailedSale.detalles.map(detail => ({
                ...detail,
                producto: detail.producto.id || detail.producto,
                precio_unitario: parseFloat(detail.precio_unitario),
                subtotal: parseFloat(detail.subtotal),
              })) : [],
            });
            setLoading(false);
          }).catch(error => {
            console.error(`Error fetching details for sale ${sale.id}:`, error);
            setLoading(false);
          });
        } else {
          // Creating a new sale
          const userId = getUserIdFromToken();
          setFormData({
            cliente: '',
            vendedor: userId || '',
            total: 0,
            detalles: [],
          });
          setLoading(false);
        }
      }).catch(error => {
        console.error("Error fetching data for sale modal:", error);
        setLoading(false);
      });
    } else {
      // Reset form state when modal is closed
      setFormData({ cliente: '', vendedor: '', total: 0, detalles: [] });
      setClientes([]);
      setProductos([]);
    }
  }, [open, sale]);

  // Calculate total whenever details change
  useEffect(() => {
    // Avoid recalculating total when form is first populated
    if (loading) return;
    const newTotal = formData.detalles.reduce((sum, detail) => sum + (detail.subtotal || 0), 0);
    setFormData(prev => ({ ...prev, total: newTotal }));
  }, [formData.detalles, loading]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newDetalles = [...formData.detalles];

    if (name === 'producto') {
      const selectedProduct = productos.find(p => p.id === value);
      newDetalles[index] = {
        ...newDetalles[index],
        producto: value,
        precio_unitario: selectedProduct ? parseFloat(selectedProduct.precio) : 0,
      };
    } else if (name === 'cantidad') {
      const cantidad = parseInt(value, 10) || 0;
      newDetalles[index] = {
        ...newDetalles[index],
        cantidad: cantidad,
      };
    }

    // Recalculate subtotal
    newDetalles[index].subtotal = (newDetalles[index].cantidad || 0) * (newDetalles[index].precio_unitario || 0);

    setFormData(prev => ({ ...prev, detalles: newDetalles }));
  };

  const handleAddDetail = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { producto: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }],
    }));
  };

  const handleRemoveDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      cliente: formData.cliente,
      vendedor: formData.vendedor || getUserIdFromToken(),
      detalles: formData.detalles.map(detail => ({
        ...detail,
        producto: detail.producto,
      })),
    };
    onSave({ ...sale, ...dataToSave });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{sale ? 'Editar Venta' : 'Registrar Nueva Venta'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 2 }}>
            {/* Select de Cliente en la parte superior */}
            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel id="cliente-label">Cliente</InputLabel>
              <Select
                labelId="cliente-label"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                label="Cliente"
                onChange={handleChange}
              >
                {clientes.map((cli) => (
                  <MenuItem key={cli.id} value={cli.id}>
                    {cli.nombre} {cli.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Botón para agregar productos */}
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddDetail} 
              variant="outlined" 
              sx={{ mb: 3 }}
              fullWidth
            >
              Agregar Producto a la Venta
            </Button>

            {/* Detalles de la Venta */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Detalles de la Venta</Typography>
              {formData.detalles.map((detail, index) => (
                <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                  <Grid xs={12} sm={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`producto-label-${index}`}>Producto</InputLabel>
                      <Select
                        labelId={`producto-label-${index}`}
                        id={`producto-${index}`}
                        name="producto"
                        value={detail.producto}
                        label="Producto"
                        onChange={(e) => handleDetailChange(index, e)}
                      >
                        {productos.map((prod) => (
                          <MenuItem key={prod.id} value={prod.id}>
                            {prod.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={4} sm={1.5}>
                    <TextField
                      size="small"
                      label="Cant."
                      type="number"
                      name="cantidad"
                      value={detail.cantidad}
                      onChange={(e) => handleDetailChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={4} sm={1.5}>
                    <TextField
                      size="small"
                      label="Precio"
                      type="number"
                      value={detail.precio_unitario.toFixed(2)}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={4} sm={2}>
                    <TextField
                      size="small"
                      label="Subtotal"
                      type="number"
                      value={detail.subtotal.toFixed(2)}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12} sm={1}>
                    <IconButton onClick={() => handleRemoveDetail(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>

            {/* Total de la Venta */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="h5" align="right" sx={{ fontWeight: 'bold' }}>
                Total: ${formData.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaleModal;