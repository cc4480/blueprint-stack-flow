
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface IndexingStatusProps {
  indexedDocuments: string[];
}

const IndexingStatus = ({ indexedDocuments }: IndexingStatusProps) => {
  if (indexedDocuments.length === 0) return null;

  return (
    <Card className="border-2 border-green-400/30">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Recently Indexed Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {indexedDocuments.map((docId, index) => (
            <div key={docId} className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-mono">Document #{index + 1}: {docId.substring(0, 16)}...</span>
              <Badge variant="secondary" className="text-xs">Indexed</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexingStatus;
