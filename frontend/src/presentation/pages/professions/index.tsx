import addIcon from '@iconify/icons-material-symbols/add';
import deleteIcon from '@iconify/icons-material-symbols/delete';
import editIcon from '@iconify/icons-material-symbols/edit';
import searchIcon from '@iconify/icons-material-symbols/search';
import workIcon from '@iconify/icons-material-symbols/work';
import { Icon } from '@iconify/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Profession } from '../../../domain/entities/Profession';
import {
    useCreateProfession,
    useDeleteProfession,
    useProfessions,
    useSearchProfessions,
    useUpdateProfession
} from '../../../infrastructure/hooks/useProfessions';
import { formatDate } from '../../../shared/utils/dateUtils';
import { ProfessionForm } from '../../components/forms/ProfessionForm';
import './ProfessionsPage.css';

const ProfessionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [professionToDelete, setProfessionToDelete] = useState<Profession | null>(null);

  // Hooks de React Query
  const { data: professionsData, isLoading, error } = useProfessions(page, 50);
  const { data: searchResults, isLoading: isSearching } = useSearchProfessions(searchQuery);
  const createMutation = useCreateProfession();
  const updateMutation = useUpdateProfession();
  const deleteMutation = useDeleteProfession();

  // Determinar qué datos mostrar
  const isSearchMode = searchQuery.trim().length > 0;
  const professions = isSearchMode ? (searchResults || []) : (professionsData?.professions || []);
  const pagination = professionsData || { page: 1, size: 50, total: 0, total_pages: 0 };

  const handleCreateClick = () => {
    setSelectedProfession(null);
    setFormOpen(true);
  };

  const handleEditClick = (profession: Profession) => {
    setSelectedProfession(profession);
    setFormOpen(true);
  };

  const handleDeleteClick = (profession: Profession) => {
    setProfessionToDelete(profession);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: { name: string }) => {
    try {
      if (selectedProfession) {
        await updateMutation.mutateAsync({ id: selectedProfession.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Error al guardar profesión:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (professionToDelete) {
      try {
        await deleteMutation.mutateAsync(professionToDelete.id);
        setDeleteDialogOpen(false);
        setProfessionToDelete(null);
      } catch (error) {
        console.error('Error al eliminar profesión:', error);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Box className="professions-page">
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon={workIcon} width={32} height={32} style={{ marginRight: 12, color: '#1976d2' }} />
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Gestión de Profesiones
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={addIcon} width={20} height={20} />}
            onClick={handleCreateClick}
            disabled={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              borderRadius: 2,
              px: 3,
            }}
          >
            Nueva Profesión
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Buscar profesiones..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon={searchIcon} width={20} height={20} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} size="small">
                  <Icon icon={deleteIcon} width={20} height={20} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {isSearching && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Buscando profesiones...
            </Typography>
          </Box>
        )}

        {searchQuery && !isSearching && (
          <Chip
            label={`Resultados para: "${searchQuery}" (${professions.length})`}
            onDelete={handleClearSearch}
            sx={{ mb: 2 }}
            color="primary"
            variant="outlined"
          />
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Error al cargar profesiones'}
        </Alert>
      )}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha de Creación</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && !isSearching ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Cargando profesiones...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : professions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery ? 'No se encontraron profesiones' : 'No hay profesiones registradas'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                professions.map((profession) => (
                  <TableRow key={profession.id} hover>
                    <TableCell>{profession.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={profession.name}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(profession.created_at)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => handleEditClick(profession)}
                          color="primary"
                          size="small"
                          disabled={isLoading || updateMutation.isPending}
                        >
                          <Icon icon={editIcon} width={20} height={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(profession)}
                          color="error"
                          size="small"
                          disabled={isLoading || deleteMutation.isPending}
                        >
                          <Icon icon={deleteIcon} width={20} height={20} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!searchQuery && !isLoading && professions.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {professions.length} de {pagination.total} profesiones
              {pagination.total_pages > 1 && ` (Página ${pagination.page} de ${pagination.total_pages})`}
            </Typography>
          </Box>
        )}
      </Paper>

      <ProfessionForm
        open={formOpen}
        profession={selectedProfession}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la profesión "{professionToDelete?.name}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfessionsPage;
