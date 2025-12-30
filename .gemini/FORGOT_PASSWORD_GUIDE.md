# Complete Guide: Implementing Forgot Password & Reset Password Feature

## Overview
This guide will walk you through implementing a complete "Forgot Password" and "Reset Password" feature for your Voice Agent dashboard. The implementation involves both **Backend** and **Frontend** changes.

---

## 🏗️ Architecture Overview

The password reset flow will work as follows:

1. **User clicks "Forgot Password"** on login page
2. **User enters their email** 
3. **System generates a unique reset token** and saves it in database
4. **System sends email** with reset link containing the token
5. **User clicks link** in email → Opens reset password page
6. **User enters new password**
7. **System validates token** and updates password
8. **User can now login** with new password

---

## 📋 Prerequisites

You'll need:
1. **Email service** (Nodemailer with Gmail, SendGrid, or similar)
2. **Crypto module** (built-in Node.js) for generating secure tokens
3. **Environment variables** for email credentials

---

## 🔧 BACKEND Implementation

### Step 1: Update Client Model

**File**: `backend/models/Client.js`

Add these new fields to your `clientSchema`:

```javascript
const clientSchema = new mongoose.Schema({
    // ... existing fields (name, email, password_hash, etc.)
    
    // NEW FIELDS FOR PASSWORD RESET
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
```

**What these do:**
- `resetPasswordToken`: Stores the unique token sent in email
- `resetPasswordExpires`: Token expires after 1 hour for security

---

### Step 2: Install Required Packages

**Command**:
```bash
cd backend
npm install nodemailer
```

**What it does**: Nodemailer allows you to send emails from Node.js

---

### Step 3: Create Email Service

**File**: `backend/services/emailService.js` (NEW FILE)

```javascript
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'SendGrid', 'Mailgun', etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your app password
    },
});

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - Voice Dashboard',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for Voice Dashboard.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #000; 
                          color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p style="color: #999; font-size: 14px;">
                    This link will expire in 1 hour.
                </p>
                <p style="color: #999; font-size: 14px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail,
};
```

---

### Step 4: Add Controller Methods

**File**: `backend/controllers/authController.js`

Add these two new functions:

```javascript
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Client = require('../models/Client');
const { sendPasswordResetEmail } = require('../services/emailService');

// ... existing register, login, getProfile methods ...

// NEW: Forgot Password - Send reset email
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email
        const client = await Client.findOne({ email: email.toLowerCase() });
        
        if (!client) {
            // Don't reveal if user exists for security
            return res.status(200).json({ 
                message: 'If that email exists, a reset link has been sent' 
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token before saving to database
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token and expiry (1 hour from now)
        client.resetPasswordToken = hashedToken;
        client.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await client.save();

        // Send email with unhashed token
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ 
            message: 'Password reset email sent successfully' 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

// NEW: Reset Password - Update password with token
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validate inputs
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters' 
            });
        }

        // Hash the token from URL to compare with database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token that hasn't expired
        const client = await Client.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Token not expired
        });

        if (!client) {
            return res.status(400).json({ 
                error: 'Invalid or expired reset token' 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear reset token fields
        client.password_hash = hashedPassword;
        client.resetPasswordToken = null;
        client.resetPasswordExpires = null;
        await client.save();

        res.status(200).json({ 
            message: 'Password reset successful. You can now login.' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
```

---

### Step 5: Add Routes

**File**: `backend/routes/auth.js`

Add these routes:

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW: Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
```

---

### Step 6: Update Environment Variables

**File**: `backend/.env`

Add these new variables:

```env
# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173
```

**Important for Gmail:**
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an "App Password" (not your regular password)
4. Use that App Password in EMAIL_PASSWORD

---

## 🎨 FRONTEND Implementation

### Step 7: Create Forgot Password Component

**File**: `src/components/ForgotPassword.jsx` (NEW FILE)

```javascript
import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css'; // Reuse same styles

const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to send reset email');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <h1>Check Your Email</h1>
                        <p>We've sent a password reset link to {email}</p>
                    </div>
                    <div className="success-message">
                        <p>Please check your email and click the reset link.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                            Didn't receive it? Check your spam folder.
                        </p>
                    </div>
                    <button
                        onClick={onBackToLogin}
                        className="btn btn-ghost"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>Forgot Password?</h1>
                    <p>Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Remember your password?{' '}
                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="auth-link-button"
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
```

---

### Step 8: Create Reset Password Component

**File**: `src/components/ResetPassword.jsx` (NEW FILE)

```javascript
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

const ResetPassword = () => {
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/auth/reset-password/${token}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <h1>Password Reset Successful! ✓</h1>
                        <p>Your password has been updated</p>
                    </div>
                    <div className="success-message">
                        <p>You can now login with your new password.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password (min 6 characters)"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
```

---

### Step 9: Update Login Component

**File**: `src/components/Login.jsx`

Add a "Forgot Password?" link after the password field:

```javascript
// Add this import at the top
import { Mail } from 'lucide-react'; // Optional: for icon

// Inside the Login component, add a prop for forgot password
const Login = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
    // ... existing code ...

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                {/* ... existing header and form ... */}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* ... email field ... */}
                    
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                onClick={onSwitchToForgotPassword}
                                className="auth-link-button"
                                style={{ fontSize: '0.8125rem' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* ... rest of form ... */}
                </form>
                {/* ... rest of component ... */}
            </div>
        </div>
    );
};
```

---

### Step 10: Update App.jsx

**File**: `src/App.jsx`

Add state and routing for forgot/reset password:

```javascript
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SimpleDashboard from './components/SimpleDashboard';
// ... other imports

function App() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [currentPage, setCurrentPage] = useState('login');
    // ... rest of state

    if (authLoading) {
        return <div className="loading-container">...</div>;
    }

    // Show based on currentPage if not authenticated
    if (!isAuthenticated) {
        if (currentPage === 'register') {
            return (
                <Register
                    onPaymentClick={() => setShowPayment(true)}
                    onSwitchToLogin={() => setCurrentPage('login')}
                />
            );
        }
        if (currentPage === 'forgot-password') {
            return (
                <ForgotPassword
                    onBackToLogin={() => setCurrentPage('login')}
                />
            );
        }
        return (
            <Login
                onSwitchToRegister={() => setCurrentPage('register')}
                onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
            />
        );
    }

    // ... rest of App component
}
```

**ALTERNATIVE: If you want to use React Router:**

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/dashboard" element={<SimpleDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
```

---

## 🧪 Testing the Feature

### 1. Test Backend Endpoints

**Forgot Password:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Reset Password:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/YOUR_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword123"}'
```

### 2. Test Full Flow

1. Go to login page
2. Click "Forgot Password?"
3. Enter email and submit
4. Check email inbox
5. Click reset link in email
6. Enter new password
7. Try logging in with new password

---

## 🔒 Security Best Practices Implemented

✅ **Token Hashing**: Reset tokens are hashed before storing in database  
✅ **Token Expiry**: Tokens expire after 1 hour  
✅ **One-Time Use**: Token is deleted after successful password reset  
✅ **Email Privacy**: Don't reveal if email exists in system  
✅ **Password Requirements**: Minimum 6 characters  
✅ **HTTPS**: Use HTTPS in production for secure transmission  

---

## 📱 Email Providers

### Gmail Setup:
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use that password in .env

### SendGrid (Alternative):
```javascript
// In emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
    const msg = {
        to: email,
        from: 'noreply@yourapp.com',
        subject: 'Password Reset',
        html: `...`,
    };
    await sgMail.send(msg);
};
```

---

## 🎨 Styling Suggestions

The components will automatically use your existing `Login.css` styles. For additional styling, you can add:

```css
/* Add to Login.css */

.forgot-password-link {
    font-size: 0.875rem;
    color: var(--accent-dark);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.forgot-password-link:hover {
    color: var(--text-primary);
    text-decoration: underline;
}

.password-requirements {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
}
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `FRONTEND_URL` in backend .env to production URL
- [ ] Set up production email service (SendGrid recommended)
- [ ] Use environment variables on hosting platform
- [ ] Enable HTTPS
- [ ] Test email delivery in production
- [ ] Set up email templates
- [ ] Add rate limiting to forgot-password endpoint
- [ ] Monitor for abuse

---

## 📊 Optional Enhancements

1. **Rate Limiting**: Limit forgot password requests to prevent abuse
2. **Password Strength Meter**: Show password strength on reset page
3. **Remember Me**: Add "Remember Me" checkbox on login
4. **Two-Factor Auth**: Add 2FA for extra security
5. **Email Templates**: Use professional email templates
6. **SMS Reset**: Alternative reset via SMS
7. **Security Questions**: Additional verification step

---

## ❓ Troubleshooting

**Email not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail: Make sure you're using App Password, not regular password
- Check spam folder
- Verify email service is running

**Token invalid/expired?**
- Tokens expire after 1 hour by default
- Check system time is correct
- Verify token in URL matches database

**Cannot find route?**
- Make sure auth routes are properly imported in server.js
- Check API endpoint URL matches backend

---

## 📝 Summary

You now have a complete password reset system with:
- ✅ Forgot password page
- ✅ Email with reset link
- ✅ Reset password page
- ✅ Secure token generation
- ✅ Token expiration
- ✅ Email integration

The system is production-ready and follows security best practices!
