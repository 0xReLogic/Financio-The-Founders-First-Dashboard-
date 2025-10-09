import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadPreviewProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUploadPreview({
  onFileSelect,
  accept = 'image/*',
  maxSizeMB = 5,
}: FileUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      handleClear();
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`Maximum file size is ${maxSizeMB}MB`);
      handleClear();
      return;
    }

    setFileName(file.name);
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-file"
      />

      {!preview && !fileName && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full border-2 border-dashed border-border rounded-md p-8 hover:border-primary hover:bg-accent/50 transition-colors"
          data-testid="button-upload-trigger"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <p className="text-sm font-medium">Upload Receipt</p>
            <p className="text-xs">Click to select a file (Max {maxSizeMB}MB)</p>
          </div>
        </button>
      )}

      {preview && (
        <div className="relative border border-border rounded-md overflow-hidden" data-testid="preview-container">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleClear}
            data-testid="button-clear-preview"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!preview && fileName && (
        <div className="flex items-center justify-between p-4 border border-border rounded-md bg-card" data-testid="file-info">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium truncate">{fileName}</span>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
            data-testid="button-clear-file"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="text-error">
          {error}
        </p>
      )}
    </div>
  );
}
