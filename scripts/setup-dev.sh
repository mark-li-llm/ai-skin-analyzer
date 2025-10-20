#!/bin/bash

# Development Environment Setup Script
# Run this to set up your development environment

echo "🚀 Setting up Skin Analysis App development environment..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Install frontend dependencies
if [ -d "src/frontend" ]; then
    echo "📦 Installing frontend dependencies..."
    cd src/frontend
    npm install
    cd ../..
    echo "✅ Frontend dependencies installed"
fi

# Install backend dependencies
if [ -d "src/backend" ]; then
    echo "📦 Installing backend dependencies..."
    cd src/backend
    npm install
    cd ../..
    echo "✅ Backend dependencies installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# OpenAI API Configuration
OPENAI_API_KEY=your_api_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Application Configuration
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Optional: Image Storage
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
EOF
    echo "✅ .env file created. Please update with your actual values."
else
    echo "⏭️  .env file already exists"
fi

# Set up git hooks (optional)
if [ -d ".git" ]; then
    echo "🔗 Setting up git hooks..."
    # Add pre-commit hook here if needed
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your OpenAI API key and other config"
echo "2. Set up your database (see docs/03-database-schema.md)"
echo "3. Run 'npm run dev' to start development server"
echo ""
