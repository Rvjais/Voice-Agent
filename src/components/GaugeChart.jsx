import React from 'react';
import './GaugeChart.css';

const GaugeChart = ({ percentage, title, subtitle, color = 'blue' }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
        blue: '#4facfe',
        green: '#43e97b',
        purple: '#667eea',
    };

    const strokeColor = colorMap[color] || colorMap.blue;

    return (
        <div className="gauge-chart glass-card fade-in">
            <h3 className="gauge-title">{title}</h3>

            <div className="gauge-container">
                <svg className="gauge-svg" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        className="gauge-bg"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                    />

                    {/* Progress circle */}
                    <circle
                        className="gauge-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                        style={{
                            filter: `drop-shadow(0 0 10px ${strokeColor})`
                        }}
                    />
                </svg>

                <div className="gauge-center">
                    <div className="gauge-icon-wrapper">
                        <div className="gauge-icon" style={{ background: strokeColor }}>
                            😊
                        </div>
                    </div>
                </div>
            </div>

            <div className="gauge-stats">
                <div className="gauge-labels">
                    <span className="gauge-label-min">0%</span>
                    <span className="gauge-label-max">100%</span>
                </div>
                <div className="gauge-value">{percentage}%</div>
                {subtitle && <div className="gauge-subtitle">{subtitle}</div>}
            </div>
        </div>
    );
};

export default GaugeChart;
