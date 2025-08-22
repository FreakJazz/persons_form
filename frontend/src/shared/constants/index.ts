export const API_ENDPOINTS = {
  PERSONS: '/persons',
  PERSON_STATS: '/persons/stats/dashboard',
  PERSON_BATCH: '/persons/batch',
} as const;

export const PROFESSION_OPTIONS = [
  { value: 'Ingeniero', label: 'Ingeniero' },
  { value: 'Médico', label: 'Médico' },
  { value: 'Abogado', label: 'Abogado' },
  { value: 'Profesor', label: 'Profesor' },
  { value: 'Contador', label: 'Contador' },
  { value: 'Arquitecto', label: 'Arquitecto' },
  { value: 'Enfermero', label: 'Enfermero' },
  { value: 'Psicólogo', label: 'Psicólogo' },
  { value: 'Veterinario', label: 'Veterinario' },
  { value: 'Otro', label: 'Otro' },
] as const;

export const AGE_RANGES = {
  YOUNG: '0-18',
  ADULT: '19-35',
  MIDDLE_AGE: '36-60',
  SENIOR: '60+',
} as const;

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
  orange: '#f97316',
  gray: '#6b7280',
} as const;

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} satisfies { MAX_SIZE: number; ALLOWED_TYPES: readonly string[] };
