import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Clock, ShieldAlert, CreditCard, History } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import PaymentModal from './PaymentModal';
import './SpotDetailsModal.css';

export default function SpotDetailsModal({ spot, onClose }) {
  const { SPOT_TYPES, spotHistory } = useParking();
  const [showPayment, setShowPayment] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  const handleClosePayment = () => {
    setShowPayment(false);
    onClose(); // Close both modals
  };

  const historyRecords = spot ? (spotHistory[spot.id] || []) : [];

  return (
    <>
      <AnimatePresence>
        {spot && !showPayment && (
          <>
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div 
              className="modal-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="modal-header">
                <h3>Spot {spot.id} {viewHistory ? 'History' : 'Details'}</h3>
                <div className="flex gap-2">
                  <button className="btn-icon" onClick={() => setViewHistory(!viewHistory)} title="Toggle History">
                    <History size={20} className={viewHistory ? 'text-primary' : ''} />
                  </button>
                  <button className="btn-icon" onClick={onClose}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="modal-body overflow-y-auto">
                {viewHistory ? (
                  <div className="history-view">
                    {historyRecords.length === 0 ? (
                      <div className="text-center text-muted mt-4">
                        <p>No history recorded for this spot yet.</p>
                      </div>
                    ) : (
                      <div className="history-list">
                        {historyRecords.map((record, idx) => (
                          <div key={idx} className="history-record">
                            <div className="history-record-header">
                              <strong>{record.licensePlate}</strong>
                              <span className="text-muted text-sm">{record.timestamp}</span>
                            </div>
                            <div className="text-sm">Parked for: {record.duration}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="detail-status">
                      <span className={`status-badge ${spot.status === SPOT_TYPES.ENCROACHED ? 'danger' : spot.status === SPOT_TYPES.FREE ? 'success' : 'warning'}`}>
                        {spot.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <Car className="detail-icon" />
                      <div className="detail-text">
                        <span className="label">License Plate</span>
                        <span className="value">{spot.licensePlate || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <div className="detail-text">
                        <span className="label">Time Parked</span>
                        <span className="value">{spot.timeParked || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <ShieldAlert className="detail-icon" />
                      <div className="detail-text">
                        <span className="label">Spot Type</span>
                        <span className="value">{spot.spotType}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                {!viewHistory && spot.status !== SPOT_TYPES.FREE ? (
                  <button 
                    className="btn btn-primary w-full" 
                    onClick={() => setShowPayment(true)}
                  >
                    <CreditCard size={18} /> Checkout & Pay
                  </button>
                ) : (
                  <button className="btn btn-outline w-full" onClick={onClose}>Close</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {showPayment && spot && (
        <PaymentModal spot={spot} onClose={handleClosePayment} />
      )}
    </>
  );
}
