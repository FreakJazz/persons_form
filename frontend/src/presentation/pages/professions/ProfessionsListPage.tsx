import {
    Add as AddIcon,
    Clear as ClearIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Fab,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profession } from "../../../domain/entities/Profession";
import {
    useDeleteProfession,
    useProfessions,
} from "../../../infrastructure/hooks/useProfessions";
import CustomTablePagination from "../../components/common/CustomTablePagination";

const ProfessionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, error, refetch } = useProfessions();
  const deleteProfession = useDeleteProfession();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleEdit = (id: number) => {
    navigate(`/professions/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta profesión?")) {
      try {
        await deleteProfession.mutateAsync(id);
        // Force refetch after deletion
        refetch();
      } catch (error) {
        console.error("Error al eliminar profesión:", error);
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSort = (field: 'name' | 'created_at' | 'updated_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(0);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(0);
  };

  const professions = response?.professions || [];
  
  // Filter professions based on search term
  const filteredProfessions = professions.filter((profession) =>
    profession.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort professions
  const sortedProfessions = [...filteredProfessions].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;
    
    if (sortBy === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (sortBy === 'created_at') {
      aValue = new Date(a.created_at || '');
      bValue = new Date(b.created_at || '');
    } else {
      aValue = new Date(a.updated_at || '');
      bValue = new Date(b.updated_at || '');
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const paginatedProfessions = sortedProfessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Error al cargar las profesiones: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Profesiones
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refrescar
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/professions/create")}
          >
            Crear
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar profesiones..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="limpiar búsqueda"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'name'}
                    direction={sortBy === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'created_at'}
                    direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Fecha de Creación
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'updated_at'}
                    direction={sortBy === 'updated_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('updated_at')}
                  >
                    Última Actualización
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProfessions?.map((profession: Profession) => (
                <TableRow key={profession.id} hover>
                  <TableCell>{profession.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={profession.name}
                      variant="filled"
                      color="primary"
                      size="medium"
                    />
                  </TableCell>
                  <TableCell>
                    {profession.created_at
                      ? new Date(profession.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {profession.updated_at
                      ? new Date(profession.updated_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(profession.id)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(profession.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CustomTablePagination
          count={sortedProfessions.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />

        {filteredProfessions.length === 0 && professions.length > 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron profesiones que coincidan con la búsqueda "{searchTerm}"
            </Typography>
          </Box>
        )}

        {professions.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No hay profesiones registradas
            </Typography>
          </Box>
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/professions/create")}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ProfessionsListPage;
