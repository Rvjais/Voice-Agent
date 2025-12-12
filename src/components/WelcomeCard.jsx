import React from 'react';
import './WelcomeCard.css';

const WelcomeCard = ({ userName = "Mark Johnson" }) => {
    return (
        <div className="welcome-card glass-card fade-in">
            <div className="welcome-overlay"></div>
            <div className="welcome-content">
                <div className="welcome-text">
                    <span className="welcome-label">Welcome back,</span>
                    <h2 className="welcome-name">{userName}</h2>
                    <p className="welcome-message">Glad to see you again!</p>
                    <p className="welcome-sub">Ask me anything.</p>
                </div>

                <div className="welcome-action">
                    <span className="tap-text">Tap to restart →</span>
                </div>
            </div>

            <div className="welcome-brain">
                <img
                    src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&auto=format&fit=crop&q=60"
                    alt="Brain illustration"
                    className="brain-image"
                />
            </div>
        </div>
    );
};

export default WelcomeCard;
