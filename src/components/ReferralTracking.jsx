import React from 'react';
import './ReferralTracking.css';

const ReferralTracking = () => {
    const score = 9.3;
    const total = 10;
    const percentage = (score / total) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="referral-tracking glass-card fade-in">
            <h3 className="referral-title">Referral Tracking</h3>

            <div className="referral-stats">
                <div className="stat-item">
                    <span className="stat-label">Invited</span>
                    <span className="stat-number">145 people</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-label">Bonus</span>
                    <span className="stat-number">1,465</span>
                </div>
            </div>

            <div className="gauge-container-referral">
                <svg className="gauge-svg" viewBox="0 0 100 100">
                    <circle
                        className="gauge-bg"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                    />
                    <circle
                        className="gauge-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#43e97b"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                        style={{
                            filter: 'drop-shadow(0 0 10px #43e97b)'
                        }}
                    />
                </svg>

                <div className="gauge-center">
                    <div className="score-wrapper">
                        <div className="score-value">{score}</div>
                        <div className="score-label">Total Score</div>
                    </div>
                </div>
            </div>

            <div className="safety-label">Safety</div>
        </div>
    );
};

export default ReferralTracking;
