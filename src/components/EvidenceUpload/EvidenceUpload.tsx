'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FileUpload from '../FileUpload/FileUpload';
import { uploadEvidence } from '../../lib/order-actions';
import { toast } from 'sonner';

interface EvidenceUploadProps {
  orderId: string;
}

export default function EvidenceUpload({ orderId }: EvidenceUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const result = await uploadEvidence(orderId, formData);

        if (result.success) {
          toast.success(result.message);
          setSelectedFile(null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error uploading evidence:', error);
        toast.error('Error inesperado al subir evidencia');
      }
    });
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <FileUpload
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          isLoading={isPending}
        />
      </CardContent>
    </Card>
  );
}
