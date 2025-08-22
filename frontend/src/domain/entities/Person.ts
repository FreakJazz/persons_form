export enum ProfessionEnum {
  INGENIERO = "Ingeniero",
  MEDICO = "Médico",
  ABOGADO = "Abogado",
  PROFESOR = "Profesor",
  CONTADOR = "Contador",
  ARQUITECTO = "Arquitecto",
  ENFERMERO = "Enfermero",
  PSICOLOGO = "Psicólogo",
  VETERINARIO = "Veterinario",
  OTRO = "Otro"
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string; 
  age: number;
  profession_id: number;
  profession_name?: string;
  address: string;
  phone: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePersonRequest {
  first_name: string;
  last_name: string;
  birth_date: string; 
  profession_id: number;
  address: string;
  phone: string;
  photo?: File;
}

export interface UpdatePersonRequest {
  first_name: string;
  last_name: string;
  birth_date: string;
  profession_id: number;
  address: string;
  phone: string;
  photo?: File;
}

export interface PersonFormData {
  first_name: string;
  last_name: string;
  birth_date: string;
  profession_id: number;
  address: string;
  phone: string;
  photo?: File;
}

export interface PersonStats {
  total_persons: number;
  professions_count: Record<string, number>;
  age_ranges: Record<string, number>;
  monthly_registrations: Record<string, number>;
}
