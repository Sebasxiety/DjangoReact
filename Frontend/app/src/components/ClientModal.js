import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box 
} from '@mui/material';

function ClientModal({ open, onClose, onSave, client }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        apellido: client.apellido || '',
        cedula: client.cedula || '',
        telefono: client.telefono || '',
        email: client.email || '',
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        cedula: '',
        telefono: '',
        email: '',
      });
    }
  }, [client, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave({ ...client, ...formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{client ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="apellido"
            name="apellido"
            label="Apellido"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.apellido}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="cedula"
            name="cedula"
            label="Cédula"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.cedula}
            onChange={handleChange}
          />
          <TextField
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ClientModal;