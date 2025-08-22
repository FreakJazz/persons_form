import React, { useState } from 'react';
import { PersonFormData } from '../../../domain/entities/Person';
import { generateUniqueId } from '../../../shared/utils/generalUtils';
import './MultiplePersonForm.css';
import PersonForm from './PersonForm';

interface MultiplePersonFormProps {
  onSubmit: (personsData: PersonFormData[]) => Promise<void>;
  isLoading?: boolean;
}

interface FormInstance {
  id: string;
  data: PersonFormData | null;
  isValid: boolean;
}

const MultiplePersonForm: React.FC<MultiplePersonFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [forms, setForms] = useState<FormInstance[]>([
    { id: generateUniqueId(), data: null, isValid: false }
  ]);

  const addForm = () => {
    const newForm: FormInstance = {
      id: generateUniqueId(),
      data: null,
      isValid: false
    };
    setForms(prev => [...prev, newForm]);
  };

  const removeForm = (id: string) => {
    if (forms.length === 1) return; // Mantener al menos un formulario
    setForms(prev => prev.filter(form => form.id !== id));
  };

  const updateFormData = (id: string, data: PersonFormData) => {
    setForms(prev => prev.map(form => 
      form.id === id 
        ? { ...form, data, isValid: true }
        : form
    ));
  };

  const handleSubmitAll = async () => {
    const validForms = forms.filter(form => form.isValid && form.data);
    
    if (validForms.length === 0) {
      alert('Debe completar al menos un formulario válido');
      return;
    }

    const personsData = validForms.map(form => form.data!);
    await onSubmit(personsData);
    
    // Resetear formularios después del envío exitoso
    setForms([{ id: generateUniqueId(), data: null, isValid: false }]);
  };

  const canSubmit = forms.some(form => form.isValid);

  return (
    <div className="multiple-person-form">
      <div className="form-header">
        <h2>Registro Múltiple de Personas</h2>
        <p>Agregue tantas personas como necesite usando el botón "+"</p>
      </div>

      <div className="forms-container">
        {forms.map((form, index) => (
          <div key={form.id} className="form-wrapper">
            <div className="form-header-controls">
              <h3>Persona {index + 1}</h3>
              {forms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeForm(form.id)}
                  className="remove-form-button"
                  title="Eliminar formulario"
                >
                  ✕
                </button>
              )}
            </div>
            
            <PersonForm
              onSubmit={(data) => updateFormData(form.id, data)}
              submitButtonText="Guardar Datos"
              isLoading={false}
            />
          </div>
        ))}
      </div>

      <div className="actions-container">
        <button
          type="button"
          onClick={addForm}
          className="add-form-button"
          disabled={isLoading}
        >
          + Agregar Otra Persona
        </button>

        <button
          type="button"
          onClick={handleSubmitAll}
          className="submit-all-button"
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? 'Enviando...' : `Registrar Todas (${forms.filter(f => f.isValid).length})`}
        </button>
      </div>
    </div>
  );
};

export default MultiplePersonForm;
