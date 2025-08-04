# 🔪 SUIss Knife – Premium Sui Testnet Faucet

> **A beautifully crafted, modern testnet faucet interface for the Sui blockchain**

SUIss Knife is a premium, developer-friendly testnet faucet built with **Vite + React + TypeScript** and powered by **Sui's blockchain infrastructure**. Features a stunning dark theme with glass morphism effects, smooth animations, and modular architecture.

![SUIss Knife Preview](./screenshot.png)

---

## ✨ Features

### 🎨 **Premium UI/UX**
- **Dark Theme Design** with glass morphism effects
- **Smooth Animations** and micro-interactions
- **Responsive Layout** optimized for all devices
- **Enhanced Visual Feedback** with hover states and transitions
- **Professional Typography** with proper hierarchy

### 🔧 **Technical Excellence**
- **Modular Architecture** with reusable components
- **TypeScript** for type safety and better DX
- **TailwindCSS** for rapid, consistent styling
- **Custom Animations** with CSS keyframes
- **Component-Based** structure for maintainability

### 🔐 **Wallet Integration**
- **Dual Connection Methods**: Manual input or wallet connect
- **Address Validation** with real-time feedback
- **Custom Wallet Dropdown** with dark theme styling
- **Transaction Status** with detailed feedback
- **Rate Limiting** with user-friendly messages

### 🌐 **Blockchain Features**
- **Sui Testnet Support** with mainnet readiness
- **Real-time Transaction Tracking**
- **Explorer Integration** for transaction verification
- **Rate Limit Management** with cooldown periods
- **Error Handling** with graceful fallbacks

---

## 🚀 Live Demo

### [🌐 Live Application](https://suiss-knife.vercel.app)

Experience the premium faucet interface with all enhanced features!

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or pnpm
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/muktanshumishra24/sui-faucet-monorepo.git
cd sui-faucet-monorepo
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://sui-token-faucet-distribution-production.up.railway.app
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

---

## 📁 Project Architecture

```
src/
├── components/           # Modular UI Components
│   ├── Header.tsx       # Navigation & wallet connection
│   ├── HeroSection.tsx  # Main title & branding
│   ├── WalletCard.tsx   # Wallet input & request logic
│   ├── FaucetInfoCard.tsx # Enhanced faucet information
│   ├── Footer.tsx       # Social links & copyright
│   ├── BackgroundEffects.tsx # Animated background
│   └── CustomWalletButton.tsx # Custom wallet dropdown
├── App.tsx              # Main application component
├── App.css              # Custom animations & styles
├── useTokenRequest.ts   # API integration logic
├── networkConfig.ts     # Network configuration
└── main.tsx            # Application entry point
```

---

## 🎯 Usage Guide

### 1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Or manually enter your wallet address

### 2. **View Faucet Information**
   - Check chain details, rate limits, and token amounts
   - Beautiful gradient cards with hover effects

### 3. **Request Tokens**
   - Click "Request Tokens" button
   - View real-time transaction status
   - Get explorer links for verification

### 4. **Monitor Transactions**
   - Real-time status updates
   - Error handling with helpful messages
   - Rate limit feedback

---

## 🎨 UI Components

### **Header Component**
- Logo and branding
- Live status indicator
- Custom wallet connection dropdown

### **Hero Section**
- Animated title with fade-in effects
- Status indicators with pulse animations
- Responsive layout with proper spacing

### **Wallet Card**
- Address validation with real-time feedback
- Transaction status with color-coded messages
- Enhanced button states with hover effects

### **Faucet Info Card**
- Gradient background cards
- Icon animations and hover effects
- Detailed information with visual hierarchy

### **Background Effects**
- Animated gradient orbs
- Staggered animation delays
- Subtle depth and movement

---

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Custom CSS
- **Wallet Integration**: @mysten/dapp-kit
- **Animations**: CSS Keyframes + Tailwind
- **Deployment**: Vercel

---

## 🎨 Design Features

### **Color Scheme**
- **Primary**: Dark theme with blue accents
- **Success**: Green gradients for positive states
- **Warning**: Orange-red for rate limits
- **Error**: Red for error states

### **Animations**
- **Fade-in-up**: Page load animations
- **Scale-in**: Button and card hover effects
- **Pulse**: Status indicators
- **Float**: Subtle background movement

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts
- **Labels**: Uppercase with tracking
- **Status**: Color-coded for clarity

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Mysten Labs** – For building Sui and dapp-kit
- **TailwindCSS** – For the amazing utility-first CSS framework
- **Vercel** – For seamless deployment
- **React Team** – For the incredible framework
- **Sui Community** – For the amazing blockchain ecosystem

---

## 📞 Contact

- **Developer**: Muktanshu Mishra
- **GitHub**: [@muktanshumishra24](https://github.com/muktanshumishra24)
- **Project**: [SUIss Knife](https://suiss-knife.vercel.app)

---

<div align="center">

**Made with ❤️ for the Sui Community**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-SUIss%20Knife-blue?style=for-the-badge&logo=vercel)](https://suiss-knife.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>
