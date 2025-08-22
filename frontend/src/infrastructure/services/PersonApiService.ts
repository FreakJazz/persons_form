import axios, { AxiosInstance } from 'axios';
import { config } from '../../config/environment';
import { CreatePersonRequest, Person, UpdatePersonRequest } from '../../domain/entities/Person';

export class PersonApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autorización
    this.api.interceptors.request.use(
      (requestConfig) => {
        const token = localStorage.getItem(config.tokenStorageKey);
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
      },
      (error) => {
        return Promise.reject(new Error(error?.message || 'Request error'));
      }
    );

    // Interceptor para manejar respuestas de error
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirigir al login
          localStorage.removeItem(config.tokenStorageKey);
          localStorage.removeItem(config.refreshTokenStorageKey);
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(new Error(error?.response?.data?.detail || error?.message || 'API Error'));
      }
    );
  }

  async getAllPersons(skip: number = 0, limit: number = 100): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/api/v1/persons/?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getPersonById(id: number): Promise<Person> {
    const response = await this.api.get<Person>(`/api/v1/persons/${id}`);
    return response.data;
  }

  async createPerson(personData: CreatePersonRequest): Promise<Person> {
    const formData = new FormData();
    formData.append('first_name', personData.first_name);
    formData.append('last_name', personData.last_name);
    formData.append('birth_date', personData.birth_date);
    formData.append('profession_id', personData.profession_id.toString());
    formData.append('address', personData.address);
    formData.append('phone', personData.phone);
    
    if (personData.photo) {
      formData.append('photo', personData.photo);
    }

    const response = await this.api.post<Person>('/api/v1/persons/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updatePerson(id: number, personData: UpdatePersonRequest): Promise<Person> {
    const formData = new FormData();
    formData.append('first_name', personData.first_name);
    formData.append('last_name', personData.last_name);
    formData.append('birth_date', personData.birth_date);
    formData.append('profession_id', personData.profession_id.toString());
    formData.append('address', personData.address);
    formData.append('phone', personData.phone);
    
    if (personData.photo) {
      formData.append('photo', personData.photo);
    }

    const response = await this.api.put<Person>(`/api/v1/persons/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deletePerson(id: number): Promise<{ message: string }> {
    const response = await this.api.delete(`/api/v1/persons/${id}`);
    return response.data;
  }

  async getDashboardStats(): Promise<any> {
    const response = await this.api.get('/api/v1/persons/stats/dashboard');
    return response.data;
  }

  async searchPersons(query: string): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/api/v1/persons/search/?query=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const personApiService = new PersonApiService();
