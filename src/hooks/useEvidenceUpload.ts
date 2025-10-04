import { useState, useTransition } from 'react';
import { uploadEvidence } from '@/lib/order-actions';

/**
 * Result of an evidence upload operation
 */
interface UploadResult {
  success: boolean;
  message: string;
}

/**
 * Return type for useEvidenceUpload hook
 */
interface UseEvidenceUploadReturn {
  /** Currently selected file */
  selectedFile: File | null;
  /** Whether an upload is in progress */
  isPending: boolean;
  /** Error message if upload failed */
  error: string | null;
  /** Select a file for upload */
  selectFile: (file: File | null) => void;
  /** Upload the selected file */
  upload: () => Promise<UploadResult>;
  /** Clear any errors */
  clearError: () => void;
}

/**
 * Custom hook for handling evidence upload logic
 *
 * Separates upload logic from UI components following the Single Responsibility Principle.
 * Makes the logic testable independently of React components.
 *
 * @param orderId - The ID of the order to upload evidence for
 * @returns Upload state and methods
 *
 * @example
 * ```tsx
 * const { selectedFile, selectFile, upload, isPending } = useEvidenceUpload(orderId);
 *
 * const handleUpload = async () => {
 *   const result = await upload();
 *   if (result.success) {
 *     toast.success(result.message);
 *   } else {
 *     toast.error(result.message);
 *   }
 * };
 * ```
 */
export function useEvidenceUpload(orderId: string): UseEvidenceUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectFile = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
  };

  const upload = async (): Promise<UploadResult> => {
    if (!selectedFile) {
      const errorMsg = 'No hay archivo seleccionado';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const result = await uploadEvidence(orderId, formData);

          if (result.success) {
            setSelectedFile(null);
            setError(null);
          } else {
            setError(result.message);
          }

          resolve(result);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Error inesperado al subir evidencia';

          setError(errorMessage);
          resolve({ success: false, message: errorMessage });
        }
      });
    });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    selectedFile,
    isPending,
    error,
    selectFile,
    upload,
    clearError,
  };
}
