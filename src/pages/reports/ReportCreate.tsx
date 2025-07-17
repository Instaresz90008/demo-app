
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, FileText } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createReport } from '@/store/slices/reportsSlice';
import Layout from '@/components/layout/Layout';

const ReportCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Check if we're cloning from a template
  const template = location.state?.template;
  
  const [newReport, setNewReport] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'basic' as const,
    type: template?.type || 'standard' as const,
    status: 'active' as const,
    columns: template?.columns || [],
    filters: template?.filters || []
  });

  const handleSave = () => {
    const report = {
      ...newReport,
      id: `report-${Date.now()}`,
      data: [],
      lastGenerated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastRun: null
    };
    dispatch(createReport(report));
    navigate('/reports');
  };

  const addColumn = () => {
    setNewReport({
      ...newReport,
      columns: [...newReport.columns, { key: '', label: '', type: 'text' }]
    });
  };

  const removeColumn = (index: number) => {
    setNewReport({
      ...newReport,
      columns: newReport.columns.filter((_: any, i: number) => i !== index)
    });
  };

  const updateColumn = (index: number, field: string, value: string) => {
    const newColumns = [...newReport.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setNewReport({ ...newReport, columns: newColumns });
  };

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
                <FileText className="h-8 w-8 text-primary" />
                {template ? 'Clone Report' : 'Create New Report'}
              </h1>
              <p className="text-muted-foreground">
                {template ? 'Create a copy of an existing report' : 'Build a custom report from scratch'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/reports')}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Create Report
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
                  placeholder="Enter report name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select value={newReport.type} onValueChange={(value) => setNewReport({...newReport, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
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
                placeholder="Describe what this report shows"
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
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
              {newReport.columns.map((column: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Column Key (e.g., client_name)"
                      value={column.key}
                      onChange={(e) => updateColumn(index, 'key', e.target.value)}
                    />
                    <Input
                      placeholder="Column Label (e.g., Client Name)"
                      value={column.label}
                      onChange={(e) => updateColumn(index, 'label', e.target.value)}
                    />
                    <Select value={column.type} onValueChange={(value) => updateColumn(index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
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
              {newReport.columns.length === 0 && (
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

export default ReportCreate;
