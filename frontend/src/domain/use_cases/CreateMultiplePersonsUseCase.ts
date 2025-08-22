import { PersonFormData } from '../entities/Person';
import { PersonRepository } from '../repositories/PersonRepository';

export class CreateMultiplePersonsUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(personsData: PersonFormData[]): Promise<void> {
    if (!personsData.length) {
      throw new Error('Debe proporcionar al menos una persona');
    }

    // Validar todos los datos antes de crear
    personsData.forEach((personData, index) => {
      this.validatePersonData(personData, index);
    });

    await this.personRepository.createMultiple(personsData);
  }

  private validatePersonData(data: PersonFormData, index: number): void {
    const prefix = `Persona ${index + 1}:`;
    
    if (!data.first_name || data.first_name.trim().length < 2) {
      throw new Error(`${prefix} El nombre debe tener al menos 2 caracteres`);
    }
    
    if (!data.last_name || data.last_name.trim().length < 2) {
      throw new Error(`${prefix} El apellido debe tener al menos 2 caracteres`);
    }
    
    if (!data.birth_date) {
      throw new Error(`${prefix} La fecha de nacimiento es obligatoria`);
    }
    
    const birthDate = new Date(data.birth_date);
    const today = new Date();
    if (birthDate > today) {
      throw new Error(`${prefix} La fecha de nacimiento no puede ser futura`);
    }
    
    if (!data.profession_id) {
      throw new Error(`${prefix} La profesión es obligatoria`);
    }
    
    if (!data.address || data.address.trim().length < 5) {
      throw new Error(`${prefix} La dirección debe tener al menos 5 caracteres`);
    }
    
    if (!data.phone || data.phone.length < 10) {
      throw new Error(`${prefix} El teléfono debe tener al menos 10 dígitos`);
    }
    
    if (!/^\d+$/.test(data.phone)) {
      throw new Error(`${prefix} El teléfono debe contener solo números`);
    }
  }
}
