#!/bin/bash

# AI App Builder Development Startup Script
echo "🚀 Starting AI App Builder in Development Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f api/.env ]; then
    echo "📝 Creating environment file..."
    cp api/.env.example api/.env
    echo "⚠️  Please edit api/.env and add your API keys before continuing."
    echo "   Required: OPENAI_API_KEY, GROQ_API_KEY"
    read -p "Press Enter after you've configured your API keys..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Start development servers
echo "🔨 Starting development servers..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend API will be available at: http://localhost:5000"
echo ""
echo "🎉 Starting in development mode with WebSocket support..."
npm run dev
