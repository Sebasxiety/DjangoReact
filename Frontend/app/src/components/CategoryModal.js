import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, FormControlLabel, Switch 
} from '@mui/material';

function CategoryModal({ open, onClose, onSave, category }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion_pasillo: '',
    activa: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        nombre: category.nombre || '',
        descripcion: category.descripcion || '',
        ubicacion_pasillo: category.ubicacion_pasillo || '',
        activa: category.activa !== undefined ? category.activa : true,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion_pasillo: '',
        activa: true,
      });
    }
  }, [category, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    onSave({ ...category, ...formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Editar Categoría' : 'Registrar Nueva Categoría'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre de la Categoría"
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
            id="ubicacion_pasillo"
            name="ubicacion_pasillo"
            label="Ubicación en Pasillo"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.ubicacion_pasillo}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Switch checked={formData.activa} onChange={handleChange} name="activa" />}
            label="Activa"
            sx={{ mt: 1 }}
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

export default CategoryModal;