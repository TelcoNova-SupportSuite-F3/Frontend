import { useState } from 'react';

interface DragAndDropHandlers {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDragIn: (e: React.DragEvent) => void;
  handleDragOut: (e: React.DragEvent) => void;
  handleDrop: (
    e: React.DragEvent,
    onFilesDrop: (files: File[]) => void
  ) => void;
}

export function useDragAndDrop(): DragAndDropHandlers {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    onFilesDrop: (files: File[]) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  return {
    dragActive,
    handleDrag,
    handleDragIn,
    handleDragOut,
    handleDrop,
  };
}
