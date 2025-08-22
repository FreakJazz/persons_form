from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.use_cases.person_use_case import PersonUseCase
from app.schemas.person_request_response import (
    PersonCreateRequest,
    PersonUpdateRequest,
    PersonResponse,
    PersonCreateResponse,
    PersonUpdateResponse,
    PersonDeleteResponse,
    PersonListResponse
)

router = APIRouter()
person_use_case = PersonUseCase()


@router.post("/", response_model=PersonCreateResponse)
async def create_person(
    first_name: str = Form(...),
    last_name: str = Form(...),
    birth_date: str = Form(...),
    profession_id: int = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Crear una nueva persona
    """
    try:
        person_data = PersonCreateRequest(
            first_name=first_name,
            last_name=last_name,
            birth_date=birth_date,
            profession_id=profession_id,
            address=address,
            phone=phone
        )
        
        created_person = await person_use_case.create_person(db, person_data, photo)
        
        return PersonCreateResponse(
            id=created_person.id,
            message="Persona creada exitosamente",
            success=True
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.get("/", response_model=List[PersonResponse])
async def get_all_persons(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las personas
    """
    try:
        persons = person_use_case.get_all_persons(db, skip, limit)
        return persons
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.get("/{person_id}", response_model=PersonResponse)
async def get_person(person_id: int, db: Session = Depends(get_db)):
    """
    Obtener una persona por ID
    """
    try:
        person = person_use_case.get_person(db, person_id)
        if not person:
            raise HTTPException(status_code=404, detail="Persona no encontrada")
        return person
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.put("/{person_id}", response_model=PersonUpdateResponse)
async def update_person(
    person_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    birth_date: str = Form(...),
    profession_id: int = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Actualizar una persona
    """
    try:
        person_data = PersonUpdateRequest(
            first_name=first_name,
            last_name=last_name,
            birth_date=birth_date,
            profession_id=profession_id,
            address=address,
            phone=phone
        )
        
        updated_person = await person_use_case.update_person(db, person_id, person_data, photo)
        if not updated_person:
            raise HTTPException(status_code=404, detail="Persona no encontrada")
        
        return PersonUpdateResponse(
            success=True,
            message="Persona actualizada exitosamente"
        )
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.delete("/{person_id}", response_model=PersonDeleteResponse)
async def delete_person(person_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una persona
    """
    try:
        success = person_use_case.delete_person(db, person_id)
        if not success:
            raise HTTPException(status_code=404, detail="Persona no encontrada")
        
        return PersonDeleteResponse(
            success=True,
            message="Persona eliminada exitosamente"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.post("/batch", response_model=List[PersonResponse])
async def create_multiple_persons(
    persons_data: str = Form(..., description="JSON con los datos de las personas"),
    photos: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    """
    Crear múltiples personas a la vez
    """
    try:
        import json
        
        # Parsear los datos JSON
        persons_list = json.loads(persons_data)
        
        created_persons = []
        for i, person_data in enumerate(persons_list):
            # Crear el request para cada persona
            person_request = PersonCreateRequest(
                first_name=person_data["first_name"],
                last_name=person_data["last_name"],
                birth_date=person_data["birth_date"],
                profession_id=person_data["profession_id"],
                address=person_data["address"],
                phone=person_data["phone"]
            )
            
            # Obtener la foto correspondiente si existe
            photo = photos[i] if i < len(photos) else None
            
            # Crear la persona
            created_person = await person_use_case.create_person(db, person_request, photo)
            created_persons.append(created_person)
        
        return created_persons
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Formato JSON inválido en persons_data")
    except IndexError as e:
        raise HTTPException(status_code=400, detail="Número de fotos no coincide con número de personas")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.get("/stats/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Obtener estadísticas para el dashboard
    """
    try:
        from sqlalchemy import func, extract
        from app.models.person import Person
        from app.models.profession import Profession
        from datetime import datetime, timedelta
        import calendar
        
        # Total de personas
        total_persons = db.query(Person).count()
        total_professions = db.query(Profession).count()
        
        # Distribución por profesiones
        profession_stats = db.query(
            Profession.name.label('profession_name'),
            func.count(Person.id).label('count')
        ).outerjoin(Person).group_by(Profession.id, Profession.name).all()
        
        profession_distribution = [
            {"profession_name": stat.profession_name, "count": stat.count}
            for stat in profession_stats
        ]
        
        # Distribución por rangos de edad
        today = datetime.now().date()
        age_ranges = []
        
        # Obtener todas las personas con sus fechas de nacimiento
        persons = db.query(Person.birth_date).all()
        
        ranges = {"0-18": 0, "19-35": 0, "36-60": 0, "60+": 0}
        
        for person in persons:
            if person.birth_date:
                age = today.year - person.birth_date.year
                if today < person.birth_date.replace(year=today.year):
                    age -= 1
                
                if age <= 18:
                    ranges["0-18"] += 1
                elif age <= 35:
                    ranges["19-35"] += 1
                elif age <= 60:
                    ranges["36-60"] += 1
                else:
                    ranges["60+"] += 1
        
        age_distribution = [
            {"range": range_name, "count": count}
            for range_name, count in ranges.items()
        ]
        
        # Registros por mes (últimos 12 meses)
        monthly_stats = []
        current_date = datetime.now()
        
        for i in range(12):
            month_date = current_date - timedelta(days=30 * i)
            month_name = calendar.month_name[month_date.month]
            year = month_date.year
            
            count = db.query(Person).filter(
                extract('month', Person.created_at) == month_date.month,
                extract('year', Person.created_at) == year
            ).count()
            
            monthly_stats.append({
                "month": f"{month_name} {year}",
                "count": count
            })
        
        monthly_stats.reverse()  # Mostrar en orden cronológico
        
        return {
            "total_persons": total_persons,
            "total_professions": total_professions,
            "profession_distribution": profession_distribution,
            "age_distribution": age_distribution,
            "monthly_registrations": monthly_stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
