import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableBody, 
  TableRow, TableCell, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductModal from './ProductModal'; // Se creará en el siguiente paso
import ConfirmationDialog from './ConfirmationDialog';

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProductos = () => {
    apiClient.get('/productos/')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError('Error al cargar los productos.');
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = (productoData) => {
    const isEditing = !!productoData.id;
    const request = isEditing 
      ? apiClient.put(`/productos/${productoData.id}/`, productoData)
      : apiClient.post('/productos/', productoData);

    request
      .then(() => {
        handleCloseModal();
        fetchProductos();
      })
      .catch(error => {
        console.error('Error saving data: ', error);
        setError('Error al guardar el producto.');
      });
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      apiClient.delete(`/productos/${productToDelete}/`)
        .then(() => {
          handleCloseDialog();
          fetchProductos();
        })
        .catch(error => {
          console.error('Error deleting data: ', error);
          setError('Error al eliminar el producto.');
        });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Productos</Typography>
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
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Código de Barras</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>{producto.precio}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.codigo_barra}</TableCell>
                  <TableCell>{producto.categoria_nombre || producto.categoria}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(producto)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(producto.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay productos para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
        product={selectedProduct}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </Paper>
  );
}

export default ProductList;