export interface Profession {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface ProfessionCreate {
  name: string;
}

export interface ProfessionUpdate {
  name?: string;
}

export interface ProfessionListResponse {
  professions: Profession[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}
