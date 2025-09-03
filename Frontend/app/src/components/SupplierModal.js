import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box 
} from '@mui/material';

function SupplierModal({ open, onClose, onSave, supplier }) {
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    contacto_nombre: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        nombre_empresa: supplier.nombre_empresa || '',
        contacto_nombre: supplier.contacto_nombre || '',
        telefono: supplier.telefono || '',
        email: supplier.email || '',
        direccion: supplier.direccion || '',
      });
    } else {
      setFormData({
        nombre_empresa: '',
        contacto_nombre: '',
        telefono: '',
        email: '',
        direccion: '',
      });
    }
  }, [supplier, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave({ ...supplier, ...formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{supplier ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre_empresa"
            name="nombre_empresa"
            label="Nombre de la Empresa"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre_empresa}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="contacto_nombre"
            name="contacto_nombre"
            label="Nombre del Contacto"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.contacto_nombre}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="telefono"
            name="telefono"
            label="Teléfono"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.telefono}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="direccion"
            name="direccion"
            label="Dirección"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.direccion}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SupplierModal;