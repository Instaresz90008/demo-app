
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateReport, Report } from '@/store/slices/reportsSlice';
import Layout from '@/components/layout/Layout';

const ReportEdit = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { reports } = useAppSelector(state => state.reports);
  const report = reports.find(r => r.id === reportId);
  
  const [editedReport, setEditedReport] = useState<Report>(report || {
    id: '',
    name: '',
    description: '',
    category: 'basic' as const,
    type: 'standard' as const,
    status: 'active' as const,
    data: [],
    lastGenerated: new Date().toISOString(),
    columns: [],
    filters: [],
    createdAt: new Date().toISOString(),
    lastRun: null
  });

  useEffect(() => {
    if (!report) {
      navigate('/reports');
    } else {
      setEditedReport(report);
    }
  }, [report, navigate]);

  const handleSave = () => {
    dispatch(updateReport(editedReport));
    navigate(`/reports/${reportId}/view`);
  };

  const addColumn = () => {
    setEditedReport({
      ...editedReport,
      columns: [...editedReport.columns, { key: '', label: '', type: 'text' }]
    });
  };

  const removeColumn = (index: number) => {
    setEditedReport({
      ...editedReport,
      columns: editedReport.columns.filter((_: any, i: number) => i !== index)
    });
  };

  const updateColumn = (index: number, field: string, value: string) => {
    const newColumns = [...editedReport.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setEditedReport({ ...editedReport, columns: newColumns });
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
                <Edit className="h-8 w-8 text-primary" />
                Edit Report
              </h1>
              <p className="text-muted-foreground">Modify report settings and structure</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/reports/${reportId}/view`)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={editedReport.name}
                  onChange={(e) => setEditedReport({...editedReport, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select value={editedReport.type} onValueChange={(value) => setEditedReport({...editedReport, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedReport.description}
                onChange={(e) => setEditedReport({...editedReport, description: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Columns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Columns</CardTitle>
              <Button onClick={addColumn} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {editedReport.columns.map((column: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Column Key"
                      value={column.key}
                      onChange={(e) => updateColumn(index, 'key', e.target.value)}
                    />
                    <Input
                      placeholder="Column Label"
                      value={column.label}
                      onChange={(e) => updateColumn(index, 'label', e.target.value)}
                    />
                    <Select value={column.type} onValueChange={(value) => updateColumn(index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeColumn(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {editedReport.columns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No columns defined. Click "Add Column" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportEdit;
