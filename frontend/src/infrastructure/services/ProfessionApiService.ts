import { Profession, ProfessionCreate, ProfessionListResponse, ProfessionUpdate } from '../../domain/entities/Profession';
import { apiClient } from '../api/apiClient';

export class ProfessionApiService {
  private baseUrl = '/api/v1/professions';

  async getAll(page: number = 1, size: number = 50): Promise<ProfessionListResponse> {
    const response = await apiClient.get(`${this.baseUrl}/`, {
      params: { page, size }
    });
    return response.data;
  }

  async getById(id: number): Promise<Profession> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(profession: ProfessionCreate): Promise<Profession> {
    const response = await apiClient.post(`${this.baseUrl}/`, profession);
    return response.data;
  }

  async update(id: number, profession: ProfessionUpdate): Promise<Profession> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, profession);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async search(query: string): Promise<Profession[]> {
    const response = await apiClient.get(`${this.baseUrl}/search`, {
      params: { query }
    });
    return response.data;
  }

  async getAllForSelector(): Promise<Profession[]> {
    const response = await apiClient.get(`${this.baseUrl}/all`);
    return response.data;
  }
}

export const professionApiService = new ProfessionApiService();
