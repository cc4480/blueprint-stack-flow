
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Shield, Database, Zap, Save } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';

const Settings = () => {
  const [settings, setSettings] = useState({
    profile: {
      name: 'NoCodeLos Developer',
      email: 'developer@nocodelos.com',
      organization: 'NoCodeLos Labs'
    },
    system: {
      enableAnalytics: true,
      enableLogging: true,
      enableNotifications: true,
      autoBackup: false
    },
    rag: {
      chunkSize: 512,
      overlapSize: 50,
      maxResults: 10,
      enableReranking: true
    },
    mcp: {
      timeoutMs: 30000,
      retryAttempts: 3,
      enableCompression: true,
      batchSize: 100
    },
    a2a: {
      heartbeatInterval: 60,
      maxConnections: 50,
      enableEncryption: true,
      queueSize: 1000
    }
  });

  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            System Configuration
          </h1>
          <p className="text-purple-300 text-lg">
            Configure your NoCodeLos Blueprint Stack settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                  className="bg-black border-blue-400/30"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                  className="bg-black border-blue-400/30"
                />
              </div>
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={settings.profile.organization}
                  onChange={(e) => updateSetting('profile', 'organization', e.target.value)}
                  className="bg-black border-blue-400/30"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-purple-400" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Analytics</Label>
                <Switch
                  checked={settings.system.enableAnalytics}
                  onCheckedChange={(value) => updateSetting('system', 'enableAnalytics', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Logging</Label>
                <Switch
                  checked={settings.system.enableLogging}
                  onCheckedChange={(value) => updateSetting('system', 'enableLogging', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Notifications</Label>
                <Switch
                  checked={settings.system.enableNotifications}
                  onCheckedChange={(value) => updateSetting('system', 'enableNotifications', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto Backup</Label>
                <Switch
                  checked={settings.system.autoBackup}
                  onCheckedChange={(value) => updateSetting('system', 'autoBackup', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* RAG 2.0 Settings */}
          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                RAG 2.0 Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chunk-size">Chunk Size</Label>
                <Input
                  id="chunk-size"
                  type="number"
                  value={settings.rag.chunkSize}
                  onChange={(e) => updateSetting('rag', 'chunkSize', parseInt(e.target.value))}
                  className="bg-black border-green-400/30"
                />
              </div>
              <div>
                <Label htmlFor="overlap-size">Overlap Size</Label>
                <Input
                  id="overlap-size"
                  type="number"
                  value={settings.rag.overlapSize}
                  onChange={(e) => updateSetting('rag', 'overlapSize', parseInt(e.target.value))}
                  className="bg-black border-green-400/30"
                />
              </div>
              <div>
                <Label htmlFor="max-results">Max Results</Label>
                <Input
                  id="max-results"
                  type="number"
                  value={settings.rag.maxResults}
                  onChange={(e) => updateSetting('rag', 'maxResults', parseInt(e.target.value))}
                  className="bg-black border-green-400/30"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Re-ranking</Label>
                <Switch
                  checked={settings.rag.enableReranking}
                  onCheckedChange={(value) => updateSetting('rag', 'enableReranking', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* MCP Settings */}
          <Card className="bg-gray-900 border-yellow-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                MCP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={settings.mcp.timeoutMs}
                  onChange={(e) => updateSetting('mcp', 'timeoutMs', parseInt(e.target.value))}
                  className="bg-black border-yellow-400/30"
                />
              </div>
              <div>
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  value={settings.mcp.retryAttempts}
                  onChange={(e) => updateSetting('mcp', 'retryAttempts', parseInt(e.target.value))}
                  className="bg-black border-yellow-400/30"
                />
              </div>
              <div>
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  type="number"
                  value={settings.mcp.batchSize}
                  onChange={(e) => updateSetting('mcp', 'batchSize', parseInt(e.target.value))}
                  className="bg-black border-yellow-400/30"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Compression</Label>
                <Switch
                  checked={settings.mcp.enableCompression}
                  onCheckedChange={(value) => updateSetting('mcp', 'enableCompression', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Key Configuration */}
        <Card className="bg-gray-900 border-red-400/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="flex justify-center">
          <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
