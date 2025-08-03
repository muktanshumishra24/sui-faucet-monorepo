# Sui Testnet Faucet Monorepo

A clean, reliable, and user-friendly Sui Testnet Faucet DApp with Discord bot integration, built as a monorepo.

## 🚀 Features

### Core Features
- **Web UI** with wallet address input and validation
- **Sui testnet token distribution** backend
- **Rate-limiting** (per IP & wallet) to prevent abuse
- **Basic logging** for requests and analytics
- **Mobile responsive** design
- **Fast processing** - tokens sent within 30 seconds

### Advanced Features
- **Discord Bot Integration** with slash commands
- **Wallet Connect** support
- **Usage analytics** and monitoring dashboard
- **IP/geolocation fraud protection**
- **Admin dashboard** for control & monitoring
- **Role-based access control** for Discord

## 📦 Monorepo Structure

```
sui-faucet-monorepo/
├── packages/
│   ├── backend/          # Express.js API server
│   ├── frontend/         # Next.js web application
│   └── discord-bot/      # Discord bot with slash commands
├── README.md             # This file
├── SETUP_GUIDE.md        # Detailed setup instructions
├── NEXT_STEPS.md         # Development roadmap
└── package.json          # Root package configuration
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, Prisma, Redis
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Discord Bot**: Discord.js, TypeScript
- **Database**: PostgreSQL (via Prisma)
- **Caching**: Redis
- **Blockchain**: Sui SDK (@mysten/sui)
- **UI Components**: Radix UI, Lucide React, Framer Motion

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL
- Redis
- Discord Bot Token (for Discord integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sui-faucet-monorepo
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp packages/backend/env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env.local
   cp packages/discord-bot/env.example packages/discord-bot/.env
   ```

4. **Configure Environment Variables**
   - Update `.env` files with your configuration
   - Set up database connections
   - Configure Discord bot tokens
   - Add Sui testnet configuration

5. **Database Setup**
   ```bash
   cd packages/backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start Development**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:backend
   npm run dev:frontend
   npm run dev:discord-bot
   ```

## 📋 Available Scripts

### Root Level
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run start` - Start production services
- `npm run lint` - Lint all packages
- `npm run test` - Run tests across all packages
- `npm run clean` - Clean node_modules and dist folders

### Individual Packages
- `npm run dev:backend` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run dev:discord-bot` - Start Discord bot in development mode

## 🌐 Services

### Backend API (Port 3001)
- RESTful API for faucet operations
- Rate limiting and abuse prevention
- Database management with Prisma
- Redis caching for performance
- Comprehensive logging

### Frontend Web App (Port 3000)
- Modern, responsive UI
- Wallet address validation
- Real-time status updates
- Admin dashboard
- Analytics and monitoring

### Discord Bot
- Slash commands for token requests
- Role-based access control
- Rich embeds for responses
- Admin tools for moderators

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sui_faucet"

# Redis
REDIS_URL="redis://localhost:6379"

# Sui Configuration
SUI_NETWORK="testnet"
SUI_PRIVATE_KEY="your_private_key"
SUI_RPC_URL="https://fullnode.testnet.sui.io"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=3

# JWT
JWT_SECRET="your_jwt_secret"

# Server
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-server
```

#### Discord Bot (.env)
```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id
API_BASE_URL=http://localhost:3001
```

## 📊 API Endpoints

### Faucet Endpoints
- `POST /api/faucet/request` - Request testnet tokens
- `GET /api/faucet/status/:requestId` - Check request status
- `GET /api/faucet/history/:address` - Get request history

### Admin Endpoints
- `GET /api/admin/stats` - Get faucet statistics
- `GET /api/admin/requests` - Get all requests
- `POST /api/admin/blacklist` - Blacklist address/IP

### Health Check
- `GET /api/health` - Health check endpoint

## 🎯 Success Criteria

- ✅ Tokens sent within 30 seconds
- ✅ Abuse prevention via smart rate limiting
- ✅ Simple UX (even non-devs can use it)
- ✅ Handles multiple concurrent requests
- ✅ Mobile responsive design
- ✅ Comprehensive logging and monitoring

## 🧹 Code Quality

This codebase has been cleaned and optimized for:

- **Type Safety**: Full TypeScript implementation
- **Code Consistency**: ESLint configurations for all packages
- **Modular Structure**: Clean separation of concerns
- **Production Ready**: Proper error handling and logging
- **Developer Experience**: Hot reloading and development tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: Join our [Discord server](https://discord.gg/your-server)
- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the `SETUP_GUIDE.md` for detailed instructions

## 🙏 Acknowledgments

- Built for the First Movers Discord community
- Inspired by the need for a reliable Sui testnet faucet
- Special thanks to the Sui Foundation for their support 