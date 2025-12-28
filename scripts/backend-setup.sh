#!/bin/bash

echo "🚀 Setting up NexusAI Backend..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  Warning: MongoDB Shell (mongosh) not found. Make sure MongoDB is installed and running."
else
    echo "✅ MongoDB Shell found"
fi
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
    echo "⚠️  IMPORTANT: Update the following variables in .env:"
    echo "   - JWT_SECRET (generate a secure random string)"
    echo "   - MONGODB_URI (if not using default)"
    echo "   - STRIPE_SECRET_KEY (for payment features)"
    echo "   - OPENAI_API_KEY (for AI features)"
    echo "   - EMAIL credentials (for email features)"
else
    echo "✅ .env file already exists"
fi
echo ""

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir logs
    echo "✅ Logs directory created"
fi
echo ""

echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update your .env file with proper configuration"
echo "   2. Make sure MongoDB is running"
echo "   3. Run 'npm run dev' to start the development server"
echo "   4. Visit http://localhost:5000/health to verify the server is running"
echo ""
echo "🔗 Useful commands:"
echo "   npm run dev     - Start development server with auto-reload"
echo "   npm start       - Start production server"
echo "   npm test        - Run tests"
echo "   npm run lint    - Run ESLint"
echo ""
echo "Happy coding! 🎉"
