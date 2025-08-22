import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import type { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { RegisterRequest } from '../../domain/entities/User';
import { useRegister } from '../../infrastructure/hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Crear Cuenta
          </Typography>
          
          {registerMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {
                (() => {
                  const err = registerMutation.error as unknown as AxiosError<{ detail?: string }> | Error | undefined;
                  if (err && 'isAxiosError' in (err as any) && (err as AxiosError).isAxiosError) {
                    return (err as AxiosError<{ detail?: string }>).response?.data?.detail ?? 'Error al crear la cuenta. Inténtalo de nuevo.';
                  }
                  return err?.message ?? 'Error al crear la cuenta. Inténtalo de nuevo.';
                })()
              }
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              autoComplete="username"
              autoFocus
              {...register('username', {
                required: 'El nombre de usuario es requerido',
                minLength: {
                  value: 3,
                  message: 'El nombre de usuario debe tener al menos 3 caracteres',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Solo se permiten letras, números y guiones bajos',
                },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Nombre Completo"
              autoComplete="name"
              {...register('full_name', {
                required: 'El nombre completo es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
