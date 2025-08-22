import os
import shutil
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException
from app.core.config import settings


class FileService:
    def __init__(self):
        self.upload_dir = "uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_photo(self, file: UploadFile) -> Optional[str]:
        """
        Guarda una foto de persona y retorna la URL del archivo
        """
        try:
            # Validar tipo de archivo
            allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
            if file.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo se permiten imágenes.")

            # Validar tamaño del archivo (5MB máximo)
            max_size = 5 * 1024 * 1024  # 5MB
            if file.size and file.size > max_size:
                raise HTTPException(status_code=400, detail="El archivo es muy grande. Máximo 5MB.")

            # Generar nombre único para el archivo
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
            filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.upload_dir, filename)

            # Guardar archivo
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Retornar URL relativa
            return f"/uploads/{filename}"

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al guardar el archivo: {str(e)}")

    def delete_photo(self, photo_url: str) -> bool:
        """
        Elimina una foto del sistema de archivos
        """
        try:
            if photo_url and photo_url.startswith("/uploads/"):
                filename = photo_url.replace("/uploads/", "")
                file_path = os.path.join(self.upload_dir, filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
                    return True
            return False
        except Exception:
            return False

            return f"/uploads/{filename}"

        except Exception as e:
            raise ValueError(f"Error al guardar el archivo: {str(e)}")

    def delete_file(self, file_path: str) -> bool:
        """
        Elimina un archivo del sistema
        """
        try:
            if file_path.startswith("/uploads/"):
                full_path = os.path.join(self.upload_dir, file_path.replace("/uploads/", ""))
                if os.path.exists(full_path):
                    os.remove(full_path)
                    return True
            return False
        except Exception:
            return False
