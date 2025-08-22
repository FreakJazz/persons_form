import { Person, PersonFormData, PersonStats } from '../entities/Person';

export interface PersonRepository {
  getAll(): Promise<Person[]>;
  getById(id: number): Promise<Person | null>;
  create(personData: PersonFormData): Promise<Person>;
  createMultiple(personsData: PersonFormData[]): Promise<Person[]>;
  update(id: number, personData: PersonFormData): Promise<Person>;
  delete(id: number): Promise<boolean>;
  getStats(): Promise<PersonStats>;
}
