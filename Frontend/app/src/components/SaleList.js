import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableBody, 
  TableRow, TableCell, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaleModal from './SaleModal'; // Se creará en el siguiente paso
import ConfirmationDialog from './ConfirmationDialog';

function SaleList() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const fetchVentas = () => {
    apiClient.get('/ventas/')
      .then(response => {
        setVentas(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError('Error al cargar las ventas.');
      });
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleAdd = () => {
    setSelectedSale(null);
    setModalOpen(true);
  };

  const handleEdit = (venta) => {
    setSelectedSale(venta);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSale(null);
  };

  const handleSave = (saleData) => {
    const isEditing = !!saleData.id;
    const request = isEditing 
      ? apiClient.put(`/ventas/${saleData.id}/`, saleData)
      : apiClient.post('/ventas/', saleData);

    request
      .then(() => {
        handleCloseModal();
        fetchVentas();
      })
      .catch(error => {
        console.error('Error saving data: ', error);
        setError('Error al guardar la venta.');
      });
  };

  const handleDelete = (id) => {
    setSaleToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSaleToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (saleToDelete) {
      apiClient.delete(`/ventas/${saleToDelete}/`)
        .then(() => {
          handleCloseDialog();
          fetchVentas();
        })
        .catch(error => {
          console.error('Error deleting data: ', error);
          setError('Error al eliminar la venta.');
        });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Ventas</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Registrar
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Vendedor</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
                  <TableCell>{venta.total}</TableCell>
                  <TableCell>{venta.cliente_nombre || venta.cliente}</TableCell>
                  <TableCell>{venta.vendedor_username || venta.vendedor}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(venta)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(venta.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay ventas para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SaleModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
        sale={selectedSale}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer."
      />
    </Paper>
  );
}

export default SaleList;