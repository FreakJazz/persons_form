from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ProfessionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nombre de la profesión")
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre de la profesión no puede estar vacío')
        # Convertir a mayúsculas automáticamente
        return v.strip().upper()

class ProfessionCreate(ProfessionBase):
    pass

class ProfessionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Nombre de la profesión")
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if not v or not v.strip():
                raise ValueError('El nombre de la profesión no puede estar vacío')
            # Convertir a mayúsculas automáticamente
            return v.strip().upper()
        return v

class ProfessionResponse(ProfessionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ProfessionListResponse(BaseModel):
    professions: list[ProfessionResponse]
    total: int
    page: int
    size: int
    total_pages: int
