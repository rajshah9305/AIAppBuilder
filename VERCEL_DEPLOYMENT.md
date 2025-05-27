# Vercel Deployment Guide

This guide will help you deploy the AI App Builder to Vercel for production use.

## 🚀 Quick Deployment

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the Application**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
## ⚙️ Environment Variables

Set these environment variables in your Vercel project settings. Some variables from `api/.env.example` are listed here. Add others from that file as needed by your specific configuration.

### Core Configuration (Required)

```env
# AI Framework API Keys
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here # If using Groq

# Security
JWT_SECRET=your-super-secret-jwt-key-must-be-changed-for-production
SESSION_SECRET=your-session-secret-must-be-changed-for-production # Important for session management

# Server Environment
NODE_ENV=production # Essential for Vercel to use production optimizations
```

### Optional & Recommended for Production

```env
# Server Configuration
# PORT: Vercel sets this automatically. Your application should use process.env.PORT.
FRONTEND_URL=https://your-app-name.vercel.app # Your deployed frontend URL

# Database (if not using Vercel Postgres, provide the full URL)
DATABASE_URL=your-database-connection-string 

# Redis (if using external Redis for caching/sessions)
REDIS_URL=your-redis-connection-string

# Rate Limiting (Highly Recommended for public APIs)
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
GENERATION_RATE_LIMIT_WINDOW_MS=3600000 # 1 hour
GENERATION_RATE_LIMIT_MAX_REQUESTS=20 # Adjust based on expected usage and AI service limits

# AI Framework Specific Settings (Customize as needed)
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=4000
GROQ_MODEL=llama3-8b-8192 # Or your preferred Groq model
GROQ_MAX_TOKENS=3000

# Logging
LOG_LEVEL=info # Recommended for production (e.g., info, warn, error)
# LOG_FILE: Vercel functions primarily use stdout/stderr for logging. File logging might not work as expected or require specific configurations.

# Feature Flags (Adjust based on desired production features)
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=false # Set to true if SMTP is configured and feature is desired
```

### Email Configuration (Optional - if email features are needed)
*Note: Ensure your email provider's settings are correct and allowlist Vercel's IP ranges if necessary.*
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587 # Or your SMTP port
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
```

### File Uploads (Important Considerations for Vercel)
*Vercel's serverless functions have an ephemeral (temporary) filesystem. For persistent file storage, use a dedicated cloud storage service (e.g., AWS S3, Google Cloud Storage, Cloudinary) and configure your application accordingly. The following variables are from `.env.example` but might need a different approach on Vercel:*
```env
# MAX_FILE_SIZE=10485760 # Max size in bytes
# UPLOAD_DIR=uploads # Local directory, not suitable for Vercel's ephemeral filesystem for persistent storage
```

### Other Variables
*Review `api/.env.example` for other variables that might be relevant to your specific setup, such as `BCRYPT_ROUNDS`, `WEBHOOK_SECRET`, `ANALYTICS_API_KEY`, `ENABLE_ANALYTICS`, `HEALTH_CHECK_INTERVAL`, `METRICS_ENABLED` and set them in Vercel if needed.*
```
## 🗄️ Database Setup

Since Vercel is serverless, you'll need an external database:

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to `DATABASE_URL`

### Option 2: External PostgreSQL
- **Supabase**: Free tier with PostgreSQL
- **PlanetScale**: MySQL-compatible serverless database
- **Railway**: PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

### Option 3: Serverless Database (Alternative)
For a simpler setup, you can use the in-memory storage (current implementation) which works for development but won't persist data between deployments.

## 🔧 Project Structure for Vercel

The project is configured with the following structure:

```
ai-app-builder/
├── api/                    # Backend API (Vercel Functions)
│   ├── server.js          # Main API handler
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── package.json       # API dependencies
├── frontend/              # React frontend
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## 📝 Vercel Configuration

The `vercel.json` file configures:

- **Frontend**: Static build from React app
- **API**: Serverless functions for backend
- **Routing**: Proper routing between frontend and API
- **Environment**: Production environment settings

## 🚨 Important Notes

### WebSocket Limitations
- **Development**: Full WebSocket support for real-time updates
- **Production**: No WebSocket support (Vercel limitation)
- **Fallback**: REST API with simulated progress updates

### Database Considerations
- In-memory storage works for demo but doesn't persist
- Use external database for production
- Update connection strings in environment variables

### API Limits
- Vercel functions have a 10-second timeout by default
- Extended to 30 seconds for AI generation
- Consider breaking down long operations

## 🔍 Deployment Steps

1. **Prepare Environment**
   ```bash
   # Copy environment template
   cp api/.env.example api/.env
   # Add your API keys to api/.env
   ```

2. **Test Locally**
   ```bash
   # Install dependencies
   npm run install:all
   
   # Start development servers
   npm run dev
   ```

3. **Deploy to Vercel**
   ```bash
   # Using Vercel CLI
   vercel --prod
   
   # Or push to GitHub and use Vercel integration
   git push origin main
   ```

4. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Navigate to your project settings
   - Add environment variables
   - Redeploy if needed

## 🌐 Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to project settings
   - Navigate to Domains
   - Add your custom domain

2. **Update Environment Variables**
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

## 📊 Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Page views and performance
- **Functions**: API usage and errors
- **Logs**: Real-time function logs
- **Speed Insights**: Core Web Vitals

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Errors**
   - Verify environment variables are set
   - Check function timeout limits
   - Review function logs in Vercel dashboard

3. **Missing Features**
   - WebSocket not available in production
   - Database connections may need adjustment
   - File uploads require external storage

### Debug Commands

```bash
# Check build locally
npm run build

# Test API endpoints
curl https://your-app.vercel.app/api/health

# View Vercel logs
vercel logs
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database connection working
- [ ] API keys added and valid
- [ ] Custom domain configured (optional)
- [ ] Error monitoring setup
- [ ] Performance testing completed
- [ ] Security review done

## 📈 Scaling Considerations

- **Database**: Use connection pooling for high traffic
- **Caching**: Implement Redis for session storage
- **CDN**: Vercel provides global CDN automatically
- **Monitoring**: Set up alerts for errors and performance

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/projects/domains)

---

Your AI App Builder is now ready for production deployment on Vercel! 🎉
```
