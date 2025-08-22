import { useCallback } from 'react';
import { PersonFormData } from '../../domain/entities/Person';
import { CreateMultiplePersonsUseCase } from '../../domain/use_cases/CreateMultiplePersonsUseCase';
import { CreatePersonUseCase } from '../../domain/use_cases/CreatePersonUseCase';
import { GetPersonsUseCase } from '../../domain/use_cases/GetPersonsUseCase';
import { ApiPersonRepository } from '../../infrastructure/repositories/ApiPersonRepository';
import { useAppContext } from '../context/AppContext';

const personRepository = new ApiPersonRepository();
const createPersonUseCase = new CreatePersonUseCase(personRepository);
const createMultiplePersonsUseCase = new CreateMultiplePersonsUseCase(personRepository);
const getPersonsUseCase = new GetPersonsUseCase(personRepository);

export const usePersons = () => {
  const { state, dispatch, addToast } = useAppContext();

  const loadPersons = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const persons = await getPersonsUseCase.execute();
      dispatch({ type: 'SET_PERSONS', payload: persons });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar personas';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      addToast('error', errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, addToast]);

  const createPerson = useCallback(async (personData: PersonFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newPerson = await createPersonUseCase.execute(personData);
      dispatch({ type: 'ADD_PERSON', payload: newPerson });
      addToast('success', 'Persona creada exitosamente');
      
      return newPerson;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear persona';
      addToast('error', errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, addToast]);

  const createMultiplePersons = useCallback(async (personsData: PersonFormData[]) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await createMultiplePersonsUseCase.execute(personsData);
      
      // Recargar la lista completa después de crear múltiples personas
      await loadPersons();
      addToast('success', `${personsData.length} personas creadas exitosamente`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear personas';
      addToast('error', errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, addToast, loadPersons]);

  const deletePerson = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const success = await personRepository.delete(id);
      if (success) {
        dispatch({ type: 'DELETE_PERSON', payload: id });
        addToast('success', 'Persona eliminada exitosamente');
      } else {
        throw new Error('No se pudo eliminar la persona');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar persona';
      addToast('error', errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, addToast]);

  return {
    persons: state.persons,
    isLoading: state.isLoading,
    error: state.error,
    loadPersons,
    createPerson,
    createMultiplePersons,
    deletePerson,
  };
};
