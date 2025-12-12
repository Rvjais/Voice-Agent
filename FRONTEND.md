# Voice Dashboard - Frontend Documentation

Modern React dashboard with authentication, API integration, and real-time data visualization.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 📁 Project Structure

```
src/
├── components/              # React Components
│   ├── Sidebar.jsx         # Left navigation
│   ├── TopBar.jsx          # Header with search & logout
│   ├── Login.jsx           # Login form
│   ├── Register.jsx        # Registration form
│   ├── StatCard.jsx        # Metric cards
│   ├── WelcomeCard.jsx     # Hero card
│   ├── GaugeChart.jsx      # Circular progress
│   ├── ReferralTracking.jsx # Score display
│   ├── SalesOverview.jsx   # Area chart
│   ├── ActiveUsers.jsx     # Bar chart
│   ├── ProjectsTable.jsx   # Data table
│   └── OrdersOverview.jsx  # Timeline
│
├── context/
│   └── AuthContext.jsx     # Authentication state
│
├── services/
│   └── api.js              # API client (axios)
│
├── App.jsx                 # Main application
├── App.css                 # Layout styles
├── main.jsx                # Entry point
└── index.css               # Design system
```

---

## 🎨 Features

### ✅ Authentication
- **Login** - Email/password authentication
- **Register** - New user signup with validation
- **Logout** - Clear session and redirect
- **JWT Tokens** - Stored in localStorage
- **Auto-redirect** - On 401 errors

### ✅ Dashboard
- **Real-time stats** - From backend API
- **Charts** - Area and bar charts with Recharts
- **Tables** - Execution logs display
- **Loading states** - Smooth UX
- **Error handling** - User-friendly messages

### ✅ Design
- **Glassmorphic UI** - Modern dark theme
- **Purple/Blue gradients** - Premium look
- **Smooth animations** - Fade-in effects
- **Responsive** - Mobile-friendly
- **Custom fonts** - Inter from Google Fonts

---

## 🔐 Authentication Flow

### 1. User Registration
```javascript
// User fills registration form
const { name, email, password } = formData;

// API call
const result = await authAPI.register(name, email, password);

// On success:
// - JWT token saved to localStorage
// - User object saved to localStorage
// - Redirect to dashboard
```

### 2. User Login
```javascript
// User fills login form
const { email, password } = formData;

// API call
const result = await authAPI.login(email, password);

// On success:
// - JWT token saved
// - User data saved
// - Dashboard loads
```

### 3. Protected Routes
```javascript
// App.jsx checks authentication
if (!isAuthenticated) {
  return <Login />;
}

// If authenticated, show dashboard
return <Dashboard />;
```

### 4. Logout
```javascript
// User clicks logout
authAPI.logout();

// Clears:
// - localStorage token
// - localStorage user
// - Redirects to login
```

---

## 🌐 API Integration

### Service Layer: `src/services/api.js`

#### Setup
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### Authentication API
```javascript
import { authAPI } from './services/api';

// Register
await authAPI.register(name, email, password);

// Login
await authAPI.login(email, password);

// Get profile
await authAPI.getProfile();

// Logout
authAPI.logout();
```

#### Agents API
```javascript
import { agentsAPI } from './services/api';

// Get all agents
const { agents } = await agentsAPI.getAll();

// Get agent by ID
const { agent } = await agentsAPI.getById(agentId);

// Create agent
await agentsAPI.create({
  bolna_agent_id: "agent-123",
  name: "My Agent"
});

// Update agent
await agentsAPI.update(agentId, { name: "New Name" });

// Delete agent
await agentsAPI.delete(agentId);
```

#### Executions API
```javascript
import { executionsAPI } from './services/api';

// Get all executions
const { executions } = await executionsAPI.getAll();

// With filters
const { executions } = await executionsAPI.getAll({
  from: '2024-01-01',
  to: '2024-12-31',
  status: 'completed',
  agentId: 'xxx'
});

// Get statistics
const { stats } = await executionsAPI.getStats();

// Get execution details
const { execution } = await executionsAPI.getById(executionId);
```

---

## 🎯 Components Usage

### App.jsx - Main Application
```javascript
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const agentsData = await agentsAPI.getAll();
    const executionsData = await executionsAPI.getAll();
    const statsData = await executionsAPI.getStats();
    
    setAgents(agentsData.agents);
    setExecutions(executionsData.executions);
    setStats(statsData.stats);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show dashboard
  return <Dashboard data={{ agents, executions, stats }} />;
}
```

---

### AuthContext - Global State
```javascript
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrap app with provider
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
const { user, login, logout, isAuthenticated } = useAuth();
```

---

### Login Component
```javascript
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={...} />
      <input type="password" value={password} onChange={...} />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

### Dashboard Components

#### StatCard - Metric Display
```javascript
<StatCard
  icon={<Wallet size={20} />}
  title="Today's Calls"
  value={123}
  change="+5%"
  changeType="positive"
/>
```

#### SalesOverview - Chart
```javascript
<SalesOverview executions={executions} />
```

#### ProjectsTable - Data Table
```javascript
<ProjectsTable executions={executions} />
```

---

## 🎨 Styling System

### CSS Custom Properties
```css
/* Design system in index.css */

:root {
  /* Colors */
  --bg-primary: #0b0e27;
  --bg-secondary: #0f1535;
  --accent-purple: #667eea;
  --accent-blue: #4facfe;
  --accent-green: #43e97b;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Typography */
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  
  /* Effects */
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --radius-lg: 16px;
}
```

### Glassmorphic Cards
```css
.glass-card {
  background: rgba(15, 21, 53, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop: default */
.stats-row {
  grid-template-columns: repeat(4, 1fr);
}

/* Tablet */
@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    margin-left: 0;
  }
}
```

---

## 🔧 Configuration

### Environment Variables
```env
# .env
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://your-api.com/api
```

### Vite Config
```javascript
// vite.config.js (default)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
# Server: http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Dependencies

### Core
- **react** - UI library
- **vite** - Build tool
- **axios** - HTTP client

### UI Libraries
- **recharts** - Charts and graphs
- **lucide-react** - Icon library

### Styling
- **CSS3** - Custom properties and animations

---

## 🚢 Production Deployment

### Build
```bash
npm run build
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Build command: npm run build
# Publish directory: dist
```

### Environment Variables
Set in deployment platform:
```
VITE_API_URL=https://your-backend.com/api
```

---

## 🐛 Troubleshooting

### "Failed to resolve import"
**Problem:** Module not found

**Solution:**
```bash
npm install
# Check import paths (use ./ not ../)
```

---

### API Calls Failing
**Problem:** Network errors or CORS

**Solution:**
1. Check backend is running: `http://localhost:5000/health`
2. Verify `VITE_API_URL` in `.env`
3. Check backend CORS settings
4. Restart dev server after changing `.env`

---

### Not Redirecting to Dashboard After Login
**Problem:** Auth state not updating

**Solution:**
1. Check localStorage has token: `localStorage.getItem('token')`
2. Check AuthContext is wrapped around App
3. Check browser console for errors

---

### Blank Page / White Screen
**Problem:** JavaScript error

**Solution:**
1. Open browser console
2. Check for import errors
3. Verify all components are exported correctly

---

## 🎯 Best Practices

### ✅ Do
- Store JWT token in localStorage
- Use AuthContext for global state
- Handle loading states
- Show user-friendly errors
- Clear tokens on logout
- Validate forms client-side

### ❌ Don't
- Store sensitive data in frontend
- Hardcode API URLs
- Ignore error responses
- Skip loading indicators
- Leave console.logs in production

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify backend is running
3. Test API with curl
4. Clear localStorage and try again

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Port:** 5173 (dev) | Any (production)
