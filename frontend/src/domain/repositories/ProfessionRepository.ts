import { Profession, ProfessionCreate, ProfessionListResponse, ProfessionUpdate } from '../entities/Profession';

export interface ProfessionRepository {
  getAll(page?: number, size?: number): Promise<ProfessionListResponse>;
  getById(id: number): Promise<Profession>;
  create(profession: ProfessionCreate): Promise<Profession>;
  update(id: number, profession: ProfessionUpdate): Promise<Profession>;
  delete(id: number): Promise<void>;
  search(query: string): Promise<Profession[]>;
}
