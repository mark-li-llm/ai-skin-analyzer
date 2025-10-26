#!/bin/bash
# Next.js Development Setup Script
# Simple setup for Next.js full-stack app

echo "🚀 Setting up AI Skin Analyzer (Next.js)..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies (ONE command for the whole project!)
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Add your OpenAI API key to .env:"
    echo "   OPENAI_API_KEY=sk-proj-..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your OpenAI API key to .env"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:3000"
echo ""
