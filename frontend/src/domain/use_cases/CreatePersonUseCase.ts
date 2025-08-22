import { Person, PersonFormData } from '../entities/Person';
import { PersonRepository } from '../repositories/PersonRepository';

export class CreatePersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(personData: PersonFormData): Promise<Person> {
    this.validatePersonData(personData);
    return await this.personRepository.create(personData);
  }

  private validatePersonData(data: PersonFormData): void {
    if (!data.first_name || data.first_name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.last_name || data.last_name.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }
    
    if (!data.birth_date) {
      throw new Error('La fecha de nacimiento es obligatoria');
    }
    
    const birthDate = new Date(data.birth_date);
    const today = new Date();
    if (birthDate > today) {
      throw new Error('La fecha de nacimiento no puede ser futura');
    }
    
    if (!data.profession_id) {
      throw new Error('La profesión es obligatoria');
    }
    
    if (!data.address || data.address.trim().length < 5) {
      throw new Error('La dirección debe tener al menos 5 caracteres');
    }
    
    if (!data.phone || data.phone.length < 10) {
      throw new Error('El teléfono debe tener al menos 10 dígitos');
    }
    
    // Validar que el teléfono solo contenga números
    if (!/^\d+$/.test(data.phone)) {
      throw new Error('El teléfono debe contener solo números');
    }
  }
}
