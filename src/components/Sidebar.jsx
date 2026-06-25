import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, AlertTriangle, Activity, Settings, UserCircle } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const menuItems = [
    { icon: <UserCircle size={20} />, label: 'Owner Lookup', path: '/' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Map size={20} />, label: 'Lot View', path: '/lot-view' },
    { icon: <AlertTriangle size={20} />, label: 'Alerts', path: '/alerts' },
    { icon: <Activity size={20} />, label: 'History', path: '/history' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
