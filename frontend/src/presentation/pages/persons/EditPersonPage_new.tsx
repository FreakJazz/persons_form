import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PersonFormData } from '../../../domain/entities/Person';
import { usePerson, useUpdatePerson } from '../../../infrastructure/hooks/usePersons';
import PersonForm from '../../components/forms/PersonForm';

const EditPersonPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const personId = Number(id);
  
  const { data: person, isLoading: isLoadingPerson } = usePerson(personId);
  const updatePersonMutation = useUpdatePerson();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PersonFormData) => {
    try {
      setError(null);
      await updatePersonMutation.mutateAsync({ id: personId, data });
      navigate('/persons');
    } catch (error: any) {
      setError(error.message || 'Error al actualizar la persona');
    }
  };

  if (isLoadingPerson) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!person) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          No se encontró la persona con ID {id}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/persons')}
          >
            Volver a la Lista
          </Button>
        </Box>
      </Container>
    );
  }

  const initialData: Partial<PersonFormData> = {
    first_name: person.first_name,
    last_name: person.last_name,
    birth_date: person.birth_date,
    profession_id: person.profession_id,
    address: person.address,
    phone: person.phone,
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Editar Persona
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/persons')}
        >
          Volver a la Lista
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <PersonForm
          onSubmit={handleSubmit}
          isLoading={updatePersonMutation.isPending}
          initialData={initialData}
          submitButtonText="Actualizar Persona"
        />
      </Paper>
    </Container>
  );
};

export default EditPersonPage;
