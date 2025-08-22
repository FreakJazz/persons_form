from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Profession(Base):
    __tablename__ = "professions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación con Person
    persons = relationship("Person", back_populates="profession")
    
    def __repr__(self):
        return f"<Profession(id={self.id}, name='{self.name}')>"
