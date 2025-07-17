
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Edit, Copy, Download, Filter, Eye } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { generateReport } from '@/store/slices/reportsSlice';
import Layout from '@/components/layout/Layout';

const ReportView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { reports } = useAppSelector(state => state.reports);
  const report = reports.find(r => r.id === reportId);
  
  const [reportData, setReportData] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!report) {
      navigate('/reports');
    }
  }, [report, navigate]);

  const handleRunReport = async () => {
    if (reportId) {
      setIsRunning(true);
      const result = await dispatch(generateReport(reportId));
      if (result.meta.requestStatus === 'fulfilled' && result.payload) {
        const payload = result.payload as { reportId: string; data: any[] };
        setReportData(payload.data);
      }
      setIsRunning(false);
    }
  };

  if (!report) {
    return <Layout><div>Report not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/reports')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Eye className="h-8 w-8 text-primary" />
                {report.name}
              </h1>
              <p className="text-muted-foreground">{report.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/reports/${reportId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Clone
            </Button>
            <Button onClick={handleRunReport} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Report'}
            </Button>
          </div>
        </div>

        {/* Report Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Details</CardTitle>
              <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-sm">{report.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Run</label>
                <p className="text-sm">{report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Columns</label>
                <p className="text-sm">{report.columns.length} columns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.filters?.map((filter: any, index: number) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  <input
                    type={filter.type}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={filter.placeholder}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {reportData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Results</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      {report.columns.map((column: any) => (
                        <th key={column.key} className="border border-gray-200 px-4 py-2 text-left">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {report.columns.map((column: any) => (
                          <td key={column.key} className="border border-gray-200 px-4 py-2">
                            {row[column.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ReportView;
