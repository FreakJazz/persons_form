from fastapi import APIRouter
from app.api.v1 import persons, professions

api_router = APIRouter()
api_router.include_router(persons.router, prefix="/persons", tags=["persons"])
api_router.include_router(professions.router, prefix="/professions", tags=["professions"])
