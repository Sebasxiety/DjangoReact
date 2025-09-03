import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { 
  Typography, Paper, Table, TableContainer, TableHead, TableBody, 
  TableRow, TableCell, Button, Box, IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientModal from './ClientModal'; // Se creará en el siguiente paso
import ConfirmationDialog from './ConfirmationDialog';

function ClientList() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const fetchClientes = () => {
    apiClient.get('/clientes/')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setError('Error al cargar los clientes.');
      });
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleAdd = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedClient(cliente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
  };

  const handleSave = (clientData) => {
    const isEditing = !!clientData.id;
    const request = isEditing 
      ? apiClient.put(`/clientes/${clientData.id}/`, clientData)
      : apiClient.post('/clientes/', clientData);

    request
      .then(() => {
        handleCloseModal();
        fetchClientes();
      })
      .catch(error => {
        console.error('Error saving data: ', error);
        setError('Error al guardar el cliente.');
      });
  };

  const handleDelete = (id) => {
    setClientToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      apiClient.delete(`/clientes/${clientToDelete}/`)
        .then(() => {
          handleCloseDialog();
          fetchClientes();
        })
        .catch(error => {
          console.error('Error deleting data: ', error);
          setError('Error al eliminar el cliente.');
        });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lista de Clientes</Typography>
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
              <TableCell>Apellido</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.apellido}</TableCell>
                  <TableCell>{cliente.cedula}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(cliente)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(cliente.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay clientes para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ClientModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave}
        client={selectedClient}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
      />
    </Paper>
  );
}

export default ClientList;