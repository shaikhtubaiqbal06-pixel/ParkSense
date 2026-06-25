import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import SpotDetailsModal from './SpotDetailsModal';
import './LotVisualization.css';

const ParkingSpot = ({ spot, onClick }) => {
  const { SPOT_TYPES } = useParking();
  
  return (
    <motion.div 
      layout
      className={`spot ${spot.status === SPOT_TYPES.ENCROACHED ? 'pulse-danger' : ''} ${spot.status !== SPOT_TYPES.FREE ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: spot.status === SPOT_TYPES.FREE ? 'var(--spot-free)' : 
                         spot.status === SPOT_TYPES.OCCUPIED ? 'var(--spot-occupied)' : 'var(--danger-color)',
        border: `2px dashed ${spot.status === SPOT_TYPES.FREE ? 'var(--success-color)' : 'transparent'}`,
        cursor: spot.status !== SPOT_TYPES.FREE ? 'pointer' : 'default'
      }}
      whileHover={{ scale: 1.05 }}
      onClick={() => spot.status !== SPOT_TYPES.FREE && onClick(spot)}
    >
      <span className="spot-id">{spot.id}</span>
      <AnimatePresence>
        {spot.status !== SPOT_TYPES.FREE && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Car size={32} className={`spot-car ${spot.status === SPOT_TYPES.ENCROACHED ? 'car-danger' : 'car-occupied'}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function LotVisualization() {
  const { spots } = useParking();
  const [selectedSpot, setSelectedSpot] = useState(null);

  return (
    <div className="lot-visualization card">
      <div className="lot-header">
        <h2 className="section-title">Live Lot Map</h2>
        <div className="lot-legend">
          <span className="legend-item"><span className="indicator bg-free"></span> Available</span>
          <span className="legend-item"><span className="indicator bg-occupied"></span> Occupied</span>
          <span className="legend-item"><span className="indicator bg-danger"></span> Encroached</span>
        </div>
      </div>
      
      <div className="lot-grid">
        {spots.map(spot => (
          <ParkingSpot key={spot.id} spot={spot} onClick={setSelectedSpot} />
        ))}
      </div>

      <SpotDetailsModal 
        spot={selectedSpot} 
        onClose={() => setSelectedSpot(null)} 
      />
    </div>
  );
}
