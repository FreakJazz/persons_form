import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ProfessionCreate } from '../../../domain/entities/Profession';
import { useCreateProfession } from '../../../infrastructure/hooks/useProfessions';

// Esquema de validación con Zod
const professionSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[A-Z\s]+$/, 'El nombre debe estar en mayúsculas y solo contener letras y espacios'),
});

const CreateProfessionPage: React.FC = () => {
  const navigate = useNavigate();
  const createProfession = useCreateProfession();

  const formik = useFormik<ProfessionCreate>({
    initialValues: {
      name: '',
    },
    validate: (values) => {
      try {
        professionSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: any = {};
          error.issues.forEach((err: any) => {
            if (err.path[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          return fieldErrors;
        }
        return {};
      }
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        // Convertir a mayúsculas antes de enviar
        const professionData = {
          name: values.name.toUpperCase(),
        };
        await createProfession.mutateAsync(professionData);
        navigate('/professions');
      } catch (error: any) {
        setStatus(error.response?.data?.detail || 'Error al crear la profesión');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Crear Nueva Profesión
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/professions')}
        >
          Volver a la Lista
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        {formik.status && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formik.status}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nombre de la Profesión"
                placeholder="Ej: INGENIERO DE SISTEMAS"
                value={formik.values.name}
                onChange={(e) => {
                  // Convertir automáticamente a mayúsculas mientras se escribe
                  formik.setFieldValue('name', e.target.value.toUpperCase());
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : 'La profesión se guardará en mayúsculas automáticamente'
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/professions')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Creando...' : 'Crear Profesión'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProfessionPage;
