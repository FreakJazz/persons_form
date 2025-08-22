import { z } from 'zod';

export const professionCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la profesión es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim().toUpperCase()),
});

export const professionUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la profesión es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim().toUpperCase())
    .optional(),
});

export type ProfessionCreateFormData = z.infer<typeof professionCreateSchema>;
export type ProfessionUpdateFormData = z.infer<typeof professionUpdateSchema>;
