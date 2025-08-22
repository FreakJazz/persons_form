from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.profession_repository import ProfessionRepository
from app.schemas.profession_request_response import (
    ProfessionCreate, 
    ProfessionUpdate, 
    ProfessionResponse,
    ProfessionListResponse
)
from app.models.profession import Profession
from app.core.exceptions import NotFoundException, ConflictException
import math

class ProfessionUseCase:
    def __init__(self, db: Session):
        self.profession_repository = ProfessionRepository(db)
    
    async def get_profession_by_id(self, profession_id: int) -> ProfessionResponse:
        profession = await self.profession_repository.get_by_id(profession_id)
        if not profession:
            raise NotFoundException(f"Profesión con ID {profession_id} no encontrada")
        return ProfessionResponse.model_validate(profession)
    
    async def get_all_professions(self, page: int = 1, size: int = 50) -> ProfessionListResponse:
        skip = (page - 1) * size
        professions = await self.profession_repository.get_all(skip=skip, limit=size)
        total = await self.profession_repository.count()
        total_pages = math.ceil(total / size)
        
        profession_responses = [ProfessionResponse.model_validate(p) for p in professions]
        
        return ProfessionListResponse(
            professions=profession_responses,
            total=total,
            page=page,
            size=size,
            total_pages=total_pages
        )
    
    async def create_profession(self, profession_data: ProfessionCreate) -> ProfessionResponse:
        try:
            profession = await self.profession_repository.create(profession_data)
            return ProfessionResponse.model_validate(profession)
        except ValueError as e:
            raise ConflictException(str(e))
    
    async def update_profession(self, profession_id: int, profession_data: ProfessionUpdate) -> ProfessionResponse:
        try:
            profession = await self.profession_repository.update(profession_id, profession_data)
            if not profession:
                raise NotFoundException(f"Profesión con ID {profession_id} no encontrada")
            return ProfessionResponse.model_validate(profession)
        except ValueError as e:
            raise ConflictException(str(e))
    
    async def delete_profession(self, profession_id: int) -> bool:
        success = await self.profession_repository.delete(profession_id)
        if not success:
            raise NotFoundException(f"Profesión con ID {profession_id} no encontrada")
        return True
    
    async def search_professions(self, query: str) -> List[ProfessionResponse]:
        # Simple búsqueda por ahora, se puede mejorar con búsqueda full-text
        professions = await self.profession_repository.get_all()
        filtered = [p for p in professions if query.upper() in p.name.upper()]
        return [ProfessionResponse.model_validate(p) for p in filtered]
    
    async def get_all_professions_for_selector(self) -> List[ProfessionResponse]:
        """Obtener todas las profesiones sin paginación para selectores."""
        professions = await self.profession_repository.get_all()
        return [ProfessionResponse.model_validate(p) for p in professions]
