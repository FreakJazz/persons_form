import { Profession, ProfessionCreate, ProfessionListResponse, ProfessionUpdate } from '../../domain/entities/Profession';
import { ProfessionRepository } from '../../domain/repositories/ProfessionRepository';
import { ProfessionApiService } from '../services/ProfessionApiService';

export class ApiProfessionRepository implements ProfessionRepository {
  private apiService: ProfessionApiService;

  constructor() {
    this.apiService = new ProfessionApiService();
  }

  async getAll(page: number = 1, size: number = 50): Promise<ProfessionListResponse> {
    return await this.apiService.getAll(page, size);
  }

  async getById(id: number): Promise<Profession> {
    return await this.apiService.getById(id);
  }

  async create(profession: ProfessionCreate): Promise<Profession> {
    return await this.apiService.create(profession);
  }

  async update(id: number, profession: ProfessionUpdate): Promise<Profession> {
    return await this.apiService.update(id, profession);
  }

  async delete(id: number): Promise<void> {
    return await this.apiService.delete(id);
  }

  async search(query: string): Promise<Profession[]> {
    return await this.apiService.search(query);
  }
}
