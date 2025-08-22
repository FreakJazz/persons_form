import closeIcon from '@iconify/icons-material-symbols/close';
import saveIcon from '@iconify/icons-material-symbols/save';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Profession } from '../../../domain/entities/Profession';
import { professionCreateSchema, professionUpdateSchema } from '../../../shared/schemas/professionSchemas';
import './ProfessionForm.css';

interface ProfessionFormProps {
  open: boolean;
  profession?: Profession | null;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  loading?: boolean;
}

export const ProfessionForm: React.FC<ProfessionFormProps> = ({
  open,
  profession,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEditing = !!profession;
  const schema = isEditing ? professionUpdateSchema : professionCreateSchema;

  const initialValues = {
    name: profession?.name || '',
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      // Validar con Zod
      const validatedData = schema.parse(values);
      await onSubmit({ name: validatedData.name || values.name });
      onClose();
    } catch (error) {
      console.error('Error de validación:', error);
      // Los errores de validación ya se muestran en el formulario
    }
  };

  const validateField = (name: string, value: string) => {
    try {
      schema.parse({ [name]: value });
      return undefined;
    } catch (error: any) {
      return error.errors?.[0]?.message || 'Error de validación';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      className="profession-form-dialog"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: 'primary.main', 
        color: 'white' 
      }}>
        <Icon icon={saveIcon} width={24} height={24} style={{ marginRight: 8 }} />
        {isEditing ? 'Editar Profesión' : 'Nueva Profesión'}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field name="name">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label="Nombre de la Profesión"
                      fullWidth
                      required
                      placeholder="Ej: INGENIERO"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                      disabled={loading}
                      autoFocus
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: 'text.secondary',
                        },
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                      validate={(value: string) => validateField('name', value)}
                    />
                  )}
                </Field>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={onClose}
                disabled={loading}
                startIcon={<Icon icon={closeIcon} width={20} height={20} />}
                sx={{ mr: 1 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Icon icon={saveIcon} width={20} height={20} />
                  )
                }
              >
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
