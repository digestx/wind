import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import { FormTemplateList } from './components/FormTemplateList';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5'
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <FormTemplateList />
      </Container>
    </ThemeProvider>
  );
};

export default App;
