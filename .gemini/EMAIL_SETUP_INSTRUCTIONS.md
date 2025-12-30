# 🔧 Environment Variables Setup for Password Reset

## IMPORTANT: Email Configuration Required

To use the password reset feature, you need to add these environment variables to your backend `.env` file:

---

## 📧 For Gmail (Recommended for Development)

Add these lines to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173
```

### How to Get Gmail App Password:

1. **Enable 2-Factor Authentication** on your Google account
   - Go to: https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select App: "Mail"
   - Select Device: "Windows Computer" (or your device)
   - Click "Generate"
   - Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

3. **Update .env file**
   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # The generated app password
   FRONTEND_URL=http://localhost:5173
   ```

---

## 📮 For SendGrid (Recommended for Production)

If you prefer SendGrid for more reliable email delivery:

1. Sign up at: https://sendgrid.com/
2. Get your API key from the dashboard
3. Update `backend/services/emailService.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const msg = {
        to: email,
        from: 'noreply@yourdomain.com', // Must be verified sender
        subject: 'Password Reset Request - Voice Dashboard',
        html: `...your HTML template...`,
    };
    
    await sgMail.send(msg);
};
```

4. Update `.env`:
```env
SENDGRID_API_KEY=your-sendgrid-api-key-here
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Testing Without Email (Development Only)

If you just want to test the flow without setting up email:

1. **Check backend console** - The reset token will be logged
2. **Manually construct the URL**: 
   ```
   http://localhost:5173/?token=THE_TOKEN_FROM_CONSOLE
   ```
3. Or temporarily modify `emailService.js` to console.log the reset URL:

```javascript
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/?token=${resetToken}`;
    
    // For testing: Just log the URL instead of sending email
    console.log('\n🔑 PASSWORD RESET URL:');
    console.log(resetUrl);
    console.log('\n');
    
    // Comment out the actual email sending for now
    // await transporter.sendMail(mailOptions);
};
```

---

## ✅ Verification Steps

1. **Restart your backend server** after updating .env
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Test the feature**:
   - Go to login page
   - Click "Forgot Password?"
   - Enter your email
   - Check email inbox (or console if testing mode)
   - Click reset link
   - Enter new password
   - Login with new password

3. **Check for errors**:
   - Backend console for email sending errors
   - Frontend console for API errors
   - Browser network tab for request/response

---

## 🔒 Production Considerations

When deploying to production:

1. **Use environment variables** on your hosting platform
   - Vercel: Project Settings → Environment Variables
   - Heroku: Config Vars
   - Railway: Variables tab

2. **Update FRONTEND_URL** to your production domain:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Use professional email service** (SendGrid, Mailgun, AWS SES)

4. **Consider email templates** services like Postmark for better design

---

## 📋 Complete .env Example

Your `backend/.env` should look like this:

```env
# Existing variables
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000

# NEW: Email Configuration
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-app-password-here
FRONTEND_URL=http://localhost:5173

# Optional: If using SendGrid
# SENDGRID_API_KEY=your-sendgrid-key
```

---

## ❗ Troubleshooting

**"Failed to send email" error?**
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Verify 2FA is enabled and App Password is generated
- Make sure .env file is in backend folder
- Restart backend server after changing .env

**Email not received?**
- Check spam/junk folder
- Verify email address is correct
- Check backend console for errors
- Try with a different email provider

**"Invalid or expired token" error?**
- Tokens expire after 1 hour
- Make sure you're using the latest token
- Check backend server time is correct

---

## 🎉 You're All Set!

Once you've configured the email settings, the password reset feature will work end-to-end:

1. ✅ User clicks "Forgot Password?"
2. ✅ User enters email
3. ✅ Email sent with reset link
4. ✅ User clicks link from email
5. ✅ User resets password
6. ✅ User logs in with new password

Need help? Check the backend console logs for detailed error messages.
