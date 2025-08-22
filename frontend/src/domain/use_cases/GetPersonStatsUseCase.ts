import { PersonStats } from '../entities/Person';
import { PersonRepository } from '../repositories/PersonRepository';

export class GetPersonStatsUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(): Promise<PersonStats> {
    return await this.personRepository.getStats();
  }
}
