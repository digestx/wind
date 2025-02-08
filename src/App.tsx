import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import FormTemplateList from './components/FormTemplateList';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import NewTemplatePage from './components/NewTemplatePage';
import FormsPage from './components/FormsPage';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navigation isLoggedIn={isLoggedIn} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/templates" element={<FormTemplateList />} />
            <Route path="/templates/new" element={<NewTemplatePage />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/forms/drafts" element={<FormsPage type="drafts" />} />
            <Route path="/forms/archived" element={<FormsPage type="archived" />} />
            <Route 
              path="/login" 
              element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 