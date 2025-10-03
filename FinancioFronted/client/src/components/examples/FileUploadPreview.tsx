import FileUploadPreview from '../FileUploadPreview';

export default function FileUploadPreviewExample() {
  return (
    <div className="p-6 max-w-md">
      <FileUploadPreview
        onFileSelect={(file) => console.log('File selected:', file)}
        maxSizeMB={5}
      />
    </div>
  );
}
