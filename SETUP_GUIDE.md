# 🚀 Sui Faucet Monorepo Setup Guide

This guide will help you set up and run the complete Sui Testnet Faucet DApp with a beautiful UI, robust backend, and Discord bot integration.

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** database
- **Redis** server
- **Discord Bot Token** (for Discord integration)

## 🛠️ Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd sui-faucet-monorepo

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

#### Backend Environment
```bash
# Copy environment template
cp packages/backend/env.example packages/backend/.env

# Edit the environment file
nano packages/backend/.env
```

**Required Backend Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sui_faucet"

# Redis
REDIS_URL="redis://localhost:6379"

# Sui Configuration
SUI_NETWORK="testnet"
SUI_PRIVATE_KEY="your_sui_private_key_here"
SUI_RPC_URL="https://fullnode.testnet.sui.io"
SUI_FAUCET_AMOUNT="1000000000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=3

# JWT
JWT_SECRET="your_jwt_secret_here"

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

#### Frontend Environment
```bash
# Create frontend environment file
cat > packages/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-server
EOF
```

#### Discord Bot Environment
```bash
# Create Discord bot environment file
cat > packages/discord-bot/.env << EOF
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id
API_BASE_URL=http://localhost:3001
EOF
```

### 3. Database Setup

```bash
# Navigate to backend
cd packages/backend

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Seed initial data
npm run db:seed
```

### 4. Discord Bot Setup

1. **Create Discord Application:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to "Bot" section and create a bot
   - Copy the bot token

2. **Deploy Commands:**
   ```bash
   cd packages/discord-bot
   npm run deploy-commands
   ```

3. **Invite Bot to Server:**
   - Use the OAuth2 URL generator in Discord Developer Portal
   - Select "bot" scope and required permissions
   - Invite the bot to your server

## 🚀 Running the Application

### Development Mode
```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:backend    # Backend API (Port 3001)
npm run dev:frontend   # Frontend (Port 3000)
npm run dev:discord-bot # Discord Bot
```

### Production Mode
```bash
# Build all packages
npm run build

# Start production services
npm run start
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **API Documentation:** http://localhost:3001/api/docs

## 🎨 UI Features

The frontend includes:
- ✨ **Modern Design** with Tailwind CSS and shadcn/ui
- 🌙 **Dark/Light Mode** toggle
- 📱 **Mobile Responsive** design
- 🎯 **Wallet Integration** with Suiet Wallet Kit
- 📊 **Real-time Statistics** with charts
- ⚡ **Smooth Animations** with Framer Motion
- 🔔 **Toast Notifications** with Sonner

## 🔧 Configuration Options

### Rate Limiting
- **Window:** 15 minutes (900,000ms)
- **Max Requests:** 3 per window
- **Block Duration:** 1 hour

### Faucet Settings
- **Default Amount:** 1 SUI (1,000,000,000 MIST)
- **Max Amount:** 10 SUI per request
- **Network:** Sui Testnet

### Security Features
- **IP-based rate limiting**
- **Wallet address validation**
- **Geolocation tracking**
- **Bot detection**
- **Blacklist system**

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` with admin credentials:

```bash
# Create admin user via API
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password",
    "role": "admin"
  }'
```

## 🔍 Monitoring & Logs

- **Backend Logs:** `packages/backend/logs/`
- **Health Checks:** `/api/health` and `/api/health/detailed`
- **Statistics:** `/api/stats` (public) and `/api/admin/stats` (admin)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   ```bash
   # Check PostgreSQL is running
   sudo systemctl status postgresql
   
   # Create database if needed
   createdb sui_faucet
   ```

2. **Redis Connection Error:**
   ```bash
   # Check Redis is running
   sudo systemctl status redis
   
   # Start Redis if needed
   sudo systemctl start redis
   ```

3. **Port Already in Use:**
   ```bash
   # Find process using port
   lsof -i :3001
   
   # Kill process
   kill -9 <PID>
   ```

4. **Discord Bot Not Responding:**
   - Check bot token is correct
   - Ensure bot has required permissions
   - Verify commands are deployed

### Development Tips

- Use `npm run clean` to clean all build artifacts
- Use `npm run lint` to check code quality
- Check logs in `packages/backend/logs/` for errors
- Use browser dev tools for frontend debugging

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Set `NODE_ENV=production` in environment files
2. Run `npm run build` to build all packages
3. Use PM2 or similar process manager
4. Set up reverse proxy (nginx) for frontend
5. Configure SSL certificates

## 📚 API Documentation

### Faucet Endpoints
- `POST /api/faucet/request` - Request testnet tokens
- `GET /api/faucet/status/:requestId` - Check request status
- `GET /api/faucet/history/:walletAddress` - Get request history

### Admin Endpoints
- `GET /api/admin/stats` - Get faucet statistics
- `GET /api/admin/requests` - Get all requests
- `POST /api/admin/blacklist` - Blacklist address/IP

### Public Endpoints
- `GET /api/stats` - Get public statistics
- `GET /api/health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Discord:** Join our [Discord server](https://discord.gg/your-server)
- **Issues:** Report bugs on GitHub
- **Documentation:** Check the `/docs` folder

---

**Happy Building! 🚀** 