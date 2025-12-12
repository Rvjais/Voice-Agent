import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, MousePointer, ShoppingCart, Package } from 'lucide-react';
import './ActiveUsers.css';

const ActiveUsers = () => {
    const chartData = [
        { month: 'M', value: 400 },
        { month: 'T', value: 300 },
        { month: 'W', value: 200 },
        { month: 'T', value: 280 },
        { month: 'F', value: 390 },
        { month: 'S', value: 350 },
        { month: 'S', value: 400 },
    ];

    const metrics = [
        { icon: <Users size={18} />, label: 'Users', value: '32,984', color: 'blue' },
        { icon: <MousePointer size={18} />, label: 'Clicks', value: '2.42m', color: 'blue' },
        { icon: <ShoppingCart size={18} />, label: 'Sales', value: '2,400$', color: 'blue' },
        { icon: <Package size={18} />, label: 'Items', value: '320', color: 'blue' },
    ];

    return (
        <div className="active-users glass-card fade-in">
            <h3 className="active-users-title">Active Users</h3>
            <p className="active-users-subtitle">(+23) than last week</p>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#718096"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#718096"
                            style={{ fontSize: '0.75rem' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="value"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                        />
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                        <div className="metric-icon" style={{ background: `var(--gradient-${metric.color})` }}>
                            {metric.icon}
                        </div>
                        <div className="metric-info">
                            <div className="metric-label">{metric.label}</div>
                            <div className="metric-value">{metric.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUsers;
