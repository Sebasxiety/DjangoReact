import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import apiClient from '../api';

function ProductModal({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    codigo_barra: '',
    categoria: '',
    proveedor: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    if (open) {
      apiClient.get('/categorias/')
        .then(response => {
          setCategorias(response.data);
        })
        .catch(error => {
          console.error('Error fetching categories: ', error);
        });
      
      apiClient.get('/proveedores/')
        .then(response => {
          setProveedores(response.data);
        })
        .catch(error => {
          console.error('Error fetching suppliers: ', error);
        });
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        stock: product.stock || '',
        codigo_barra: product.codigo_barra || '',
        categoria: product.categoria || '',
        proveedor: product.proveedor || '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        codigo_barra: '',
        categoria: '',
        proveedor: '',
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Ensure numeric fields are converted to numbers
    const dataToSave = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
    };
    onSave({ ...product, ...dataToSave });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Editar Producto' : 'Registrar Nuevo Producto'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre del Producto"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="descripcion"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            required
            id="precio"
            name="precio"
            label="Precio"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.precio}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            required
            id="stock"
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stock}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            required
            id="codigo_barra"
            name="codigo_barra"
            label="Código de Barras"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.codigo_barra}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="categoria-label">Categoría</InputLabel>
            <Select
              labelId="categoria-label"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              label="Categoría"
              onChange={handleChange}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="proveedor-label">Proveedor</InputLabel>
            <Select
              labelId="proveedor-label"
              id="proveedor"
              name="proveedor"
              value={formData.proveedor}
              label="Proveedor"
              onChange={handleChange}
            >
              {proveedores.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductModal;