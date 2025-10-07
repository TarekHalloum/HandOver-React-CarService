import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileSearch, User, MessageSquare, Calendar, Settings } from 'lucide-react';
import '../styles/GarageSidebar.css';

const GarageSidebar = () => {
  return (
    <div className="garage-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">HandOver</h2>
        <p className="sidebar-subtitle">Garage Portal</p>
      </div>

      <nav>
        <ul className="sidebar-nav-list">
          <li><Link className="sidebar-nav-item active" to="/garage"><LayoutDashboard size={18} /> Dashboard</Link></li>
          <li><Link className="sidebar-nav-item" to="/garage/scans"><FileSearch size={18} /> All Scans</Link></li>
          <li><Link className="sidebar-nav-item" to="/garage/calendar"><Calendar size={18} /> Calendar</Link></li>
          <li><Link className="sidebar-nav-item" to="/garage/clients"><User size={18} /> Customers</Link></li>
          <li>
            <Link className="sidebar-nav-item" to="/garage/messages">
              <MessageSquare size={18} /> Messages
              <span className="sidebar-badge">3</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link className="sidebar-nav-item" to="/garage/settings"><Settings size={18} /> Settings</Link>
        <div className="sidebar-profile">
          <div className="sidebar-avatar"><User size={18} /></div>
          <div>
            <p className="sidebar-name">Martin Garage</p>
            <p className="sidebar-role">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageSidebar;
