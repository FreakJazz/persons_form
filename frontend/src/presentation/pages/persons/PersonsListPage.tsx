import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Refresh as RefreshIcon
} from "@mui/icons-material";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Fab,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Person } from "../../../domain/entities/Person";
import { usePersons } from "../../../infrastructure/hooks/usePersons";
import CustomTablePagination from "../../components/common/CustomTablePagination";

const PersonsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: persons, isLoading, error, deletePerson, refetch } = usePersons();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'first_name' | 'last_name' | 'birth_date' | 'profession_name'>('first_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleEdit = (id: number) => {
    navigate(`/persons/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta persona?")) {
      try {
        await deletePerson.mutateAsync(id);
        // Force refetch after deletion
        refetch();
      } catch (error) {
        console.error("Error al eliminar persona:", error);
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSort = (field: 'first_name' | 'last_name' | 'birth_date' | 'profession_name') => {
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

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter persons based on search term
  const filteredPersons = persons?.filter((person) => {
    const fullName = `${person.first_name} ${person.last_name}`.toLowerCase();
    const profession = (person.profession_name || "").toLowerCase();
    const phone = person.phone.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      profession.includes(searchLower) ||
      phone.includes(searchLower)
    );
  }) || [];

  // Sort persons
  const sortedPersons = [...filteredPersons].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;
    
    if (sortBy === 'first_name') {
      aValue = a.first_name.toLowerCase();
      bValue = b.first_name.toLowerCase();
    } else if (sortBy === 'last_name') {
      aValue = a.last_name.toLowerCase();
      bValue = b.last_name.toLowerCase();
    } else if (sortBy === 'birth_date') {
      aValue = new Date(a.birth_date);
      bValue = new Date(b.birth_date);
    } else {
      aValue = (a.profession_name || "").toLowerCase();
      bValue = (b.profession_name || "").toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const paginatedPersons = sortedPersons.slice(
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
          Error al cargar las personas: {error.message}
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
          Lista de Personas
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
            startIcon={<GroupIcon />}
            onClick={() => navigate("/persons/register")}
          >
            Registro Múltiple
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/persons/create")}
          >
            Crear
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'first_name'}
                    direction={sortBy === 'first_name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('first_name')}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'last_name'}
                    direction={sortBy === 'last_name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('last_name')}
                  >
                    Apellido
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'birth_date'}
                    direction={sortBy === 'birth_date' ? sortOrder : 'asc'}
                    onClick={() => handleSort('birth_date')}
                  >
                    Fecha de Nacimiento
                  </TableSortLabel>
                </TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'profession_name'}
                    direction={sortBy === 'profession_name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('profession_name')}
                  >
                    Profesión
                  </TableSortLabel>
                </TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPersons?.map((person: Person) => (
                <TableRow key={person.id} hover>
                  <TableCell>
                    <Avatar
                      src={
                        person.photo_url
                          ? `http://localhost:8000${person.photo_url}`
                          : undefined
                      }
                      sx={{ width: 40, height: 40 }}
                    >
                      {!person.photo_url && <PersonIcon />}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {person.first_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {person.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(person.birth_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${calculateAge(person.birth_date)} años`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {person.profession_name || "Sin profesión"}
                  </TableCell>
                  <TableCell>{person.phone}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(person.id)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(person.id)}
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
          count={sortedPersons?.length || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />

        {persons?.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No hay personas registradas
            </Typography>
          </Box>
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/persons/create")}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default PersonsListPage;
