# AI App Builder

A powerful no-code AI application builder that leverages multiple AI frameworks to generate complete, production-ready applications from natural language descriptions.

## 🚀 Features

- **Multi-AI Framework Integration**: Combines OpenAI GPT-4, Groq LLaMA, CrewAI, MetaGPT, AutoGen, and LangChain
- **Real-time Generation**: WebSocket-powered live updates during app generation
- **Interactive UI**: Modern React + TypeScript frontend with Tailwind CSS
- **Code Preview**: Syntax-highlighted code preview with download capabilities
- **Project Management**: Save, organize, and manage your generated applications
- **User Authentication**: Secure JWT-based authentication system
- **Usage Tracking**: Monitor API usage and generation limits
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for state management
- **Socket.IO Client** for real-time updates
- **React Syntax Highlighter** for code display
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **Socket.IO** for WebSocket communication
- **PostgreSQL** database
- **Redis** for caching
- **JWT** authentication
- **Helmet** for security
- **Rate limiting** for API protection

### AI Frameworks
- **OpenAI GPT-4** - Advanced code generation
- **Groq LLaMA** - Ultra-fast inference
- **CrewAI** - Multi-agent collaboration
- **MetaGPT** - Documentation generation
- **AutoGen** - Iterative development
- **LangChain** - Complex AI workflows

### Deployment
- **Vercel** for serverless deployment
- **PostgreSQL** database (external)
- **Redis** cache (optional)
- **GitHub** integration for CI/CD

## 📋 Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- OpenAI API key
- Groq API key (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-app-builder.git
cd ai-app-builder
```

### 2. Environment Setup

Copy the environment file and configure your API keys:

```bash
cp api/.env.example api/.env
```

Edit `api/.env` and add your API keys:

```env
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Local Development

```bash
# Quick start with script
./start-dev.sh

# Or manually:
npm run install:all  # Install all dependencies
npm run dev          # Start both frontend and backend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

📋 **Deployment Resources:**
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Detailed deployment guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md) - Complete CI/CD pipeline setup

### 5. Set Up CI/CD Pipeline (Recommended)

For automatic deployments on every code push:

```bash
# Run the setup script
./setup-cicd.sh

# Follow the prompts to configure:
# - Vercel integration
# - GitHub secrets
# - Environment variables
```

This sets up:
- ✅ **Automatic deployments** on push to main
- ✅ **Preview deployments** for pull requests
- ✅ **Quality checks** and testing
- ✅ **Security scanning**
- ✅ **Dependency management**

## 🔧 Configuration

### Environment Variables

#### API (.env)
```env
# AI APIs (Required)
OPENAI_API_KEY=your-openai-key
GROQ_API_KEY=your-groq-key

# Security (Required)
JWT_SECRET=your-jwt-secret

# Environment
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database (Optional - uses in-memory by default)
DATABASE_URL=postgresql://username:password@localhost:5432/ai_app_builder
```

#### Frontend (Optional)
```env
REACT_APP_API_URL=/api  # For production
# REACT_APP_API_URL=http://localhost:5000/api  # For development
```

## 📖 Usage

### 1. Create an Account
- Navigate to the application
- Register with your email and password
- Verify your account (if email verification is enabled)

### 2. Generate an Application
- Describe your app idea in detail
- Select AI frameworks to use
- Click "Generate App"
- Monitor real-time progress
- Review and download generated code

### 3. Manage Projects
- Save generated applications as projects
- View project history
- Duplicate and modify existing projects
- Track usage statistics

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │ Vercel Functions │    │   External DB   │
│                 │    │                 │    │   (Optional)    │
│  - Components   │◄──►│  - REST API     │◄──►│                 │
│  - State Mgmt   │    │  - Serverless   │    │  - PostgreSQL   │
│  - UI/UX        │    │  - Auth         │    │  - Supabase     │
└─────────────────┘    └─────────────────┘    │  - PlanetScale  │
                              │                └─────────────────┘
                              ▼
                       ┌─────────────────┐
                       │  AI Frameworks  │
                       │                 │
                       │  - OpenAI       │
                       │  - Groq         │
                       │  - CrewAI       │
                       │  - MetaGPT      │
                       │  - AutoGen      │
                       │  - LangChain    │
                       └─────────────────┘
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run API tests
cd api && npm test

# Run all tests
npm test
```

## 📦 Building for Production

```bash
# Build frontend
cd frontend && npm run build

# Deploy to Vercel
vercel --prod

# Or use GitHub integration for automatic deployments
git push origin main
```

## 🔒 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Environment variable protection

## 📊 Monitoring

- Health check endpoints
- Application logs
- Usage analytics
- Error tracking
- Performance metrics

## ⚠️ Important Notes

### WebSocket Limitations
- **Development**: Full WebSocket support for real-time progress updates
- **Production (Vercel)**: WebSocket not supported in serverless environment
- **Fallback**: Simulated progress updates using REST API only

### Database Options
- **Default**: In-memory storage (development/demo)
- **Production**: External database recommended (Supabase, PlanetScale, etc.)
- **Setup**: Update `DATABASE_URL` environment variable

### Serverless Considerations
- **Function Timeout**: 30 seconds max for AI generation
- **Cold Starts**: First request may be slower
- **Stateless**: No persistent connections between requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@aiappbuilder.com
- 💬 Discord: [Join our community](https://discord.gg/aiappbuilder)
- 📖 Documentation: [docs.aiappbuilder.com](https://docs.aiappbuilder.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-app-builder/issues)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Groq for ultra-fast inference
- All the amazing open-source AI frameworks
- The React and Node.js communities

---

Made with ❤️ by the AI App Builder team
