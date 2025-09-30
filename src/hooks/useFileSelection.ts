import { useState, useRef } from 'react';
import { useFileValidation } from './useFileValidation';

interface FileSelectionReturn {
  selectedFile: File | null;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (file: File) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBrowseClick: () => void;
  handleRemoveFile: () => void;
  handleFilesDrop: (files: File[]) => void;
}

interface UseFileSelectionProps {
  onFileSelect: (file: File) => void;
}

export function useFileSelection({
  onFileSelect,
}: UseFileSelectionProps): FileSelectionReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateFile } = useFileValidation();

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilesDrop = (files: File[]) => {
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return {
    selectedFile,
    error,
    fileInputRef,
    handleFileSelect,
    handleInputChange,
    handleBrowseClick,
    handleRemoveFile,
    handleFilesDrop,
  };
}
