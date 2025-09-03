import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableBody, 
  TableRow, TableCell, Button, Box, IconButton, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryModal from './CategoryModal';
import ConfirmationDialog from './ConfirmationDialog';

function CategoryList() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategorias = () => {
    apiClient.get('/categorias/')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError('Error al cargar las categorías.');
      });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategory(categoria);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = (categoriaData) => {
    const isEditing = !!categoriaData.id;
    const request = isEditing 
      ? apiClient.put(`/categorias/${categoriaData.id}/`, categoriaData)
      : apiClient.post('/categorias/', categoriaData);

    request
      .then(() => {
        handleCloseModal();
        fetchCategorias();
      })
      .catch(error => {
        console.error('Error saving data: ', error);
        setError('Error al guardar la categoría.');
      });
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      apiClient.delete(`/categorias/${categoryToDelete}/`)
        .then(() => {
          handleCloseDialog();
          fetchCategorias();
        })
        .catch(error => {
          console.error('Error deleting data: ', error);
          setError('Error al eliminar la categoría.');
        });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Categorías</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Registrar
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell>{categoria.ubicacion_pasillo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={categoria.activa ? 'Activa' : 'Inactiva'} 
                      color={categoria.activa ? 'success' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(categoria)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(categoria.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay categorías para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
        category={selectedCategory}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </Paper>
  );
}

export default CategoryList;