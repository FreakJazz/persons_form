import { Person, PersonFormData, PersonStats } from '../../domain/entities/Person';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import apiClient from '../api/apiClient';

export class ApiPersonRepository implements PersonRepository {
  private readonly baseUrl = '/persons';

  async getAll(): Promise<Person[]> {
    const response = await apiClient.get<Person[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Person | null> {
    try {
      const response = await apiClient.get<Person>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async create(personData: PersonFormData): Promise<Person> {
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('first_name', personData.first_name);
    formData.append('last_name', personData.last_name);
    formData.append('birth_date', personData.birth_date);
    formData.append('profession_id', personData.profession_id.toString());
    formData.append('address', personData.address);
    formData.append('phone', personData.phone);
    
    // Agregar foto si existe
    if (personData.photo) {
      formData.append('photo', personData.photo);
    }

    const response = await apiClient.post<Person>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async createMultiple(personsData: PersonFormData[]): Promise<Person[]> {
    const formData = new FormData();
    
    // Preparar datos JSON (sin fotos)
    const personsDataWithoutPhotos = personsData.map(person => ({
      first_name: person.first_name,
      last_name: person.last_name,
      birth_date: person.birth_date,
      profession_id: person.profession_id,
      address: person.address,
      phone: person.phone,
    }));
    
    formData.append('persons_data', JSON.stringify(personsDataWithoutPhotos));
    
    // Agregar fotos si existen
    personsData.forEach((person, index) => {
      if (person.photo) {
        formData.append(`photos`, person.photo);
      }
    });

    const response = await apiClient.post<Person[]>(`${this.baseUrl}/batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async update(id: number, personData: PersonFormData): Promise<Person> {
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

    const response = await apiClient.put<Person>(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStats(): Promise<PersonStats> {
    const response = await apiClient.get<PersonStats>(`${this.baseUrl}/stats/dashboard`);
    return response.data;
  }
}
