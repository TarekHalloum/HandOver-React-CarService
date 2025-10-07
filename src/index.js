import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProvider } from './contexts/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider> 
    <App />
  </AuthProvider>
);

reportWebVitals();
