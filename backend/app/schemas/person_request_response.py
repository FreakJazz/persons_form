from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, validator


class PersonCreateRequest(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100, description="Nombres de la persona")
    last_name: str = Field(..., min_length=2, max_length=100, description="Apellidos de la persona")
    birth_date: str = Field(..., description="Fecha de nacimiento en formato YYYY-MM-DD")
    profession_id: int = Field(..., description="ID de la profesión")
    address: str = Field(..., min_length=5, max_length=500, description="Dirección de la persona")
    phone: str = Field(..., min_length=10, max_length=15, pattern=r'^\d{10,15}$', description="Número de teléfono")

    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Nombres y apellidos deben tener al menos 2 caracteres')
        return v.strip().title()

    @validator('phone')
    def validate_phone(cls, v):
        if not v or len(v) < 10:
            raise ValueError('El teléfono debe tener al menos 10 dígitos')
        if not v.isdigit():
            raise ValueError('El teléfono debe contener solo números')
        return v

    @validator('address')
    def validate_address(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('La dirección debe tener al menos 5 caracteres')
        return v.strip()

    @validator('birth_date')
    def validate_birth_date(cls, v):
        try:
            birth_date = datetime.strptime(v, '%Y-%m-%d').date()
            if birth_date > datetime.now().date():
                raise ValueError('La fecha de nacimiento no puede ser futura')
            return v
        except ValueError:
            raise ValueError('Formato de fecha inválido. Use YYYY-MM-DD')


class PersonUpdateRequest(PersonCreateRequest):
    pass


class PersonCreateResponse(BaseModel):
    id: int
    message: str = "Persona creada exitosamente"
    success: bool = True

    class Config:
        from_attributes = True


class PersonUpdateResponse(BaseModel):
    success: bool = True
    message: str = "Persona actualizada exitosamente"

    class Config:
        from_attributes = True


class PersonDeleteResponse(BaseModel):
    success: bool = True
    message: str = "Persona eliminada exitosamente"


class PersonResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    birth_date: str
    age: int
    profession_id: int
    profession_name: str = Field(alias="profession.name")
    address: str
    phone: str
    photo_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True


class PersonListResponse(BaseModel):
    data: list[PersonResponse]
    total: int
    page: int
    limit: int
    success: bool = True


class PersonStatsResponse(BaseModel):
    total_persons: int
    professions_count: dict
    age_ranges: dict
    monthly_registrations: dict
    success: bool = True
