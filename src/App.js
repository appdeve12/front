// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './container/Login/Login';
import Dashboard from './components/layout/Dashboard';
import SentMessages from './container/SentMessages/SentMessages';
 // 👈 import

import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/PrivateRoute';
import Help from './container/Help/Help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/sent"
          element={
            <PrivateRoute>
              <SentMessages />
            </PrivateRoute>
          }
        />
          <Route
          path="/help"
          element={
            <PrivateRoute>
              <Help/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
