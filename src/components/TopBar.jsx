import React from 'react';
import { Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

const TopBar = ({ userName }) => {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="breadcrumb">
                    <span className="breadcrumb-item">Pages</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-item active">Dashboard</span>
                </div>
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="topbar-right">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Type here..."
                        className="search-input"
                    />
                </div>

                <div className="user-info">
                    <User size={18} />
                    <span>{user?.name || userName || 'User'}</span>
                </div>

                <button className="icon-btn icon-only" title="Settings">
                    <Settings size={18} />
                </button>

                <button className="icon-btn icon-only logout-btn" onClick={handleLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
