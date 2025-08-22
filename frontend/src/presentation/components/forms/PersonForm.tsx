import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PersonFormData } from '../../../domain/entities/Person';
import { useAllProfessions } from '../../../infrastructure/hooks/useProfessions';
import { calculateAge } from '../../../shared/utils/dateUtils';
import { createImagePreview, validateFile } from '../../../shared/utils/fileUtils';
import './PersonForm.css';

interface PersonFormProps {
  onSubmit: (data: PersonFormData) => Promise<void> | void;
  isLoading?: boolean;
  initialData?: Partial<PersonFormData>;
  submitButtonText?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  submitButtonText = 'Registrar Persona'
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  
  const { data: professions = [], isLoading: isLoadingProfessions } = useAllProfessions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<PersonFormData>({
    defaultValues: initialData
  });

  const birthDate = watch('birth_date');

  // Calcular edad cuando cambie la fecha de nacimiento
  React.useEffect(() => {
    if (birthDate) {
      const age = calculateAge(birthDate);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [birthDate]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoError(null);
    setPhotoPreview(null);

    if (!file) {
      setValue('photo', undefined);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setPhotoError(validationError);
      event.target.value = '';
      setValue('photo', undefined);
      return;
    }

    try {
      const preview = await createImagePreview(file);
      setPhotoPreview(preview);
      setValue('photo', file);
    } catch (error) {
      setPhotoError('Error al crear vista previa de la imagen');
      event.target.value = '';
      setValue('photo', undefined);
    }
  };

  const handleFormSubmit = async (data: PersonFormData) => {
    try {
      await Promise.resolve(onSubmit(data));
      reset();
      setPhotoPreview(null);
      setCalculatedAge(null);
    } catch (error) {
      // El error se maneja en el componente padre
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="person-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="first_name">Nombres *</label>
          <input
            type="text"
            id="first_name"
            {...register('first_name', {
              required: 'Los nombres son obligatorios',
              minLength: {
                value: 2,
                message: 'Los nombres deben tener al menos 2 caracteres'
              }
            })}
            className={errors.first_name ? 'error' : ''}
          />
          {errors.first_name && (
            <span className="error-message">{errors.first_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Apellidos *</label>
          <input
            type="text"
            id="last_name"
            {...register('last_name', {
              required: 'Los apellidos son obligatorios',
              minLength: {
                value: 2,
                message: 'Los apellidos deben tener al menos 2 caracteres'
              }
            })}
            className={errors.last_name ? 'error' : ''}
          />
          {errors.last_name && (
            <span className="error-message">{errors.last_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="birth_date">Fecha de Nacimiento *</label>
          <input
            type="date"
            id="birth_date"
            {...register('birth_date', {
              required: 'La fecha de nacimiento es obligatoria',
              validate: (value) => {
                const date = new Date(value);
                const today = new Date();
                if (date > today) {
                  return 'La fecha de nacimiento no puede ser futura';
                }
                return true;
              }
            })}
            className={errors.birth_date ? 'error' : ''}
          />
          {errors.birth_date && (
            <span className="error-message">{errors.birth_date.message}</span>
          )}
          {calculatedAge !== null && (
            <span className="age-display">Edad: {calculatedAge} años</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="profession_id">Profesión *</label>
          <select
            id="profession_id"
            {...register('profession_id', {
              required: 'La profesión es obligatoria',
              valueAsNumber: true
            })}
            className={errors.profession_id ? 'error' : ''}
            disabled={isLoadingProfessions}
          >
            <option value="">Seleccione una profesión</option>
            {professions.map((profession) => (
              <option key={profession.id} value={profession.id}>
                {profession.name}
              </option>
            ))}
          </select>
          {errors.profession_id && (
            <span className="error-message">{errors.profession_id.message}</span>
          )}
          {isLoadingProfessions && (
            <span className="loading-message">Cargando profesiones...</span>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="address">Dirección *</label>
          <textarea
            id="address"
            rows={3}
            {...register('address', {
              required: 'La dirección es obligatoria',
              minLength: {
                value: 5,
                message: 'La dirección debe tener al menos 5 caracteres'
              }
            })}
            className={errors.address ? 'error' : ''}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^\d{10,11}$/,
                message: 'El teléfono debe tener entre 10 y 11 dígitos'
              }
            })}
            className={errors.phone ? 'error' : ''}
            placeholder="1234567890"
          />
          {errors.phone && (
            <span className="error-message">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="photo">Foto</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className={photoError ? 'error' : ''}
          />
          {photoError && (
            <span className="error-message">{photoError}</span>
          )}
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Vista previa" />
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Procesando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
