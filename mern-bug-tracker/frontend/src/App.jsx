import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import BugList from './components/bugs/BugList';
import BugDetail from './components/bugs/BugDetail';
import BugForm from './components/bugs/BugForm';
import NotFound from './components/layout/NotFound';

/**
 * Main application component with routing
 * @returns {JSX.Element} Main application component
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Bug routes */}
          <Route path="/bugs" element={<BugList />} />
          <Route path="/bugs/new" element={<BugForm />} />
          <Route path="/bugs/:id" element={<BugDetail />} />
          
          {/* Redirect legacy URLs */}
          <Route path="/issues" element={<Navigate to="/bugs" replace />} />
          <Route path="/issues/:id" element={<Navigate to="/bugs/:id" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;