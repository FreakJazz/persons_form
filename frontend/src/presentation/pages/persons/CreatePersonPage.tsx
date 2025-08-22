import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonFormData } from '../../../domain/entities/Person';
import { useCreatePerson } from '../../../infrastructure/hooks/usePersons';
import PersonForm from '../../components/forms/PersonForm';

const CreatePersonPage: React.FC = () => {
  const navigate = useNavigate();
  const createPersonMutation = useCreatePerson();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PersonFormData) => {
    try {
      setError(null);
      await createPersonMutation.mutateAsync(data);
      navigate('/persons');
    } catch (error: any) {
      setError(error.message || 'Error al crear la persona');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Crear Nueva Persona
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
          isLoading={createPersonMutation.isPending}
          submitButtonText="Crear Persona"
        />
      </Paper>
    </Container>
  );
};

export default CreatePersonPage;
