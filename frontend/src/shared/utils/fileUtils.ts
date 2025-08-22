import { FILE_CONSTRAINTS } from '../constants';

export const validateFile = (file: File): string | null => {
  if (!file) {
    return 'No se ha seleccionado ningún archivo';
  }

  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    return `El archivo es muy grande. Tamaño máximo: ${FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB`;
  }

  if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)';
  }

  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('No se pudo crear la vista previa'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};
