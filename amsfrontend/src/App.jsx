import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from './utils/axiosInstance'; // ✅ Axios import

import Login from './components/login.jsx';
import Signup from './components/Signup.jsx';
import Summary from './components/Summary.jsx';
import EditPanel from './components/EditPanel.jsx';
import Dashboard from './components/Dashboard.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import AssetLog from './components/AssetLog.jsx';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get('/assets')
        .then((res) => setAssets(res.data))
        .catch((err) => console.error('Error fetching assets:', err));
    }
  }, [user]);

  return (
    <Router>
      <div className="bg-blue-500 text-white p-4 rounded">
        <div className="bg-green-200 text-center p-4 rounded">
          <h1 className="text-2xl font-bold text-blue-700">
            Asset Management Prioritisation System
          </h1>
        </div>
        <h1 className="text-3xl font-bold mb-4">ECSL AMS Dashboard</h1>

        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login route */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={(role) => setUser({ username: 'user', role })} />
              )
            }
          />

          {/* Signup route */}
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup />
              )
            }
          />

          {/* Forgot Password */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Reset Password */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <>
                  <Dashboard user={user} />
                  <Summary />
                  <AssetLog user={user} assets={assets} />
                  {user.role === 'admin' && <EditPanel />}
                  <h2 className="text-xl font-semibold mt-6 mb-2">Raw Asset List</h2>
                  <ul>
                    {assets.map((asset) => (
                      <li key={asset.id} className="mb-2">
                        {asset.name} — {asset.location}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Separate Asset Log Page */}
          <Route
            path="/asset-log"
            element={
              user ? (
                <AssetLog user={user} assets={assets} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;