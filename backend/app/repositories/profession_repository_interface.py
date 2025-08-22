from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.profession import Profession
from app.schemas.profession_request_response import ProfessionCreate, ProfessionUpdate

class ProfessionRepositoryInterface(ABC):
    @abstractmethod
    async def get_by_id(self, profession_id: int) -> Optional[Profession]:
        pass
    
    @abstractmethod
    async def get_by_name(self, name: str) -> Optional[Profession]:
        pass
    
    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Profession]:
        pass
    
    @abstractmethod
    async def create(self, profession_data: ProfessionCreate) -> Profession:
        pass
    
    @abstractmethod
    async def update(self, profession_id: int, profession_data: ProfessionUpdate) -> Optional[Profession]:
        pass
    
    @abstractmethod
    async def delete(self, profession_id: int) -> bool:
        pass
    
    @abstractmethod
    async def count(self) -> int:
        pass
