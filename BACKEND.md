# Voice Dashboard - Backend API Documentation

Complete backend API for managing Bolna voice agents and call executions with JWT authentication and MongoDB.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice_dashboard
JWT_SECRET=your_secure_random_secret_key
BOLNA_API_URL=https://api.bolna.dev
BOLNA_BEARER_TOKEN=your_bolna_api_token
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env
```

### 4. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on: **http://localhost:5000**

---

## 📊 Database Schema (MongoDB)

### Collections

#### **clients**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, required),
  password_hash: String (bcrypt hashed),
  oauth_provider: String (optional: 'google', 'github'),
  oauth_id: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### **agents**
```javascript
{
  _id: ObjectId,
  bolna_agent_id: String (unique, required),
  name: String (required),
  client_id: ObjectId (ref: Client, required),
  description: String,
  config: Object (custom agent settings),
  createdAt: Date,
  updatedAt: Date
}
```

#### **executions**
```javascript
{
  _id: ObjectId,
  bolna_execution_id: String (unique, required),
  agent_id: ObjectId (ref: Agent, required),
  
  // Call details
  conversation_time: Number (seconds),
  total_cost: Number,
  status: String ('pending', 'in_progress', 'completed', 'failed', 'cancelled'),
  
  // Telephony
  telephony_provider: String,
  from_number: String,
  to_number: String,
  call_sid: String,
  
  // Data
  extracted_data: Object,
  transcript: String,
  metadata: Object,
  raw_logs: String,
  
  // Timestamps
  started_at: Date,
  ended_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication

#### **POST /api/auth/register**
Create new user account

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### **POST /api/auth/login**
Authenticate user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": { ... }
}
```

---

#### **GET /api/auth/profile**
Get current user profile

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "client": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 🤖 Agents

#### **GET /api/agents**
List all user's agents

**Headers:** `Authorization: Bearer <TOKEN>`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "agents": [...]
}
```

---

#### **GET /api/agents/:agentId**
Get single agent details

**Headers:** `Authorization: Bearer <TOKEN>`

**Response:**
```json
{
  "success": true,
  "agent": { ... }
}
```

---

#### **POST /api/agents**
Create new agent

**Headers:** `Authorization: Bearer <TOKEN>`

**Request:**
```json
{
  "bolna_agent_id": "agent-123-from-bolna",
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "config": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent created successfully",
  "agent": { ... }
}
```

---

#### **PUT /api/agents/:agentId**
Update agent

**Headers:** `Authorization: Bearer <TOKEN>`

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

---

#### **DELETE /api/agents/:agentId**
Delete agent

**Headers:** `Authorization: Bearer <TOKEN>`

**Response:**
```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

---

### 📞 Executions

#### **GET /api/executions**
List executions with filters

**Headers:** `Authorization: Bearer <TOKEN>`

**Query Parameters:**
- `from` - Start date (2024-01-01)
- `to` - End date (2024-12-31)
- `status` - Filter by status
- `agentId` - Filter by agent

**Examples:**
```
/api/executions
/api/executions?from=2024-01-01&to=2024-12-31
/api/executions?status=completed
/api/executions?agentId=65a1b2c3d4e5f6g7h8i9j0k1
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "executions": [...]
}
```

---

####  **GET /api/executions/stats**
Get execution statistics

**Headers:** `Authorization: Bearer <TOKEN>`

**Query Parameters:**
- `from` - Start date (optional)
- `to` - End date (optional)

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_executions": 1250,
    "total_cost": 327.85,
    "total_conversation_time": 185400,
    "by_status": {
      "completed": 1100,
      "failed": 50,
      "in_progress": 25,
      "pending": 50,
      "cancelled": 25
    }
  }
}
```

---

#### **GET /api/executions/:executionId**
Get single execution details

**Headers:** `Authorization: Bearer <TOKEN>`

**Response:**
```json
{
  "success": true,
  "execution": {
    "transcript": "Full conversation...",
    "extracted_data": {},
    "raw_logs": "...",
    ...
  }
}
```

---

### 🏥 Utility

#### **GET /health**
Health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔄 Bolna Integration

### Automatic Sync (Cron Job)

**Schedule:** Every hour at minute 0  
**Function:** Syncs all executions from Bolna API

**Process:**
1. Get all agents from database
2. For each agent, call Bolna API: `GET /executions?agent_id=XXX`
3. Upsert executions into MongoDB
4. Log results

**File:** `backend/jobs/syncExecutions.js`

---

### Bolna Service Methods

**File:** `backend/services/bolnaService.js`

```javascript
// Sync all executions for all agents
await bolnaService.syncAllExecutions();

// Sync executions for specific agent
await bolnaService.syncExecutionsForAgent(bolnaAgentId);

// Fetch single execution details
await bolnaService.fetchExecutionDetails(executionId);

// Fetch execution raw logs
await bolnaService.fetchExecutionRawLogs(executionId);
```

---

## 🔒 Security

### Authentication Flow
1. User registers/logs in → Backend generates JWT token
2. JWT contains `clientId` payload
3. Token expires in 7 days
4. Frontend sends token in `Authorization: Bearer <TOKEN>` header

### Authorization
1. Middleware extracts `clientId` from JWT
2. Find all agents owned by this client
3. Filter executions by client's agents
4. Return only authorized data

**✅ Correct:** Client-based authorization  
**❌ Wrong:** Using `agent_id` as secret

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── agentController.js   # Agent CRUD
│   └── executionController.js # Execution queries
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   ├── Client.js            # User schema
│   ├── Agent.js             # Agent schema
│   └── Execution.js         # Execution schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── agents.js            # Agent routes
│   └── executions.js        # Execution routes
├── services/
│   └── bolnaService.js      # Bolna API client
├── jobs/
│   └── syncExecutions.js    # Cron jobs
├── .env.example             # Environment template
├── .gitignore               # Git exclusions
├── package.json             # Dependencies
└── server.js                # Main entry point
```

---

## 🛠️ Technologies

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **axios** - HTTP client for Bolna API
- **node-cron** - Task scheduling
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

---

## 🧪 Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Get Agents:**
```bash
TOKEN="your_jwt_token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/agents
```

**Create Agent:**
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"bolna_agent_id":"test-123","name":"Test Agent"}'
```

---

## 🚢 Production Deployment

### Railway / Render / Heroku

1. Push code to Git repository
2. Connect repository to platform
3. Set environment variables:
   - `MONGODB_URI` - MongoDB Atlas connection
   - `JWT_SECRET` - Strong random secret
   - `BOLNA_BEARER_TOKEN` - Production token
   - `FRONTEND_URL` - Production frontend URL
   - `NODE_ENV=production`
4. Deploy

### Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/voice_dashboard
JWT_SECRET=super_secure_random_secret_minimum_32_characters
BOLNA_API_URL=https://api.bolna.dev
BOLNA_BEARER_TOKEN=production_bolna_token
FRONTEND_URL=https://yourdomain.com
```

---

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- For Atlas, check IP whitelist

**Bolna API 401:**
- Verify `BOLNA_BEARER_TOKEN` is correct
- Check token hasn't expired

**CORS Errors:**
- Update `FRONTEND_URL` in `.env`
- Restart server after .env changes

**JWT Invalid:**
- Token expired (7 days)
- Wrong `JWT_SECRET`
- Login again to get new token

---

## 📞 Support

For issues:
1. Check environment variables
2. Review server logs
3. Test with curl commands
4. Verify MongoDB connection

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Port:** 5000
