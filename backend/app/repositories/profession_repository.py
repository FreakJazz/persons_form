from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Optional
from app.models.profession import Profession
from app.schemas.profession_request_response import ProfessionCreate, ProfessionUpdate
from app.repositories.profession_repository_interface import ProfessionRepositoryInterface

class ProfessionRepository(ProfessionRepositoryInterface):
    def __init__(self, db: Session):
        self.db = db
    
    async def get_by_id(self, profession_id: int) -> Optional[Profession]:
        return self.db.query(Profession).filter(Profession.id == profession_id).first()
    
    async def get_by_name(self, name: str) -> Optional[Profession]:
        # Buscar por nombre en mayúsculas
        return self.db.query(Profession).filter(
            func.upper(Profession.name) == name.upper()
        ).first()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Profession]:
        return self.db.query(Profession).order_by(Profession.name).offset(skip).limit(limit).all()
    
    async def create(self, profession_data: ProfessionCreate) -> Profession:
        # Verificar si ya existe
        existing = await self.get_by_name(profession_data.name)
        if existing:
            raise ValueError(f"La profesión '{profession_data.name}' ya existe")
        
        profession = Profession(**profession_data.model_dump())
        self.db.add(profession)
        self.db.commit()
        self.db.refresh(profession)
        return profession
    
    async def update(self, profession_id: int, profession_data: ProfessionUpdate) -> Optional[Profession]:
        profession = await self.get_by_id(profession_id)
        if not profession:
            return None
        
        # Verificar duplicados si se está actualizando el nombre
        if profession_data.name and profession_data.name != profession.name:
            existing = await self.get_by_name(profession_data.name)
            if existing and existing.id != profession_id:
                raise ValueError(f"La profesión '{profession_data.name}' ya existe")
        
        update_data = profession_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profession, field, value)
        
        self.db.commit()
        self.db.refresh(profession)
        return profession
    
    async def delete(self, profession_id: int) -> bool:
        profession = await self.get_by_id(profession_id)
        if not profession:
            return False
        
        self.db.delete(profession)
        self.db.commit()
        return True
    
    async def count(self) -> int:
        return self.db.query(Profession).count()
