import { Person } from '../entities/Person';
import { PersonRepository } from '../repositories/PersonRepository';

export class GetPersonsUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(): Promise<Person[]> {
    return await this.personRepository.getAll();
  }
}
