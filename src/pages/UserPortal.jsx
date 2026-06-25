import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import loginBg from '../assets/login-bg.png';
import './UserPortal.css';

const UserPortal = () => {
  const [licensePlateInput, setLicensePlateInput] = useState('');
  const [loggedInPlate, setLoggedInPlate] = useState(null);
  const navigate = useNavigate();
  const { spots, spotHistory } = useParking();

  const handleLogin = (e) => {
    e.preventDefault();
    if (licensePlateInput.trim() !== '') {
      setLoggedInPlate(licensePlateInput.toUpperCase());
    }
  };

  const handleLogout = () => {
    setLoggedInPlate(null);
    setLicensePlateInput('');
  };

  const activeSession = useMemo(() => {
    if (!loggedInPlate) return null;
    return spots.find(s => s.licensePlate === loggedInPlate);
  }, [spots, loggedInPlate]);

  const pastSessions = useMemo(() => {
    if (!loggedInPlate) return [];
    let history = [];
    Object.keys(spotHistory).forEach(spotId => {
      const records = spotHistory[spotId];
      records.forEach(record => {
        if (record.licensePlate === loggedInPlate) {
          history.push({
            spotId,
            ...record
          });
        }
      });
    });
    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [spotHistory, loggedInPlate]);

  if (!loggedInPlate) {
    return (
      <div className="login-page-container" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="login-overlay"></div>
        
        <div className="portal-content-wrapper">
          <div className="rules-section glass-panel">
            <h3 className="rules-title"><span className="icon">📋</span> Facility Rules</h3>
            <ul className="rules-list">
              <li>
                <strong>Max Speed Limit:</strong> 15 km/h strictly enforced.
              </li>
              <li>
                <strong>Parking Zones:</strong> Park only in designated white-lined spots.
              </li>
              <li>
                <strong>Reserved Parking:</strong> Do not park in VIP or Handicap spots without authorization. Fines apply.
              </li>
              <li>
                <strong>Overnight Parking:</strong> Not permitted unless explicitly registered.
              </li>
              <li>
                <strong>Valuables:</strong> Management is not responsible for lost or stolen items.
              </li>
            </ul>
          </div>

          <div className="login-content">
            <div className="brand-logo">
              <span className="logo-icon">🅿️</span>
              <span className="logo-text">ParkSense</span>
            </div>
            
            <div className="login-card glass-panel">
              <h2 className="login-title">Owner Portal</h2>
              <p className="login-subtitle">Enter your license plate to view your parking history and active sessions.</p>
              
              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="licensePlate">License Plate Number</label>
                  <input 
                    type="text" 
                    id="licensePlate" 
                    value={licensePlateInput}
                    onChange={(e) => setLicensePlateInput(e.target.value.toUpperCase())}
                    placeholder="e.g. XYZ-1234"
                    required 
                    autoComplete="off"
                  />
                </div>
                
                <button type="submit" className="login-btn btn-primary">
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-overlay"></div>
      
      <div className="dashboard-content-wrapper">
        <nav className="user-nav glass-panel-nav">
          <div className="brand-logo" onClick={handleLogout}>
            <span className="logo-icon">🅿️</span>
            <span className="logo-text">ParkSense</span>
          </div>
          <div className="user-nav-actions">
            <span className="user-badge">{loggedInPlate}</span>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </nav>

        <main className="user-main-content">
          <header className="dashboard-header">
            <h1>Welcome Back!</h1>
            <p>Here is the parking history for vehicle <strong>{loggedInPlate}</strong>.</p>
          </header>

          <section className="dashboard-section">
            <h2>Active Session</h2>
            {activeSession ? (
              <div className="status-card active-status glass-panel">
                <div className="status-header">
                  <span className="status-dot pulsing"></span>
                  <h3>Currently Parked</h3>
                </div>
                <div className="status-details">
                  <div className="detail-item">
                    <span className="detail-label">Spot ID</span>
                    <span className="detail-value">{activeSession.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Spot Type</span>
                    <span className="detail-value">{activeSession.spotType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time Parked</span>
                    <span className="detail-value">{activeSession.timeParked}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="status-card inactive-status glass-panel">
                <div className="status-header">
                  <span className="status-dot gray"></span>
                  <h3>Not Currently Parked</h3>
                </div>
                <p>Your vehicle is not currently parked in our facility.</p>
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Past Parking History</h2>
            {pastSessions.length > 0 ? (
              <div className="history-list">
                {pastSessions.map((session, index) => (
                  <div key={index} className="history-item glass-panel">
                    <div className="history-date">
                      <span className="calendar-icon">📅</span>
                      {session.timestamp}
                    </div>
                    <div className="history-details">
                      <div className="detail-pill">
                        <span className="pill-label">Spot</span>
                        <span className="pill-value">{session.spotId}</span>
                      </div>
                      <div className="detail-pill">
                        <span className="pill-label">Duration</span>
                        <span className="pill-value">{session.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state glass-panel">
                <div className="empty-icon">📭</div>
                <p>No past parking history found for this vehicle.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserPortal;
