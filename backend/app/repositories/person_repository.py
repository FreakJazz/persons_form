from typing import List, Optional
from datetime import datetime, date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from app.models.person import Person
from app.models.profession import Profession
from app.schemas.person_request_response import PersonCreateRequest, PersonUpdateRequest
from app.repositories.person_repository_interface import PersonRepositoryInterface


class PersonRepository(PersonRepositoryInterface):
    def create(self, db: Session, person_data: PersonCreateRequest, photo_url: Optional[str] = None) -> Person:
        # Calcular edad
        today = date.today()
        birth_date = datetime.strptime(person_data.birth_date, '%Y-%m-%d').date()
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )
        
        db_person = Person(
            first_name=person_data.first_name,
            last_name=person_data.last_name,
            birth_date=birth_date,
            age=age,
            profession_id=person_data.profession_id,
            address=person_data.address,
            phone=person_data.phone,
            photo_url=photo_url
        )
        db.add(db_person)
        db.commit()
        db.refresh(db_person)
        return db_person

    def get_by_id(self, db: Session, person_id: int) -> Optional[Person]:
        return db.query(Person).options(joinedload(Person.profession)).filter(Person.id == person_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Person]:
        return db.query(Person).options(joinedload(Person.profession)).offset(skip).limit(limit).all()

    def update(self, db: Session, person_id: int, person_data: PersonUpdateRequest, photo_url: Optional[str] = None) -> Optional[Person]:
        db_person = self.get_by_id(db, person_id)
        if db_person:
            # Calcular nueva edad si cambió la fecha de nacimiento
            today = date.today()
            birth_date = datetime.strptime(person_data.birth_date, '%Y-%m-%d').date()
            age = today.year - birth_date.year - (
                (today.month, today.day) < (birth_date.month, birth_date.day)
            )
            
            # Actualizar campos
            db_person.first_name = person_data.first_name
            db_person.last_name = person_data.last_name
            db_person.birth_date = birth_date
            db_person.age = age
            db_person.profession_id = person_data.profession_id
            db_person.address = person_data.address
            db_person.phone = person_data.phone
            
            if photo_url:
                db_person.photo_url = photo_url
            
            db.commit()
            db.refresh(db_person)
        return db_person

    def delete(self, db: Session, person_id: int) -> bool:
        db_person = self.get_by_id(db, person_id)
        if db_person:
            db.delete(db_person)
            db.commit()
            return True
        return False

    def get_stats(self, db: Session) -> dict:
        # Total de personas
        total_persons = db.query(Person).count()
        
        # Conteo por profesión
        professions_count = dict(
            db.query(Person.profession, func.count(Person.id))
            .group_by(Person.profession)
            .all()
        )
        
        # Distribución por rangos de edad
        age_ranges = {
            "0-18": db.query(Person).filter(Person.age <= 18).count(),
            "19-35": db.query(Person).filter(Person.age.between(19, 35)).count(),
            "36-60": db.query(Person).filter(Person.age.between(36, 60)).count(),
            "60+": db.query(Person).filter(Person.age > 60).count(),
        }
        
        # Registros por mes
        monthly_registrations = {}
        monthly_data = (
            db.query(
                extract('year', Person.created_at).label('year'),
                extract('month', Person.created_at).label('month'),
                func.count(Person.id).label('count')
            )
            .group_by(extract('year', Person.created_at), extract('month', Person.created_at))
            .all()
        )
        
        for year, month, count in monthly_data:
            key = f"{int(year)}-{int(month):02d}"
            monthly_registrations[key] = count
        
        return {
            "total_persons": total_persons,
            "professions_count": professions_count,
            "age_ranges": age_ranges,
            "monthly_registrations": monthly_registrations
        }
