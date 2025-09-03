import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableBody, 
  TableRow, TableCell, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SupplierModal from './SupplierModal'; // Se creará en el siguiente paso
import ConfirmationDialog from './ConfirmationDialog';

function SupplierList() {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const fetchProveedores = () => {
    apiClient.get('/proveedores/')
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError('Error al cargar los proveedores.');
      });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleAdd = () => {
    setSelectedSupplier(null);
    setModalOpen(true);
  };

  const handleEdit = (proveedor) => {
    setSelectedSupplier(proveedor);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSave = (supplierData) => {
    const isEditing = !!supplierData.id;
    const request = isEditing 
      ? apiClient.put(`/proveedores/${supplierData.id}/`, supplierData)
      : apiClient.post('/proveedores/', supplierData);

    request
      .then(() => {
        handleCloseModal();
        fetchProveedores();
      })
      .catch(error => {
        console.error('Error saving data: ', error);
        setError('Error al guardar el proveedor.');
      });
  };

  const handleDelete = (id) => {
    setSupplierToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      apiClient.delete(`/proveedores/${supplierToDelete}/`)
        .then(() => {
          handleCloseDialog();
          fetchProveedores();
        })
        .catch(error => {
          console.error('Error deleting data: ', error);
          setError('Error al eliminar el proveedor.');
        });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Proveedores</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Registrar
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de Empresa</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.nombre_empresa}</TableCell>
                  <TableCell>{proveedor.contacto_nombre}</TableCell>
                  <TableCell>{proveedor.telefono}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>{proveedor.direccion}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(proveedor)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(proveedor.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay proveedores para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SupplierModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
        supplier={selectedSupplier}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
      />
    </Paper>
  );
}

export default SupplierList;