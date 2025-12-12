import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, title, value, change, changeType = 'positive' }) => {
    return (
        <div className="stat-card glass-card fade-in">
            <div className="stat-icon-wrapper">
                <div className="stat-icon">{icon}</div>
            </div>

            <div className="stat-content">
                <div className="stat-header">
                    <span className="stat-title">{title}</span>
                    {change && (
                        <span className={`stat-change ${changeType}`}>
                            {changeType === 'positive' ? '+' : ''}{change}
                        </span>
                    )}
                </div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
};

export default StatCard;
