import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Car, LogIn, LogOut } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import './HistoryPage.css';

export default function HistoryPage() {
  const { activityLog, vehicleLog } = useParking();
  const [activeTab, setActiveTab] = useState('vehicleLog');

  // Sort vehicle log by arrivedAt, putting newest first
  const sortedVehicleLog = [...vehicleLog].sort((a, b) => {
    // Basic string sort since time is formatted as localized string.
    // In a real app we'd use timestamps.
    return b.id.localeCompare(a.id); 
  });

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="section-title">Facility Log Books</h2>
        <div className="history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'vehicleLog' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicleLog')}
          >
            <Car size={16} /> Vehicle Master Log
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activityLog' ? 'active' : ''}`}
            onClick={() => setActiveTab('activityLog')}
          >
            <Activity size={16} /> System Activity Log
          </button>
        </div>
      </div>
      
      {activeTab === 'vehicleLog' && (
        <div className="card log-container">
          <div className="log-summary">
            <div className="summary-stat">
              <span className="stat-label">Total Vehicles Tracked</span>
              <span className="stat-value">{vehicleLog.length}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Currently Parked</span>
              <span className="stat-value">{vehicleLog.filter(v => v.status === 'Parked').length}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Departures</span>
              <span className="stat-value">{vehicleLog.filter(v => v.status === 'Left').length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="log-table vehicle-table">
              <thead>
                <tr>
                  <th>License Plate</th>
                  <th>Spot</th>
                  <th>Status</th>
                  <th><LogIn size={14} className="inline-icon" /> Arrived</th>
                  <th><LogOut size={14} className="inline-icon" /> Departed</th>
                  <th>Duration</th>
                  <th className="text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sortedVehicleLog.map((log, idx) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  >
                    <td className="font-mono font-bold">{log.licensePlate}</td>
                    <td>{log.spotId}</td>
                    <td>
                      <span className={`status-pill ${log.status.toLowerCase()}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="time-col">{log.arrivedAt}</td>
                    <td className="time-col">{log.leftAt}</td>
                    <td>{log.duration}</td>
                    <td className={`text-right ${log.revenue > 0 ? 'text-success font-bold' : 'text-muted'}`}>
                      ₹{log.revenue.toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activityLog' && (
        <div className="card log-container">
          {activityLog.length === 0 ? (
            <div className="empty-state">
              <Activity size={48} className="text-muted" />
              <p>No activity recorded yet today.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="log-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((log, idx) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="time-col">
                        <Clock size={14} /> {log.timestamp}
                      </td>
                      <td>
                        <span className={`type-badge type-${log.type.toLowerCase()}`}>
                          {log.type}
                        </span>
                      </td>
                      <td>{log.description}</td>
                      <td className={`text-right ${log.amount > 0 ? 'text-success' : 'text-muted'}`}>
                        {log.amount > 0 ? `+₹${log.amount.toFixed(2)}` : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
