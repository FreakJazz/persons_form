import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { Person } from '../../domain/entities/Person';
import { Toast } from '../../shared/types/common';

interface AppState {
  persons: Person[];
  isLoading: boolean;
  error: string | null;
  toasts: Toast[];
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PERSONS'; payload: Person[] }
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'ADD_MULTIPLE_PERSONS'; payload: Person[] }
  | { type: 'UPDATE_PERSON'; payload: Person }
  | { type: 'DELETE_PERSON'; payload: number }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: AppState = {
  persons: [],
  isLoading: false,
  error: null,
  toasts: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_PERSONS':
      return { ...state, persons: action.payload };
    
    case 'ADD_PERSON':
      return { ...state, persons: [...state.persons, action.payload] };
    
    case 'ADD_MULTIPLE_PERSONS':
      return { ...state, persons: [...state.persons, ...action.payload] };
    
    case 'UPDATE_PERSON':
      return {
        ...state,
        persons: state.persons.map(person => 
          person.id === action.payload.id ? action.payload : person
        ),
      };
    
    case 'DELETE_PERSON':
      return {
        ...state,
        persons: state.persons.filter(person => person.id !== action.payload),
      };
    
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, message, duration: 5000 };
    dispatch({ type: 'ADD_TOAST', payload: toast });

    // Auto-remove toast after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, toast.duration);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
