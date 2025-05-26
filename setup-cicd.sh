#!/bin/bash

# AI App Builder CI/CD Setup Script
echo "🚀 Setting up CI/CD for AI App Builder..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "🔍 Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    print_status "Git is installed"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    print_status "Node.js is installed"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_status "npm is installed"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "api" ]; then
        print_error "Please run this script from the root of the AI App Builder project"
        exit 1
    fi
    print_status "In correct project directory"
}

# Install Vercel CLI if not present
install_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
        print_status "Vercel CLI installed"
    else
        print_status "Vercel CLI already installed"
    fi
}

# Setup environment files
setup_environment() {
    echo "📝 Setting up environment files..."
    
    if [ ! -f "api/.env" ]; then
        cp api/.env.example api/.env
        print_status "Created api/.env from template"
        print_warning "Please edit api/.env and add your API keys!"
    else
        print_status "api/.env already exists"
    fi
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    print_info "Installing root dependencies..."
    npm install
    
    print_info "Installing frontend dependencies..."
    cd frontend && npm install
    
    print_info "Installing API dependencies..."
    cd ../api && npm install
    
    cd ..
    print_status "All dependencies installed"
}

# Test the build process
test_build() {
    echo "🧪 Testing build process..."
    
    print_info "Testing frontend build..."
    cd frontend
    if npm run build; then
        print_status "Frontend build successful"
    else
        print_error "Frontend build failed"
        cd ..
        exit 1
    fi
    
    cd ../api
    print_info "Testing API..."
    if npm test; then
        print_status "API tests passed"
    else
        print_warning "API tests failed or no tests found"
    fi
    
    cd ..
    print_status "Build tests completed"
}

# Setup Git hooks (optional)
setup_git_hooks() {
    echo "🔗 Setting up Git hooks..."
    
    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run frontend linting
cd frontend
if npm run lint; then
    echo "✅ Frontend linting passed"
else
    echo "❌ Frontend linting failed"
    exit 1
fi

# Run tests
if npm test -- --watchAll=false; then
    echo "✅ Frontend tests passed"
else
    echo "❌ Frontend tests failed"
    exit 1
fi

cd ..
echo "✅ Pre-commit checks passed"
EOF

    chmod +x .git/hooks/pre-commit
    print_status "Git pre-commit hook installed"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 CI/CD setup completed!"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. 🔑 Configure API Keys:"
    echo "   - Edit api/.env and add your OPENAI_API_KEY and GROQ_API_KEY"
    echo ""
    echo "2. 🌐 Setup Vercel:"
    echo "   - Run: vercel login"
    echo "   - Run: vercel link"
    echo "   - Follow the prompts to connect your project"
    echo ""
    echo "3. 🔐 Configure GitHub Secrets:"
    echo "   - Go to: https://github.com/rajshah9305/AIAppBuilder/settings/secrets/actions"
    echo "   - Add the following secrets:"
    echo "     * VERCEL_TOKEN (get from https://vercel.com/account/tokens)"
    echo "     * VERCEL_ORG_ID (from .vercel/project.json after linking)"
    echo "     * VERCEL_PROJECT_ID (from .vercel/project.json after linking)"
    echo "     * OPENAI_API_KEY"
    echo "     * GROQ_API_KEY"
    echo "     * JWT_SECRET"
    echo ""
    echo "4. 🚀 Test the Pipeline:"
    echo "   - Create a feature branch: git checkout -b feature/test-cicd"
    echo "   - Make a small change and push"
    echo "   - Create a Pull Request to test preview deployment"
    echo ""
    echo "5. 📚 Read the Documentation:"
    echo "   - CI_CD_SETUP_GUIDE.md - Complete setup guide"
    echo "   - DEPLOYMENT_CHECKLIST.md - Deployment checklist"
    echo ""
    echo "🔗 Useful Links:"
    echo "   - GitHub Repository: https://github.com/rajshah9305/AIAppBuilder"
    echo "   - Vercel Dashboard: https://vercel.com/dashboard"
    echo "   - GitHub Actions: https://github.com/rajshah9305/AIAppBuilder/actions"
    echo ""
    echo "✨ Your AI App Builder is ready for continuous deployment!"
}

# Main execution
main() {
    echo "🚀 AI App Builder CI/CD Setup"
    echo "=============================="
    echo ""
    
    check_requirements
    check_directory
    install_vercel_cli
    setup_environment
    install_dependencies
    test_build
    setup_git_hooks
    show_next_steps
}

# Run main function
main
