import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
  GridFilterModel,
  getGridStringOperators,
} from '@mui/x-data-grid';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import FileUploadCell from './FileUploadCell';
import FileUploadModal from './FileUploadModal';

interface FormTemplate {
  id: number;
  templateNo: string;
  name: string;
  revision: string;
  createdBy: string;
  department: string;
  reference: string;
  fields: string;
  createdAt: string;
  attachment: string;
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
    attachment: ''
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
    attachment: ''
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
    attachment: ''
  }
];

const customStringOperators = getGridStringOperators().map((operator) => ({
  ...operator,
  InputComponent: operator.InputComponent,
}));

export const FormTemplateList: React.FC = () => {
  const [rows, setRows] = useState<FormTemplate[]>(mockData);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleFileUpload = (id: number) => (file: File) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === id 
          ? { ...row, attachment: file.name }
          : row
      )
    );
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: '#', 
      width: 70,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'templateNo',
      headerName: 'Template No.',
      width: 130,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 130,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'revision',
      headerName: 'Revision',
      width: 100,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 130,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'reference',
      headerName: 'Reference',
      width: 130,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'fields',
      headerName: 'Fields',
      width: 100,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 160,
      filterable: true,
      filterOperators: customStringOperators,
    },
    {
      field: 'attachment',
      headerName: 'Attachment',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <FileUploadCell
          value={params.value}
          onFileUpload={handleFileUpload(params.row.id)}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Box>
          <IconButton size="small" sx={{ mr: 1 }}>
            <Visibility />
          </IconButton>
          <IconButton size="small" sx={{ mr: 1 }}>
            <Edit />
          </IconButton>
          <IconButton size="small">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
      <Typography
        sx={{ flex: '1 1 100%', mb: 2 }}
        variant="h6"
        component="div"
      >
        Form Templates
      </Typography>
      <Button variant="contained" onClick={handleOpenModal}>Upload Files</Button>
      <FileUploadModal open={modalOpen} onClose={handleCloseModal} onFilesChange={() => {}} />
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: [],
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          filterMode="client"
          disableColumnSelector={false}
          disableDensitySelector={false}
          disableColumnFilter={false}
          disableColumnMenu={false}
          density="standard"
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Box>
    </Paper>
  );
};
