'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload/FileUpload';
import { useEvidenceUpload } from '@/hooks/useEvidenceUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Props for EvidenceUpload component
 */
interface EvidenceUploadProps {
  /** ID of the order to upload evidence for */
  orderId: string;
  /** Optional CSS classes */
  className?: string;
  /** Callback called after successful upload */
  onUploadSuccess?: () => void;
  /** Callback called when upload fails */
  onUploadError?: (error: string) => void;
}

/**
 * EvidenceUpload Component
 *
 * Handles evidence upload for work orders. This component follows SOLID principles:
 * - Single Responsibility: Only coordinates UI and upload flow
 * - Dependency Inversion: Depends on useEvidenceUpload abstraction
 * - Open/Closed: Extended through callbacks without modification
 *
 * The actual upload logic is delegated to the useEvidenceUpload hook,
 * making this component focused on presentation and user interaction.
 *
 * @example
 * ```tsx
 * <EvidenceUpload
 *   orderId="123"
 *   onUploadSuccess={() => console.log('Upload successful')}
 * />
 * ```
 */
export default function EvidenceUpload({
  orderId,
  className,
  onUploadSuccess,
  onUploadError,
}: EvidenceUploadProps) {
  const router = useRouter();
  const { selectedFile: _selectedFile, isPending, selectFile, upload } =
    useEvidenceUpload(orderId);

  const handleFileSelect = (file: File) => {
    selectFile(file);
  };

  const handleUpload = async () => {
    const result = await upload();

    if (result.success) {
      toast.success(result.message);
      router.refresh();
      onUploadSuccess?.();
    } else {
      toast.error(result.message);
      onUploadError?.(result.message);
    }
  };

  return (
    <Card className={cn(className)}>
      <CardContent className={cn('p-6')}>
        <FileUpload
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          isLoading={isPending}
        />
      </CardContent>
    </Card>
  );
}
