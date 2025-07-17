
import { Row, ColumnDef } from '@tanstack/react-table';

/**
 * Export table data to CSV format
 * @param rows - Table rows to export
 * @param columns - Column definitions for headers
 * @param filename - Optional filename for the download
 */
export function exportToCSV<TData>(
  rows: Row<TData>[],
  columns: ColumnDef<TData>[],
  filename: string = 'export.csv'
): void {
  try {
    // Extract headers from column definitions
    const headers = columns
      .filter(col => col.header && typeof col.header === 'string')
      .map(col => col.header as string);

    // Extract data from rows
    const csvData = rows.map(row => {
      return columns.map(col => {
        const cellValue = row.getValue(col.id as string);
        // Handle different data types and escape commas/quotes
        if (cellValue === null || cellValue === undefined) return '';
        const stringValue = String(cellValue);
        // Escape quotes and wrap in quotes if contains comma or quote
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
    });

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export CSV:', error);
  }
}
