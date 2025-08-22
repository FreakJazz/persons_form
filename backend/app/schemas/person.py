from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, validator
from enum import Enum


class ProfessionEnum(str, Enum):
    INGENIERO = "Ingeniero"
    MEDICO = "Médico"
    ABOGADO = "Abogado"
    PROFESOR = "Profesor"
    CONTADOR = "Contador"
    ARQUITECTO = "Arquitecto"
    ENFERMERO = "Enfermero"
    PSICOLOGO = "Psicólogo"
    VETERINARIO = "Veterinario"
    OTRO = "Otro"


class PersonBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    profession: ProfessionEnum
    address: str
    phone: str

    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Nombres y apellidos deben tener al menos 2 caracteres')
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        if not v or len(v) < 10:
            raise ValueError('El teléfono debe tener al menos 10 dígitos')
        return v

    @validator('address')
    def validate_address(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('La dirección debe tener al menos 5 caracteres')
        return v.strip()


class PersonCreate(PersonBase):
    pass


class PersonUpdate(PersonBase):
    pass


class PersonInDB(PersonBase):
    id: int
    age: int
    photo_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PersonResponse(PersonInDB):
    pass


class PersonStats(BaseModel):
    total_persons: int
    professions_count: dict
    age_ranges: dict
    monthly_registrations: dict
