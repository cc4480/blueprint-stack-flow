
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  onContentLoaded: (content: string, filename: string) => void;
}

const DocumentUpload = ({ onContentLoaded }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onContentLoaded(text, file.name);
      toast.success(`File "${file.name}" loaded successfully`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload Document</label>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.json"
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Choose File</span>
        </Button>
        <span className="text-sm text-gray-500">
          Supports .txt, .md, .json files
        </span>
      </div>
    </div>
  );
};

export default DocumentUpload;
