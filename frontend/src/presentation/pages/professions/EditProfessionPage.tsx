import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ProfessionUpdate } from '../../../domain/entities/Profession';
import { useProfessions, useUpdateProfession } from '../../../infrastructure/hooks/useProfessions';

// Esquema de validación con Zod
const professionSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[A-Z\s]+$/, 'El nombre debe estar en mayúsculas y solo contener letras y espacios'),
});

const EditProfessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = useProfessions();
  const updateProfession = useUpdateProfession();

  const profession = response?.professions.find(p => p.id === Number(id));

  const formik = useFormik<ProfessionUpdate>({
    initialValues: {
      name: '',
    },
    validate: (values) => {
      try {
        if (values.name) {
          professionSchema.parse(values);
        }
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
        if (id && values.name) {
          // Convertir a mayúsculas antes de enviar
          const professionData = {
            name: values.name.toUpperCase(),
          };
          await updateProfession.mutateAsync({ 
            id: Number(id), 
            data: professionData 
          });
          navigate('/professions');
        }
      } catch (error: any) {
        setStatus(error.response?.data?.detail || 'Error al actualizar la profesión');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (profession) {
      formik.setValues({
        name: profession.name,
      });
    }
  }, [profession]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profession) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Profesión no encontrada
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Editar Profesión
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
                  {formik.isSubmitting ? 'Actualizando...' : 'Actualizar Profesión'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfessionPage;
