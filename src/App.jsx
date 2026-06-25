import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ParkingProvider } from './context/ParkingContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LotVisualization from './components/LotVisualization';
import EncroachmentAlerts from './components/EncroachmentAlerts';
import HistoryPage from './pages/HistoryPage';
import UserPortal from './pages/UserPortal';
import './App.css';

const SettingsPage = () => (
  <div className="card">
    <h2 className="section-title">Settings</h2>
    <p>Configuration options will go here.</p>
  </div>
);

const AdminLayout = () => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <Header />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<UserPortal />} />
          <Route path="/dashboard" element={
            <div className="dashboard-layout">
              <Dashboard />
              <div className="content-grid">
                <div className="main-col">
                  <LotVisualization />
                </div>
                <div className="side-col">
                  <EncroachmentAlerts />
                </div>
              </div>
            </div>
          } />
          <Route path="/lot-view" element={<LotVisualization />} />
          <Route path="/alerts" element={<EncroachmentAlerts />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/owner" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ParkingProvider>
        <Routes>
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </ParkingProvider>
    </ThemeProvider>
  );
}

export default App;
