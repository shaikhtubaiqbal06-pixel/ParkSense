import React from 'react';
import { motion } from 'framer-motion';
import { Car, CheckCircle, AlertOctagon, DollarSign } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import './Dashboard.css';

const StatCard = ({ title, value, icon, colorClass, delay, prefix = '' }) => (
  <motion.div 
    className="card stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="stat-icon" style={{ backgroundColor: `var(--${colorClass})`, opacity: 0.2 }}></div>
    <div className="stat-content">
      <h3>{title}</h3>
      <motion.div 
        className="stat-value"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: delay + 0.2 }}
      >
        {prefix}{value}
      </motion.div>
    </div>
    <div className="stat-icon-overlay" style={{ color: `var(--${colorClass})` }}>
      {icon}
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { stats, revenue } = useParking();

  return (
    <div className="dashboard">
      <h2 className="section-title">Overview</h2>
      <div className="stats-grid">
        <StatCard title="Total Spots" value={stats.total} icon={<Car size={24} />} colorClass="primary-color" delay={0.1} />
        <StatCard title="Available" value={stats.available} icon={<CheckCircle size={24} />} colorClass="success-color" delay={0.2} />
        <StatCard title="Occupied" value={stats.occupied} icon={<Car size={24} />} colorClass="warning-color" delay={0.3} />
        <StatCard title="Encroached" value={stats.encroached} icon={<AlertOctagon size={24} />} colorClass="danger-color" delay={0.4} />
        <StatCard title="Today's Revenue" value={revenue.toLocaleString('en-IN')} prefix="₹" icon={<DollarSign size={24} />} colorClass="primary-color" delay={0.5} />
      </div>
    </div>
  );
}
