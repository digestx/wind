import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import FormTemplateList from './components/FormTemplateList';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';

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
    <Router>
      <Navigation isLoggedIn={false} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <FormTemplateList />
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;
