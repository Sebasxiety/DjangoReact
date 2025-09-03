import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import MainLayout from './layouts/MainLayout';

function App() {
  const [token, setTokenState] = useState(localStorage.getItem('accessToken'));
  const navigate = useNavigate();
  const location = useLocation();

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    setTokenState(newToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (location.pathname === '/login') {
        navigate('/');
      }
    } else {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [token, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route 
        path="/*" 
        element={
          token ? (
            <MainLayout setToken={setToken} />
          ) : (
            // Redirige a login si no hay token
            <></> // No renderiza nada mientras redirige
          )
        } 
      />
    </Routes>
  );
}

export default App;