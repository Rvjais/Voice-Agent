import React from 'react';
import { TrendingUp } from 'lucide-react';
import './OrdersOverview.css';

const OrdersOverview = () => {
    const orders = [
        {
            icon: '🔔',
            title: '$2400, Design changes',
            time: '22 DEC 7:20 PM',
            color: 'green',
        },
        {
            icon: '🎨',
            title: 'New order #4219423',
            time: '21 DEC 11:21 PM',
            color: 'red',
        },
        {
            icon: '🛒',
            title: 'Server Payments for April',
            time: '21 DEC 9:28 PM',
            color: 'blue',
        },
        {
            icon: '💳',
            title: 'New card added for order #3210145',
            time: '20 DEC 3:52 PM',
            color: 'orange',
        },
        {
            icon: '🔓',
            title: 'Unlock packages for Development',
            time: '19 DEC 11:35 PM',
            color: 'purple',
        },
    ];

    return (
        <div className="orders-overview glass-card fade-in">
            <div className="orders-header">
                <h3 className="orders-title">Orders overview</h3>
                <p className="orders-subtitle">
                    <TrendingUp size={16} className="trend-icon" />
                    <span className="growth-text">+30%</span> this month
                </p>
            </div>

            <div className="orders-timeline">
                {orders.map((order, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-line">
                            <div className={`timeline-dot ${order.color}`}>
                                {order.icon}
                            </div>
                            {index < orders.length - 1 && <div className="timeline-connector"></div>}
                        </div>
                        <div className="timeline-content">
                            <h4 className="order-title">{order.title}</h4>
                            <p className="order-time">{order.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersOverview;
