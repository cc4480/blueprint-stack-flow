
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wand2, Code, Database, Users } from 'lucide-react';

interface PromptFormProps {
  onGenerate: (formData: any) => void;
  isGenerating: boolean;
}

const PromptForm = ({ onGenerate, isGenerating }: PromptFormProps) => {
  const [formData, setFormData] = useState({
    appType: '',
    dataSource: '',
    features: [] as string[],
    additionalRequirements: ''
  });

  const appTypes = [
    { value: 'dashboard', label: 'Business Dashboard', icon: '📊' },
    { value: 'ecommerce', label: 'E-commerce Store', icon: '🛒' },
    { value: 'social', label: 'Social Platform', icon: '👥' },
    { value: 'productivity', label: 'Productivity Tool', icon: '⚡' },
    { value: 'portfolio', label: 'Portfolio Site', icon: '🎨' },
    { value: 'saas', label: 'SaaS Application', icon: '🚀' }
  ];

  const dataSources = [
    { value: 'supabase', label: 'Supabase Database', icon: '🗄️' },
    { value: 'api', label: 'External API', icon: '🔌' },
    { value: 'static', label: 'Static Data', icon: '📝' },
    { value: 'ai', label: 'AI-Generated Content', icon: '🤖' }
  ];

  const availableFeatures = [
    { id: 'auth', label: 'User Authentication', category: 'Security' },
    { id: 'payments', label: 'Payment Processing', category: 'Commerce' },
    { id: 'realtime', label: 'Real-time Updates', category: 'Communication' },
    { id: 'mobile', label: 'Mobile Responsive', category: 'Design' },
    { id: 'search', label: 'Search Functionality', category: 'Features' },
    { id: 'analytics', label: 'Analytics Dashboard', category: 'Business' },
    { id: 'notifications', label: 'Push Notifications', category: 'Communication' },
    { id: 'file-upload', label: 'File Upload/Storage', category: 'Features' }
  ];

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSubmit = () => {
    if (!formData.appType || !formData.dataSource || formData.features.length === 0) {
      return;
    }
    onGenerate(formData);
  };

  const isFormValid = formData.appType && formData.dataSource && formData.features.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Application Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.appType} onValueChange={(value) => setFormData(prev => ({ ...prev, appType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select application type" />
              </SelectTrigger>
              <SelectContent>
                {appTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Data Source</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.dataSource} onValueChange={(value) => setFormData(prev => ({ ...prev, dataSource: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map(source => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.icon} {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Features & Capabilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableFeatures.map(feature => (
              <Badge
                key={feature.id}
                variant={formData.features.includes(feature.id) ? "default" : "outline"}
                className="cursor-pointer py-2 px-3 justify-center"
                onClick={() => handleFeatureToggle(feature.id)}
              >
                {feature.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="requirements">Specific requirements or constraints</Label>
          <Textarea
            id="requirements"
            placeholder="Describe any specific requirements, constraints, or additional features..."
            value={formData.additionalRequirements}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
            className="mt-2"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isGenerating}
          size="lg"
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating Blueprint...' : 'Generate NoCodeLos Blueprint'}
        </Button>
      </div>
    </div>
  );
};

export default PromptForm;
