
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Database, Search, TrendingUp, FileText } from 'lucide-react';
import { ragService } from '@/services/ragService';

interface AnalyticsData {
  totalQueries: number;
  totalDocuments: number;
  averageProcessingTime: number;
  recentQueries: any[];
  documentSources: Record<string, number>;
  documentTags: Record<string, number>;
}

const RAGAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await ragService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-64 bg-gray-100 rounded-md" />
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-2 border-red-400/30">
        <CardContent className="text-center py-8">
          <p className="text-red-600">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalQueries}</div>
                <div className="text-sm text-gray-600">Total Queries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{analytics.totalDocuments}</div>
                <div className="text-sm text-gray-600">Documents Indexed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(analytics.averageProcessingTime)}ms
                </div>
                <div className="text-sm text-gray-600">Avg. Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-400/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.recentQueries.length}
                </div>
                <div className="text-sm text-gray-600">Recent Queries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Queries */}
      <Card className="border-2 border-blue-400/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Recent Search Queries</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          {analytics.recentQueries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No queries yet</p>
          ) : (
            analytics.recentQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <div className="font-medium text-sm">{query.query}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(query.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {query.total_found} results
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {query.processing_time_ms}ms
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Sources */}
        <Card className="border-2 border-purple-400/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Document Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {Object.keys(analytics.documentSources).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No documents indexed yet</p>
            ) : (
              Object.entries(analytics.documentSources).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between p-2">
                  <span className="text-sm font-medium">{source}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Document Tags */}
        <Card className="border-2 border-green-400/30">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Popular Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {Object.keys(analytics.documentTags).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tags found</p>
            ) : (
              Object.entries(analytics.documentTags)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between p-2">
                    <span className="text-sm font-medium">{tag}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RAGAnalytics;
