import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { agentsAPI, executionsAPI } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import SimpleDashboard from './components/SimpleDashboard';
import './App.css';

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [agents, setAgents] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch agents
      const agentsData = await agentsAPI.getAll();
      setAgents(agentsData.agents || []);

      // Fetch executions
      const executionsData = await executionsAPI.getAll();
      setExecutions(executionsData.executions || []);

      // Fetch stats
      const statsData = await executionsAPI.getStats();
      setStats(statsData.stats || {});

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Handle authentication loading
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login/register pages
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <div>
          <Register />
          <button
            onClick={() => setCurrentPage('login')}
            className="page-switch"
          >
            Back to Login
          </button>
        </div>
      );
    }
    return (
      <div>
        <Login />
        <button
          onClick={() => setCurrentPage('register')}
          className="page-switch"
        >
          Create Account
        </button>
      </div>
    );
  }

  return (
    <SimpleDashboard
      agents={agents}
      executions={executions}
      stats={stats}
      loading={loading}
      onRefresh={fetchData}
    />
  );
}

export default App;
