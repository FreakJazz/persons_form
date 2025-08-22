from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.person import Person
from app.schemas.person import PersonCreate, PersonUpdate


class PersonRepositoryInterface(ABC):
    @abstractmethod
    def create(self, db: Session, person_data: PersonCreate) -> Person:
        pass

    @abstractmethod
    def get_by_id(self, db: Session, person_id: int) -> Optional[Person]:
        pass

    @abstractmethod
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Person]:
        pass

    @abstractmethod
    def update(self, db: Session, person_id: int, person_data: PersonUpdate) -> Optional[Person]:
        pass

    @abstractmethod
    def delete(self, db: Session, person_id: int) -> bool:
        pass

    @abstractmethod
    def get_stats(self, db: Session) -> dict:
        pass
