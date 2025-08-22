from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.repositories.person_repository import PersonRepository
from app.schemas.person_request_response import PersonCreateRequest, PersonUpdateRequest, PersonResponse
from app.services.file_service import FileService


class PersonUseCase:
    def __init__(self):
        self.person_repository = PersonRepository()
        self.file_service = FileService()

    async def create_person(self, db: Session, person_data: PersonCreateRequest, photo: Optional[UploadFile] = None) -> PersonResponse:
        """
        Caso de uso para crear una nueva persona
        """
        photo_url = None
        
        # Si hay foto, guardarla primero
        if photo:
            photo_url = await self.file_service.save_photo(photo)
        
        # Crear la persona
        db_person = self.person_repository.create(db, person_data, photo_url)
        
        # Preparar respuesta
        response_data = {
            "id": db_person.id,
            "first_name": db_person.first_name,
            "last_name": db_person.last_name,
            "birth_date": db_person.birth_date.isoformat(),
            "age": db_person.age,
            "profession_id": db_person.profession_id,
            "profession_name": db_person.profession.name,
            "address": db_person.address,
            "phone": db_person.phone,
            "photo_url": db_person.photo_url,
            "created_at": db_person.created_at,
            "updated_at": db_person.updated_at
        }
        
        return PersonResponse(**response_data)

    def get_person(self, db: Session, person_id: int) -> Optional[PersonResponse]:
        """
        Caso de uso para obtener una persona por ID
        """
        db_person = self.person_repository.get_by_id(db, person_id)
        if db_person:
            response_data = {
                "id": db_person.id,
                "first_name": db_person.first_name,
                "last_name": db_person.last_name,
                "birth_date": db_person.birth_date.isoformat(),
                "age": db_person.age,
                "profession_id": db_person.profession_id,
                "profession_name": db_person.profession.name,
                "address": db_person.address,
                "phone": db_person.phone,
                "photo_url": db_person.photo_url,
                "created_at": db_person.created_at,
                "updated_at": db_person.updated_at
            }
            return PersonResponse(**response_data)
        return None

    def get_all_persons(self, db: Session, skip: int = 0, limit: int = 100) -> List[PersonResponse]:
        """
        Caso de uso para obtener todas las personas
        """
        db_persons = self.person_repository.get_all(db, skip, limit)
        responses = []
        
        for person in db_persons:
            response_data = {
                "id": person.id,
                "first_name": person.first_name,
                "last_name": person.last_name,
                "birth_date": person.birth_date.isoformat(),
                "age": person.age,
                "profession_id": person.profession_id,
                "profession_name": person.profession.name,
                "address": person.address,
                "phone": person.phone,
                "photo_url": person.photo_url,
                "created_at": person.created_at,
                "updated_at": person.updated_at
            }
            responses.append(PersonResponse(**response_data))
        
        return responses

    async def update_person(self, db: Session, person_id: int, person_data: PersonUpdateRequest, photo: Optional[UploadFile] = None) -> Optional[PersonResponse]:
        """
        Caso de uso para actualizar una persona
        """
        # Obtener persona actual
        db_person = self.person_repository.get_by_id(db, person_id)
        if not db_person:
            return None

        photo_url = None
        if photo:
            # Eliminar foto anterior si existe
            if db_person.photo_url:
                self.file_service.delete_photo(db_person.photo_url)
            
            # Guardar nueva foto
            photo_url = await self.file_service.save_photo(photo)

        # Actualizar datos
        updated_person = self.person_repository.update(db, person_id, person_data, photo_url)
        if not updated_person:
            return None

        # Preparar respuesta
        response_data = {
            "id": updated_person.id,
            "first_name": updated_person.first_name,
            "last_name": updated_person.last_name,
            "birth_date": updated_person.birth_date.isoformat(),
            "age": updated_person.age,
            "profession_id": updated_person.profession_id,
            "profession_name": updated_person.profession.name,
            "address": updated_person.address,
            "phone": updated_person.phone,
            "photo_url": updated_person.photo_url,
            "created_at": updated_person.created_at,
            "updated_at": updated_person.updated_at
        }

        return PersonResponse(**response_data)

    def delete_person(self, db: Session, person_id: int) -> bool:
        """
        Caso de uso para eliminar una persona
        """
        # Obtener persona para eliminar su foto
        db_person = self.person_repository.get_by_id(db, person_id)
        if db_person and db_person.photo_url:
            self.file_service.delete_photo(db_person.photo_url)
        
        return self.person_repository.delete(db, person_id)
