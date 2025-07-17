
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ReportColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean';
}

export interface ReportFilter {
  label: string;
  type: string;
  placeholder: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced';
  type: 'standard' | 'analytics' | 'financial' | 'operational';
  status: 'active' | 'inactive' | 'draft';
  data: any[];
  lastGenerated: string;
  columns: ReportColumn[];
  filters: ReportFilter[];
  createdAt: string;
  lastRun: string | null;
}

export interface ReportsState {
  reports: Report[];
  activeReport: Report | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [
    {
      id: 'booking-summary',
      name: 'Booking Summary',
      description: 'Overview of all bookings in the last 30 days',
      category: 'basic',
      type: 'analytics',
      status: 'active',
      data: [],
      lastGenerated: new Date().toISOString(),
      columns: [
        { key: 'period', label: 'Period', type: 'text' },
        { key: 'bookings', label: 'Bookings', type: 'number' },
        { key: 'revenue', label: 'Revenue', type: 'number' }
      ],
      filters: [
        { label: 'Date Range', type: 'date', placeholder: 'Select date range' }
      ],
      createdAt: new Date().toISOString(),
      lastRun: null,
    },
    {
      id: 'revenue-analysis',
      name: 'Revenue Analysis',
      description: 'Detailed revenue breakdown by service and time period',
      category: 'basic',
      type: 'financial',
      status: 'active',
      data: [],
      lastGenerated: new Date().toISOString(),
      columns: [
        { key: 'service', label: 'Service', type: 'text' },
        { key: 'revenue', label: 'Revenue', type: 'number' },
        { key: 'bookings', label: 'Bookings', type: 'number' }
      ],
      filters: [
        { label: 'Service Type', type: 'select', placeholder: 'Select service' }
      ],
      createdAt: new Date().toISOString(),
      lastRun: null,
    },
    {
      id: 'client-activity',
      name: 'Client Activity Report',
      description: 'Client engagement and booking patterns',
      category: 'basic',
      type: 'operational',
      status: 'active',
      data: [],
      lastGenerated: new Date().toISOString(),
      columns: [
        { key: 'month', label: 'Month', type: 'text' },
        { key: 'newClients', label: 'New Clients', type: 'number' },
        { key: 'returningClients', label: 'Returning Clients', type: 'number' }
      ],
      filters: [
        { label: 'Time Period', type: 'select', placeholder: 'Select period' }
      ],
      createdAt: new Date().toISOString(),
      lastRun: null,
    },
  ],
  activeReport: null,
  loading: false,
  error: null,
};

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (reportId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock data based on report type
    const mockData = generateMockData(reportId);
    
    return { reportId, data: mockData };
  }
);

const generateMockData = (reportId: string) => {
  switch (reportId) {
    case 'booking-summary':
      return [
        { period: 'Week 1', bookings: 12, revenue: 2400 },
        { period: 'Week 2', bookings: 18, revenue: 3600 },
        { period: 'Week 3', bookings: 15, revenue: 3000 },
        { period: 'Week 4', bookings: 22, revenue: 4400 },
      ];
    case 'revenue-analysis':
      return [
        { service: 'Consultation', revenue: 5200, bookings: 26 },
        { service: 'Strategy Session', revenue: 3800, bookings: 19 },
        { service: 'Technical Review', revenue: 2400, bookings: 12 },
      ];
    case 'client-activity':
      return [
        { month: 'Jan', newClients: 8, returningClients: 15 },
        { month: 'Feb', newClients: 12, returningClients: 18 },
        { month: 'Mar', newClients: 10, returningClients: 22 },
      ];
    default:
      return [];
  }
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setActiveReport: (state, action: PayloadAction<string>) => {
      state.activeReport = state.reports.find(report => report.id === action.payload) || null;
    },
    clearActiveReport: (state) => {
      state.activeReport = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    createReport: (state, action: PayloadAction<Omit<Report, 'id'> & { id?: string }>) => {
      const newReport = {
        ...action.payload,
        id: action.payload.id || `report-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastRun: null,
        lastGenerated: new Date().toISOString(),
      } as Report;
      state.reports.push(newReport);
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        const report = state.reports.find(r => r.id === action.payload.reportId);
        if (report) {
          report.data = action.payload.data;
          report.lastGenerated = new Date().toISOString();
          report.lastRun = new Date().toISOString();
        }
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate report';
      });
  },
});

export const { setActiveReport, clearActiveReport, clearError, createReport, updateReport, deleteReport } = reportsSlice.actions;
export default reportsSlice.reducer;
