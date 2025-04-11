import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/authSlice';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UrlForm from './components/url/UrlForm';
import UrlDetail from './components/url/UrlDetail';
import Navbar from './components/layout/Navbar';
import setAuthToken from './utils/setAuthToken';

// Check for token in localStorage and set axios header
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/create" 
              element={isAuthenticated ? <UrlForm /> : <Navigate to="/" />} 
            />
            <Route 
              path="/url/:id" 
              element={isAuthenticated ? <UrlDetail /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;