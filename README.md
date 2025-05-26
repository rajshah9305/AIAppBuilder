# AIAppBuilder

A powerful no-code AI application builder that leverages multiple AI frameworks to generate complete, production-ready applications from natural language descriptions.

## 🚀 Key Features

- **Multi-AI Framework Integration**: Combines OpenAI GPT-4, Groq LLaMA, CrewAI, MetaGPT, AutoGen, and LangChain
- **Real-time Generation**: WebSocket-powered live updates during app generation
- **Interactive UI**: Modern React + TypeScript frontend with Tailwind CSS
- **Code Preview**: Syntax-highlighted code preview with download capabilities
- **Project Management**: Save, organize, and manage your generated applications
- **User Authentication**: Secure JWT-based authentication system
- **CI/CD Pipeline**: Automated testing and deployment to Vercel

## Resources

- [Repository](https://github.com/rajshah9305/AIAppBuilder)
- [Issues](https://github.com/rajshah9305/AIAppBuilder/issues)
<!-- If/when your documentation site is live and SSL is valid, uncomment the next line -->
<!-- - [Docs](https://docs.aiappbuilder.com) -->
- [LICENSE](LICENSE)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Vercel account (for deployment)
- OpenAI API key
- Groq API key (optional)

### Quick Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rajshah9305/AIAppBuilder.git
   cd AIAppBuilder
   ```

2. **Environment Setup**
   ```bash
   cp api/.env.example api/.env
   # Edit api/.env and add your API keys:
   # OPENAI_API_KEY=your-openai-api-key-here
   # GROQ_API_KEY=your-groq-api-key-here
   # JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Install Dependencies & Start Development**
   ```bash
   ./start-dev.sh
   # Or manually: npm run install:all && npm run dev
   ```
   
   Application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

4. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### CI/CD Pipeline Setup

For automatic deployments on every code push:
```bash
./setup-cicd.sh
```

📋 **Documentation:**
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deployment guide
- [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md) - CI/CD setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment checklist

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

<!-- Add any additional sections you require here -->
