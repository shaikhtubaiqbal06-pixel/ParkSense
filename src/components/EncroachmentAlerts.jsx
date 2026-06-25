import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Check, FileWarning } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import './EncroachmentAlerts.css';

export default function EncroachmentAlerts() {
  const { alerts, resolveAlert, issueFine } = useParking();

  return (
    <div className="encroachment-alerts card">
      <div className="alerts-header">
        <h2 className="section-title">Active Alerts</h2>
        <span className="badge-danger">{alerts.length}</span>
      </div>
      
      <div className="alerts-list">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <Check size={48} className="success-icon" />
              <p>All clear! No active encroachments.</p>
            </motion.div>
          ) : (
            alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="alert-item"
              >
                <div className="alert-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="alert-content">
                  <h4>Spot {alert.spotId} - {alert.type}</h4>
                  <div className="alert-meta">
                    <MapPin size={14} /> {alert.time}
                  </div>
                </div>
                <div className="alert-actions-col">
                  <button className="btn btn-outline btn-sm w-full" onClick={() => resolveAlert(alert.id, alert.spotId)}>
                    Resolve Only
                  </button>
                  <button className="btn btn-danger btn-sm w-full" onClick={() => issueFine(alert.id, alert.spotId, 500)}>
                    <FileWarning size={14} /> Issue ₹500 Fine
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
