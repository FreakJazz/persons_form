import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonFormData } from '../../domain/entities/Person';
import { useCreatePerson } from '../../infrastructure/hooks/usePersons';
import MultiplePersonForm from '../components/forms/MultiplePersonForm';
import PersonForm from '../components/forms/PersonForm';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const createPersonMutation = useCreatePerson();
  
  const createMultiplePersonsMutation = useMutation({
    mutationFn: async (personsData: PersonFormData[]) => {
      const formData = new FormData();
      
      // Preparar datos JSON (sin fotos)
      const personsDataWithoutPhotos = personsData.map(person => ({
        first_name: person.first_name,
        last_name: person.last_name,
        birth_date: person.birth_date,
        profession_id: person.profession_id,
        address: person.address,
        phone: person.phone,
      }));
      
      formData.append('persons_data', JSON.stringify(personsDataWithoutPhotos));
      
      // Agregar fotos si existen
      personsData.forEach((person, index) => {
        if (person.photo) {
          formData.append(`photos`, person.photo);
        }
      });

      // Usar axios directamente en lugar del servicio
      const response = await fetch('http://localhost:8000/api/v1/persons/batch', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al crear las personas');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      navigate('/persons');
    },
  });

  const handleSingleSubmit = async (personData: PersonFormData) => {
    try {
      setError(null);
      await createPersonMutation.mutateAsync(personData);
      navigate('/persons');
    } catch (error: any) {
      setError(error.message || 'Error al crear la persona');
    }
  };

  const handleMultipleSubmit = async (personsData: PersonFormData[]) => {
    try {
      setError(null);
      await createMultiplePersonsMutation.mutateAsync(personsData);
    } catch (error: any) {
      setError(error.message || 'Error al crear las personas');
    }
  };

  const isLoading = createPersonMutation.isPending || createMultiplePersonsMutation.isPending;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Registro de Personas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/persons')}
        >
          Volver a la Lista
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Complete la información de las personas que desea registrar en el sistema
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant={!isMultipleMode ? 'contained' : 'outlined'}
            onClick={() => setIsMultipleMode(false)}
            disabled={isLoading}
          >
            Registro Individual
          </Button>
          <Button
            variant={isMultipleMode ? 'contained' : 'outlined'}
            onClick={() => setIsMultipleMode(true)}
            disabled={isLoading}
          >
            Registro Múltiple
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {isMultipleMode ? (
          <MultiplePersonForm
            onSubmit={handleMultipleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <PersonForm
            onSubmit={handleSingleSubmit}
            isLoading={isLoading}
            submitButtonText="Registrar Persona"
          />
        )}
      </Paper>
    </Container>
  );
};

export default RegistrationPage;
