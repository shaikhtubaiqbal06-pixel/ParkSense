import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { RefreshCw, Car, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import './FuturisticDashboard.css';

export default function FuturisticDashboard() {
  const { stats, spots, SPOT_TYPES } = useParking();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // AI Prediction Logic
  const occupancyRate = stats.total > 0 ? (stats.occupied / stats.total) * 100 : 0;
  let trafficStatus = 'Low';
  let trafficClass = 'status-low';
  let trafficIcon = '🟢';
  let trafficDesc = 'Optimal parking conditions. Plenty of space available.';

  if (occupancyRate > 80) {
    trafficStatus = 'High';
    trafficClass = 'status-high';
    trafficIcon = '🔴';
    trafficDesc = 'Lot is nearly full. Expect delays in finding a spot.';
  } else if (occupancyRate > 50) {
    trafficStatus = 'Moderate';
    trafficClass = 'status-moderate';
    trafficIcon = '🟡';
    trafficDesc = 'Moderate traffic. Spots are filling up steadily.';
  }

  return (
    <div className="futuristic-dashboard">
      
      {/* Header */}
      <header className="fd-header glass-card">
        <div className="fd-title-group">
          <h1 className="fd-title">Smart Parking Optimization System</h1>
          <h2 className="fd-subtitle">
            <span>Real-time Monitor - Mira-Bhayandar</span>
            <div className="live-indicator">
              <div className="live-dot"></div> LIVE
            </div>
          </h2>
        </div>
        <div className="fd-controls">
          <button className="refresh-btn" onClick={handleRefresh}>
            <RefreshCw size={18} className={`refresh-icon ${isRefreshing ? 'spin' : ''}`} />
            Sync Data
          </button>
          <span className="timestamp">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="fd-summary-grid">
        <div className="glass-card summary-card total">
          <div className="title"><Activity size={20} /> Total Slots</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="glass-card summary-card available">
          <div className="title"><CheckCircle size={20} /> Available</div>
          <div className="value">{stats.available}</div>
        </div>
        <div className="glass-card summary-card occupied">
          <div className="title"><Car size={20} /> Occupied / Encroached</div>
          <div className="value">{stats.occupied + stats.encroached}</div>
        </div>
      </div>

      <div className="fd-main-grid">
        {/* Parking Grid */}
        <div className="glass-card parking-grid-container">
          <div className="parking-grid-header">
            Lot Map Visualization
          </div>
          <div className="spots-grid">
            {spots.map((spot) => {
              const isFree = spot.status === SPOT_TYPES.FREE;
              const isEncroached = spot.status === SPOT_TYPES.ENCROACHED;
              return (
                <div 
                  key={spot.id} 
                  className={`spot ${isFree ? 'available' : 'occupied'}`}
                  style={isEncroached ? { borderColor: '#f59e0b', color: '#f59e0b', boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.2)' } : {}}
                >
                  <span className="spot-label">{spot.id}</span>
                  <div className="spot-icon">
                    {isFree ? 'Free' : (isEncroached ? <AlertTriangle size={24}/> : <Car size={24} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Prediction */}
        <div className="glass-card ai-prediction">
          <div className="ai-header">
            AI Traffic Analysis
          </div>
          <div className="ai-status">
            <span className="ai-icon">{trafficIcon}</span>
            <div className="ai-info">
              <h4>{trafficStatus} Traffic</h4>
              <p>{trafficDesc}</p>
            </div>
          </div>
          <div className={`ai-progress-container ${trafficClass}`}>
            <div className="ai-progress-label">
              <span>Occupancy Probability</span>
              <span>{Math.round(occupancyRate)}%</span>
            </div>
            <div className="ai-progress-bar">
              <div 
                className="ai-progress-fill" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
