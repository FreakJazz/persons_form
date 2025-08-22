from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.use_cases.profession_use_case import ProfessionUseCase
from app.schemas.profession_request_response import (
    ProfessionCreate,
    ProfessionUpdate,
    ProfessionResponse,
    ProfessionListResponse
)
from app.core.exceptions import NotFoundException, ConflictException

router = APIRouter()

@router.get("/", response_model=ProfessionListResponse)
async def get_professions(
    page: int = Query(1, ge=1, description="Número de página"),
    size: int = Query(50, ge=1, le=100, description="Tamaño de página"),
    db: Session = Depends(get_db)
):
    """Obtener lista de profesiones con paginación."""
    profession_use_case = ProfessionUseCase(db)
    return await profession_use_case.get_all_professions(page=page, size=size)

@router.get("/all", response_model=List[ProfessionResponse])
async def get_all_professions(
    db: Session = Depends(get_db)
):
    """Obtener todas las profesiones para selectores."""
    profession_use_case = ProfessionUseCase(db)
    return await profession_use_case.get_all_professions_for_selector()

@router.get("/search", response_model=List[ProfessionResponse])
async def search_professions(
    query: str = Query(..., min_length=1, description="Término de búsqueda"),
    db: Session = Depends(get_db)
):
    """Buscar profesiones por nombre."""
    profession_use_case = ProfessionUseCase(db)
    return await profession_use_case.search_professions(query)

@router.post("/", response_model=ProfessionResponse, status_code=201)
async def create_profession(
    profession_data: ProfessionCreate,
    db: Session = Depends(get_db)
):
    """Crear una nueva profesión."""
    profession_use_case = ProfessionUseCase(db)
    try:
        return await profession_use_case.create_profession(profession_data)
    except ConflictException as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{profession_id}", response_model=ProfessionResponse)
async def get_profession(
    profession_id: int,
    db: Session = Depends(get_db)
):
    """Obtener una profesión por ID."""
    profession_use_case = ProfessionUseCase(db)
    try:
        return await profession_use_case.get_profession_by_id(profession_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{profession_id}", response_model=ProfessionResponse)
async def update_profession(
    profession_id: int,
    profession_data: ProfessionUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar una profesión."""
    profession_use_case = ProfessionUseCase(db)
    try:
        return await profession_use_case.update_profession(profession_id, profession_data)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ConflictException as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.delete("/{profession_id}", status_code=204)
async def delete_profession(
    profession_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar una profesión."""
    profession_use_case = ProfessionUseCase(db)
    try:
        await profession_use_case.delete_profession(profession_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
