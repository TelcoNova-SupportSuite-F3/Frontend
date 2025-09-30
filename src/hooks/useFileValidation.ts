import { useMemo } from 'react';

interface FileValidationConfig {
  allowedTypes: string[];
  allowedExtensions: string[];
  maxSize: number;
}

interface FileValidationReturn {
  validateFile: (file: File) => string | null;
  formatFileSize: (bytes: number) => string;
  config: FileValidationConfig;
}

export function useFileValidation(): FileValidationReturn {
  // Configuración de validación
  const config = useMemo<FileValidationConfig>(
    () => ({
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      allowedExtensions: ['.jpg', '.jpeg', '.png'],
      maxSize: 5 * 1024 * 1024, // 5MB
    }),
    []
  );

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    if (!config.allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos JPG, JPEG y PNG';
    }

    // Validar extensión como backup
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));
    if (!config.allowedExtensions.includes(fileExtension)) {
      return 'Solo se permiten archivos con extensión .jpg, .jpeg, .png';
    }

    // Validar tamaño
    if (file.size > config.maxSize) {
      return 'El archivo no puede ser mayor a 5MB';
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      return 'El archivo está vacío';
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    validateFile,
    formatFileSize,
    config,
  };
}
