import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import FileUploadCell from './FileUploadCell';
import axios from 'axios';
import { DataTable, DataTableValueArray, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import type { ColumnEditorOptions } from 'primereact/column';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FileLinks from './FileLinks';
import { Toast } from 'primereact/toast';

export interface FileData {
  storedName: string;
  originalName: string;
  size: number;
  url: string;
}

export interface FormTemplate extends DataTableValue {
  id: number;
  templateNo: string;
  name: string;
  revision: string;
  createdBy: string;
  department: string;
  reference: string;
  fields: string;
  createdAt: string;
  attachments: Array<{
    storedName: string;
    originalName: string;
    size: number;
    url: string;
  }>;
}

const mockData: FormTemplate[] = [
  {
    id: 1,
    templateNo: '545454',
    name: 'Template 1',
    revision: '1',
    createdBy: 'N/A',
    department: 'N/A',
    reference: 'N/A',
    fields: '2 fields',
    createdAt: 'Feb 3, 2025 05:51',
    attachments: []
  },
  {
    id: 2,
    templateNo: '8',
    name: 'Template 2',
    revision: '1',
    createdBy: 'N/A',
    department: 'N/A',
    reference: 'N/A',
    fields: '2 fields',
    createdAt: 'Feb 3, 2025 05:54',
    attachments: []
  },
  {
    id: 3,
    templateNo: '7',
    name: 'Template 3',
    revision: '1',
    createdBy: 'derek',
    department: 'QC',
    reference: '09',
    fields: '2 fields',
    createdAt: 'Feb 3, 2025 05:58',
    attachments: []
  }
];

const FormTemplateList: React.FC = () => {
  const [rows, setRows] = useState<FormTemplate[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [filters, setFilters] = useState<any>({
    templateNo: { value: '', matchMode: 'contains' },
    name: { value: '', matchMode: 'contains' },
    revision: { value: '', matchMode: 'contains' },
    createdBy: { value: '', matchMode: 'contains' },
    department: { value: '', matchMode: 'contains' },
    reference: { value: '', matchMode: 'contains' },
    fields: { value: '', matchMode: 'contains' },
    createdAt: { value: '', matchMode: 'contains' },
    'attachments.length': { value: '', matchMode: 'equals' }
  });
  const [nextId, setNextId] = useState<number>(Math.max(...mockData.map(r => r.id)) + 1);
  const dt = useRef<DataTable<DataTableValueArray>>(null);
  const [first, setFirst] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // Revert columns configuration
  const columns = [
    { field: 'templateNo', header: 'Template No.' },
    { field: 'name', header: 'Name' },
    { field: 'revision', header: 'Revision' },
    { field: 'createdBy', header: 'Created By' },
    { field: 'department', header: 'Department' },
    { field: 'reference', header: 'Reference' },
    { field: 'fields', header: 'Fields' },
    { field: 'createdAt', header: 'Created At' },
    { 
      field: 'attachments', 
      header: 'Files',
      body: (rowData: FormTemplate) => (
        <FileUploadCell
          value={rowData.attachments}
          onUpload={(files) => handleUpload(rowData.id, files)}
          onRemove={(file) => handleRemove(rowData.id, file)}
          templateId={rowData.id}
        />
      )
    }
  ];

  // Now initialize state with columns
  const [selectedColumns, setSelectedColumns] = useState<any[]>(columns);

  // Update column options for selection
  const columnOptions = columns.filter(col => col.field !== 'actions');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates');
        // Filter out any null or invalid entries from the API response
        const validData = response.data.filter((item: FormTemplate) => item.id !== null);
        setRows(validData);
        
        // Update nextId based on actual API data
        if (validData.length > 0) {
          const maxId = Math.max(...validData.map((r: FormTemplate) => r.id));
          setNextId(maxId + 1);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Only use mock data if there's no existing data
        if (rows.length === 0) {
          setRows(mockData.filter(item => item.id !== null));
        }
      }
    };
    fetchTemplates();
  }, []);

  const updateBackend = async (updatedRows: FormTemplate[]) => {
    try {
      await axios.put('http://localhost:5000/api/templates', updatedRows);
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  };

  const handleUpload = (id: number, newFiles: FileData[]) => {
    const updatedRows = rows.map(template => 
      template.id === id
        ? { ...template, attachments: [...template.attachments, ...newFiles] }
        : template
    );
    
    setRows(updatedRows);
    updateBackend(updatedRows);
    
    // Show toast notification
    toast.current?.show({
      severity: 'success',
      summary: 'Upload Successful',
      detail: `${newFiles.length} file(s) uploaded`,
      life: 3000
    });
  };

  const handleRemove = (templateId: number, fileToRemove: FileData) => {
    const updatedRows = rows.map(template => 
      template.id === templateId
        ? { 
            ...template, 
            attachments: template.attachments.filter(file => 
              file.storedName !== fileToRemove.storedName
            )
          }
          : template
    );
    
    setRows(updatedRows);
    updateBackend(updatedRows);
  };

  const onRowEditComplete = async (e: any) => {
    const { newData } = e;
    
    // Create new array with updated row
    const updatedRows = rows.map(row => 
      row.id === newData.id ? { ...row, ...newData } : row
    );

    try {
      // Update backend first
      await axios.put('http://localhost:5000/api/templates', updatedRows);
      // Then update local state
      setRows(prev => prev.map(row => 
        row.id === newData.id ? { ...row, ...newData } : row
      ));
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const exportCSV = () => {
    dt.current?.exportCSV({
        selectionOnly: false,
        // Add custom data processing
        exportFunction: (data: any) => {
            const processedData = data.map((row: FormTemplate) => ({
                ...row,
                // Format attachments for CSV
                attachments: row.attachments
                    .map(file => `=HYPERLINK("${file.url}", "${file.originalName}")`)
                    .join(', ')
            }));
            
            return {
                data: processedData,
                fields: selectedColumns.map(col => col.field)
            };
        }
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    const visibleColumns = selectedColumns.length > 0 ? selectedColumns : columns;
    
    const headers = visibleColumns.map(col => col.header);
    const data = rows.map(row => visibleColumns.map(col => 
      col.field === 'attachments.length' ? 
      row.attachments.length.toString() : 
      row[col.field as keyof FormTemplate]?.toString() || ''
    ));
  
    (doc as any).autoTable({
      head: [headers],
      body: data,
      styles: { fontSize: 8 },
      theme: 'grid'
    });
   
    doc.save('form-templates.pdf');
  };

  useEffect(() => {
    if (rows.length > 0) {
      const maxId = Math.max(...rows.map((r: FormTemplate) => r.id));
      setNextId(maxId + 1);
    }
  }, [rows]);

  return (
    <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
      <Toast ref={toast} position="top-right" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Form Templates
        </Typography>
        <div className="flex gap-3">
          <Button
            label="CSV"
            icon="pi pi-file-excel"
            className="p-button-help"
            onClick={exportCSV}
          />
          <Button
            label="PDF"
            icon="pi pi-file-pdf"
            className="p-button-danger"
            onClick={exportPDF}
          />
          <Button
            label="Add New"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => navigate('/templates/new')}
          />
          <MultiSelect
            value={selectedColumns}
            options={columnOptions}
            optionLabel="header"
            placeholder="Select Columns"
            className="w-48"
            onChange={(e) => setSelectedColumns(e.value)}
          />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Global Search"
            className="p-inputtext-sm"
          />
        </div>
      </Box>
      <div className="card">
        <DataTable
          ref={dt}
          value={rows}
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '60rem' }}
          className="p-datatable-responsive"
          filterDisplay="menu"
          globalFilter={globalFilter}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
          first={first}
          onPage={(e) => {
            setFirst(e.first);
            setRowsPerPage(e.rows);
          }}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
        >
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={col.body}
              style={col.field === 'id' ? { width: '70px' } : { width: '130px' }}
              sortable={col.field !== 'id'}
              filter={col.field !== 'id'}
              editor={col.field !== 'attachments' ? (options: ColumnEditorOptions) => {
                const isNumeric = ['id'].includes(col.field);
                return (
                  <InputText
                    value={options.rowData[col.field]}
                    onChange={(e) => {
                      const value = isNumeric ? Number(e.target.value) : e.target.value;
                      (options.editorCallback as (value: any) => void)(value);
                    }}
                  />
                );
              } : undefined}
            />
          ))}
          <Column rowEditor headerStyle={{ width: '10%' }} />
        </DataTable>
      </div>
    </Paper>
  );
};

export default FormTemplateList;
