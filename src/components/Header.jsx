import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParking } from '../context/ParkingContext';
import { Moon, Sun, Car, Bell, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import './Header.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { alerts, simulateEncroachment } = useParking();

  return (
    <header className="header">
      <div className="header-brand">
        <Car size={28} className="brand-icon" />
        <h1>ParkSense</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-outline" onClick={simulateEncroachment}>
          <Play size={16} /> Simulate Encroachment
        </button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="btn-icon"
        >
          <Bell size={20} />
          {alerts.length > 0 && <span className="badge">{alerts.length}</span>}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme} 
          className="btn-icon theme-toggle"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
      </div>
    </header>
  );
}
