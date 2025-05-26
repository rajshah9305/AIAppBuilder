# 🚀 CI/CD Setup Guide for GitHub → Vercel Deployment

This guide will help you set up a complete CI/CD pipeline that automatically deploys your AI App Builder to Vercel whenever you push code to GitHub.

## 📋 Prerequisites

- ✅ GitHub repository: https://github.com/rajshah9305/AIAppBuilder
- ✅ Vercel account: https://vercel.com
- ✅ OpenAI API key
- ✅ Groq API key (optional)

## 🔧 Step 1: Vercel Project Setup

### 1.1 Connect GitHub to Vercel

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `rajshah9305/AIAppBuilder`
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm run install:all`

### 1.2 Get Vercel Project IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
cd /path/to/your/project
vercel link

# Get project details
vercel project ls
```

This will create a `.vercel/project.json` file with your project details.

## 🔑 Step 2: GitHub Secrets Configuration

### 2.1 Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these **Repository Secrets**:

```bash
# Vercel Integration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here

# Application Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
```

### 2.2 How to Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token and add it as `VERCEL_TOKEN` secret

### 2.3 How to Get Vercel IDs

```bash
# After running 'vercel link', check the .vercel/project.json file
cat .vercel/project.json
```

Copy the `orgId` and `projectId` values to GitHub secrets.

## 🌍 Step 3: Vercel Environment Variables

### 3.1 Production Environment

In your Vercel dashboard → Project → Settings → Environment Variables:

```bash
# Required for production
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production

# Optional
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=your_database_url_here
REDIS_URL=your_redis_url_here
```

### 3.2 Preview Environment

Set the same variables for "Preview" environment to test PRs.

## 🔄 Step 4: Workflow Overview

### 4.1 Automated Workflows

The CI/CD pipeline includes these workflows:

1. **`deploy.yml`** - Main deployment workflow
   - Runs tests and quality checks
   - Deploys preview for PRs and develop branch
   - Deploys to production on main branch

2. **`quality-checks.yml`** - Code quality and security
   - ESLint and Prettier checks
   - TypeScript compilation
   - Security audits
   - Bundle size analysis

3. **`auto-merge.yml`** - Dependabot automation
   - Auto-approves and merges dependency updates
   - Runs tests before merging

### 4.2 Deployment Triggers

| Branch/Event | Action | Environment |
|--------------|--------|-------------|
| `main` push | Deploy to production | Production |
| `develop` push | Deploy preview | Preview |
| Pull Request | Deploy preview + comment | Preview |
| Dependabot PR | Auto-test and merge | N/A |

## 🧪 Step 5: Testing the Pipeline

### 5.1 Test Preview Deployment

1. **Create a feature branch**
   ```bash
   git checkout -b feature/test-cicd
   echo "# Test CI/CD" >> TEST.md
   git add TEST.md
   git commit -m "test: Add test file for CI/CD"
   git push origin feature/test-cicd
   ```

2. **Create Pull Request**
   - Go to GitHub → Pull Requests → New Pull Request
   - Select `feature/test-cicd` → `main`
   - Create the PR

3. **Verify Automation**
   - ✅ Quality checks should run
   - ✅ Preview deployment should be created
   - ✅ Bot should comment with preview URL

### 5.2 Test Production Deployment

1. **Merge to main**
   ```bash
   git checkout main
   git merge feature/test-cicd
   git push origin main
   ```

2. **Verify Production Deployment**
   - ✅ Production deployment should trigger
   - ✅ App should be live at your Vercel URL

## 📊 Step 6: Monitoring and Maintenance

### 6.1 GitHub Actions Monitoring

- **Actions Tab**: Monitor workflow runs
- **Insights**: View workflow performance
- **Notifications**: Set up email alerts for failures

### 6.2 Vercel Monitoring

- **Deployments**: Track deployment history
- **Functions**: Monitor API performance
- **Analytics**: View usage statistics

### 6.3 Dependabot Configuration

The setup includes automatic dependency updates:
- **Weekly updates** for npm packages
- **Auto-merge** for minor/patch updates
- **Manual review** for major updates

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check logs in GitHub Actions
   # Common fixes:
   - Verify all secrets are set
   - Check Node.js version compatibility
   - Ensure all dependencies are listed
   ```

2. **Deployment Failures**
   ```bash
   # Check Vercel function logs
   # Common fixes:
   - Verify environment variables
   - Check API key validity
   - Review function timeout settings
   ```

3. **Test Failures**
   ```bash
   # Run tests locally first
   npm run test
   cd frontend && npm test
   cd ../api && npm test
   ```

### Debug Commands

```bash
# Test Vercel deployment locally
vercel dev

# Check build process
npm run vercel-build

# Validate GitHub Actions syntax
# Use GitHub's workflow validator in the Actions tab
```

## ✅ Verification Checklist

### Initial Setup
- [ ] GitHub repository connected to Vercel
- [ ] All GitHub secrets configured
- [ ] Vercel environment variables set
- [ ] Vercel project linked correctly

### Workflow Testing
- [ ] Pull request creates preview deployment
- [ ] Main branch deploys to production
- [ ] Quality checks pass
- [ ] Security scans complete
- [ ] Bundle size analysis works

### Production Verification
- [ ] Application loads correctly
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] AI generation functions
- [ ] Error handling works

## 🎯 Best Practices

### Branch Strategy
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Individual features
- **`hotfix/*`**: Critical production fixes

### Commit Messages
```bash
# Use conventional commits
feat: add new AI framework integration
fix: resolve authentication issue
docs: update deployment guide
ci: improve workflow performance
```

### Environment Management
- **Development**: Local with full features
- **Preview**: Vercel preview deployments
- **Production**: Live application

## 🚀 Advanced Features

### Custom Deployment Environments
```yaml
# Add staging environment
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  # Custom staging deployment logic
```

### Slack Notifications
```yaml
# Add Slack notifications for deployments
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Performance Monitoring
```yaml
# Add Lighthouse CI for performance monitoring
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: './lighthouserc.json'
```

---

## 🎉 Congratulations!

Your AI App Builder now has a complete CI/CD pipeline that:

- ✅ **Automatically tests** every code change
- ✅ **Deploys previews** for pull requests
- ✅ **Deploys to production** on main branch
- ✅ **Monitors quality** and security
- ✅ **Manages dependencies** automatically
- ✅ **Provides feedback** through GitHub comments

**Your deployment URL**: https://your-app.vercel.app

Ready to build amazing AI applications! 🚀
