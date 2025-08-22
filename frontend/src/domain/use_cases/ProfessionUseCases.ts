import { Profession, ProfessionCreate, ProfessionListResponse, ProfessionUpdate } from '../entities/Profession';
import { ProfessionRepository } from '../repositories/ProfessionRepository';

export class GetProfessionsUseCase {
  constructor(private repository: ProfessionRepository) {}

  async execute(page: number = 1, size: number = 50): Promise<ProfessionListResponse> {
    return await this.repository.getAll(page, size);
  }
}

export class CreateProfessionUseCase {
  constructor(private repository: ProfessionRepository) {}

  async execute(profession: ProfessionCreate): Promise<Profession> {
    return await this.repository.create(profession);
  }
}

export class UpdateProfessionUseCase {
  constructor(private repository: ProfessionRepository) {}

  async execute(id: number, profession: ProfessionUpdate): Promise<Profession> {
    return await this.repository.update(id, profession);
  }
}

export class DeleteProfessionUseCase {
  constructor(private repository: ProfessionRepository) {}

  async execute(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}

export class SearchProfessionsUseCase {
  constructor(private repository: ProfessionRepository) {}

  async execute(query: string): Promise<Profession[]> {
    return await this.repository.search(query);
  }
}
