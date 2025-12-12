import React from 'react';
import { Home, Table, FileText, Repeat, User, LogIn, UserPlus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <Table size={20} />, label: 'Voice Data', active: false },
    { icon: <FileText size={20} />, label: 'Cost', active: false },
  ];

  const accountItems = [
    { icon: <User size={20} />, label: 'Profile' },
    { icon: <LogIn size={20} />, label: 'Sign In' },
    { icon: <UserPlus size={20} />, label: 'Sign Up' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <div className="logo-dot"></div>
          </div>
          <span className="logo-text">Voice-Agent Dashboard</span>
        </div>
        <div className="divider"></div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.active && <div className="active-indicator"></div>}
            </a>
          ))}
        </div>

        <div className="nav-section">
          <div className="section-title">ACCOUNT PAGES</div>
          {accountItems.map((item, index) => (
            <a key={index} href="#" className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="help-card glass-card">
          <div className="help-icon">?</div>
          <h4>Need help?</h4>
          <p>Please check our docs</p>
          <button className="btn btn-primary btn-sm">DOCUMENTATION</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
