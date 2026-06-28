import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import './PaymentModal.css';

export default function PaymentModal({ spot, onClose }) {
  const { checkoutSpot } = useParking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock fee calculation based on timeParked
  const calculateFee = () => {
    if (!spot || !spot.timeParked) return 50.00;
    const hours = parseInt(spot.timeParked.split('h')[0]) || 0;
    const mins = parseInt(spot.timeParked.split(' ')[1].split('m')[0]) || 0;
    const totalHours = hours + (mins / 60);
    return Math.max(50.00, (totalHours * 50.00)).toFixed(2);
  };

  const amountDue = calculateFee();

  const handlePayment = (_method) => {
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        checkoutSpot(spot.id, parseFloat(amountDue));
        onClose();
      }, 1500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {spot && (
        <>
          <motion.div 
            className="payment-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
          />
          <motion.div 
            className="payment-modal card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>Checkout Spot {spot.id}</h3>
              {!isProcessing && !success && (
                <button className="btn-icon" onClick={onClose}><X size={20} /></button>
              )}
            </div>

            <div className="payment-body">
              {success ? (
                <motion.div className="payment-success" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  <div className="success-circle">✓</div>
                  <h4>Payment Successful!</h4>
                  <p>Spot {spot.id} is now clear.</p>
                </motion.div>
              ) : isProcessing ? (
                <div className="payment-processing">
                  <div className="spinner"></div>
                  <p>Processing Payment...</p>
                </div>
              ) : (
                <>
                  <div className="amount-display">
                    <span className="amount-label">Amount Due</span>
                    <span className="amount-value">₹{amountDue}</span>
                  </div>
                  
                  <div className="payment-methods">
                    <h4>Select Payment Method</h4>
                    <div className="methods-grid">
                      <button className="method-btn" onClick={() => handlePayment('credit')}>
                        <CreditCard size={24} />
                        <span>Credit Card</span>
                      </button>
                      <button className="method-btn" onClick={() => handlePayment('cash')}>
                        <Banknote size={24} />
                        <span>Cash</span>
                      </button>
                      <button className="method-btn" onClick={() => handlePayment('mobile')}>
                        <Smartphone size={24} />
                        <span>Mobile Pay</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
