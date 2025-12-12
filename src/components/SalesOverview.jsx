import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './SalesOverview.css';

const SalesOverview = () => {
    const data = [
        { month: 'Jan', value1: 200, value2: 150, value3: 100 },
        { month: 'Feb', value1: 180, value2: 170, value3: 120 },
        { month: 'Mar', value1: 250, value2: 200, value3: 180 },
        { month: 'Apr', value1: 300, value2: 250, value3: 200 },
        { month: 'May', value1: 280, value2: 240, value3: 190 },
        { month: 'Jun', value1: 350, value2: 300, value3: 250 },
        { month: 'Jul', value1: 400, value2: 350, value3: 280 },
        { month: 'Aug', value1: 380, value2: 330, value3: 270 },
        { month: 'Sep', value1: 450, value2: 380, value3: 320 },
        { month: 'Oct', value1: 500, value2: 420, value3: 350 },
        { month: 'Nov', value1: 550, value2: 480, value3: 400 },
        { month: 'Dec', value1: 600, value2: 500, value3: 420 },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].payload.month}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`Value: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="sales-overview glass-card fade-in">
            <div className="sales-header">
                <div>
                    <h3 className="sales-title">Sales overview</h3>
                    <p className="sales-subtitle">
                        <span className="growth-indicator positive">+5%</span> more in 2021
                    </p>
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4facfe" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#43e97b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="month"
                            stroke="#718096"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#718096"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value1"
                            stroke="#4facfe"
                            strokeWidth={2}
                            fill="url(#gradient1)"
                        />
                        <Area
                            type="monotone"
                            dataKey="value2"
                            stroke="#667eea"
                            strokeWidth={2}
                            fill="url(#gradient2)"
                        />
                        <Area
                            type="monotone"
                            dataKey="value3"
                            stroke="#43e97b"
                            strokeWidth={2}
                            fill="url(#gradient3)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesOverview;
