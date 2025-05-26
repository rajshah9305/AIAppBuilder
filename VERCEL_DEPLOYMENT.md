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

Set these environment variables in your Vercel dashboard:

### Required Variables
```env
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

### Optional Variables
```env
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
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
