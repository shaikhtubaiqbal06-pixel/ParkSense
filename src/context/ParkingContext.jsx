import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

const SPOT_TYPES = {
  FREE: 'free',
  OCCUPIED: 'occupied',
  ENCROACHED: 'encroached'
};

const generateInitialSpots = (count) => {
  return Array.from({ length: count }).map((_, i) => {
    // Generate some mock details for occupied/encroached spots
    const isOccupied = i % 3 !== 0;
    const isEncroached = i % 25 === 0;
    
    let status = SPOT_TYPES.FREE;
    if (isEncroached) status = SPOT_TYPES.ENCROACHED;
    else if (isOccupied) status = SPOT_TYPES.OCCUPIED;

    return {
      id: i + 1,
      status: status,
      licensePlate: status !== SPOT_TYPES.FREE ? `XYZ-${Math.floor(1000 + Math.random() * 9000)}` : null,
      timeParked: status !== SPOT_TYPES.FREE ? `${Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 60)}m` : null,
      spotType: i < 10 ? 'VIP' : (i % 20 === 0 ? 'Handicap' : 'Regular')
    };
  });
};

const initialSpots = generateInitialSpots(100);

const initialActivityLog = [
  { id: 'log-1', type: 'Payment', description: 'Spot 12 Checked Out', amount: 150, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() }
];

const initialSpotHistory = {
  15: [
    { licensePlate: 'XYZ-1234', duration: '2h 15m', timestamp: new Date(Date.now() - 86400000).toLocaleString() },
    { licensePlate: 'XYZ-1234', duration: '1h 30m', timestamp: new Date(Date.now() - 172800000).toLocaleString() }
  ],
  42: [
    { licensePlate: 'XYZ-1234', duration: '4h 0m', timestamp: new Date(Date.now() - 432000000).toLocaleString() }
  ]
};

const getMockRevenue = (timeStr) => {
  if (!timeStr) return 0;
  const hours = parseInt(timeStr.split('h')[0]) || 0;
  const mins = parseInt(timeStr.split(' ')[1]?.split('m')[0]) || 0;
  const totalHours = hours + (mins / 60);
  return totalHours > 0 ? Math.max(50, totalHours * 50) : 0;
};

const generateInitialVehicleLog = () => {
  return [
    { id: 'vlog-1', licensePlate: 'ABC-9999', spotId: 12, arrivedAt: new Date(Date.now() - 7200000).toLocaleTimeString(), leftAt: new Date(Date.now() - 3600000).toLocaleTimeString(), duration: '1h 0m', revenue: 150, status: 'Left' },
    { id: 'vlog-2', licensePlate: 'XYZ-1234', spotId: 15, arrivedAt: new Date(Date.now() - 14400000).toLocaleTimeString(), leftAt: new Date(Date.now() - 6300000).toLocaleTimeString(), duration: '2h 15m', revenue: 300, status: 'Left' },
    // Add current parked cars to the log
    ...initialSpots.filter(s => s.status !== SPOT_TYPES.FREE).map(s => ({
      id: `vlog-init-${s.id}`,
      licensePlate: s.licensePlate,
      spotId: s.id,
      arrivedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleTimeString(),
      leftAt: '-',
      duration: s.timeParked,
      revenue: getMockRevenue(s.timeParked), // Accrued revenue
      status: 'Parked'
    }))
  ];
};

export const ParkingProvider = ({ children }) => {
  const [spots, setSpots] = useState(initialSpots);
  const [alerts, setAlerts] = useState(() => 
    initialSpots
      .filter(s => s.status === SPOT_TYPES.ENCROACHED)
      .map(s => ({
        id: `alert-${s.id}-${Date.now()}`,
        spotId: s.id,
        time: 'Just now',
        type: s.spotType === 'Handicap' ? 'Unauthorized Handicap Use' : 'Out of Bounds'
      }))
  );
  const [revenue, setRevenue] = useState(25000); // Starting mock revenue in INR
  const [activityLog, setActivityLog] = useState(initialActivityLog);
  const [spotHistory, setSpotHistory] = useState(initialSpotHistory);
  const [vehicleLog, setVehicleLog] = useState(() => generateInitialVehicleLog());

  const addLog = (type, description, amount) => {
    const newLog = {
      id: `log-${Date.now()}`,
      type,
      description,
      amount,
      timestamp: new Date().toLocaleTimeString()
    };
    setActivityLog(prev => [newLog, ...prev]);
  };

  const resolveAlert = (alertId, spotId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setSpots(prev => prev.map(spot => 
      spot.id === spotId ? { ...spot, status: SPOT_TYPES.OCCUPIED } : spot
    ));
    addLog('System', `Alert Resolved for Spot ${spotId}`, 0);
  };

  const issueFine = (alertId, spotId, fineAmount) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setSpots(prev => prev.map(spot => 
      spot.id === spotId ? { ...spot, status: SPOT_TYPES.OCCUPIED } : spot
    ));
    setRevenue(prev => prev + fineAmount);
    addLog('Fine', `Encroachment Fine Issued for Spot ${spotId}`, fineAmount);
    
    // Update revenue in vehicle log if it exists
    setVehicleLog(prev => prev.map(v => 
      v.spotId === spotId && v.status === 'Parked' ? { ...v, revenue: v.revenue + fineAmount } : v
    ));
  };

  const checkoutSpot = (spotId, amountPaid) => {
    // We capture the spot state first
    const spot = spots.find(s => s.id === spotId);
    
    if (spot && spot.licensePlate) {
      setSpotHistory(hist => ({
        ...hist,
        [spotId]: [{
          licensePlate: spot.licensePlate,
          duration: spot.timeParked,
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        }, ...(hist[spotId] || [])]
      }));
      
      // Update vehicle log outside of setSpots
      setVehicleLog(vlog => vlog.map(v => 
        v.spotId === spotId && v.status === 'Parked' 
          ? { ...v, leftAt: new Date().toLocaleTimeString(), status: 'Left', revenue: amountPaid } 
          : v
      ));
    }

    setSpots(prev => prev.map(s => 
      s.id === spotId ? { 
        ...s, 
        status: SPOT_TYPES.FREE, 
        licensePlate: null, 
        timeParked: null 
      } : s
    ));
    
    setRevenue(prev => prev + amountPaid);
    addLog('Payment', `Spot ${spotId} Checked Out`, amountPaid);
  };

  const simulateEncroachment = () => {
    const freeOrOccupiedSpots = spots.filter(s => s.status !== SPOT_TYPES.ENCROACHED);
    if (freeOrOccupiedSpots.length === 0) return;
    
    const randomSpot = freeOrOccupiedSpots[Math.floor(Math.random() * freeOrOccupiedSpots.length)];
    
    setSpots(prev => prev.map(spot => 
      spot.id === randomSpot.id ? { 
        ...spot, 
        status: SPOT_TYPES.ENCROACHED,
        licensePlate: spot.licensePlate || `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
        timeParked: spot.timeParked || '0h 1m'
      } : spot
    ));

    const newAlert = {
      id: `alert-${randomSpot.id}-${Date.now()}`,
      spotId: randomSpot.id,
      time: 'Just now',
      type: randomSpot.spotType === 'VIP' ? 'Unauthorized VIP Use' : 'Improper Parking'
    };
    setAlerts(prev => [newAlert, ...prev]);
    addLog('System', `Simulated Encroachment on Spot ${randomSpot.id}`, 0);
  };

  const stats = {
    total: spots.length,
    available: spots.filter(s => s.status === SPOT_TYPES.FREE).length,
    occupied: spots.filter(s => s.status === SPOT_TYPES.OCCUPIED).length,
    encroached: spots.filter(s => s.status === SPOT_TYPES.ENCROACHED).length,
  };

  return (
    <ParkingContext.Provider value={{ 
      spots, alerts, stats, revenue, activityLog, spotHistory, vehicleLog,
      resolveAlert, issueFine, checkoutSpot, simulateEncroachment, SPOT_TYPES 
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => useContext(ParkingContext);
