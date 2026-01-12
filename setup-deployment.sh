#!/bin/bash

# The Notes - Cloud Deployment Setup Script
# This script helps set up the deployment configuration

set -e

echo "🚀 The Notes - Cloud Deployment Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
print_success "Node.js is installed"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi
print_success "npm is installed"

if ! command -v git &> /dev/null; then
    print_error "git is not installed. Please install git."
    exit 1
fi
print_success "git is installed"

echo ""
echo "Choose deployment method:"
echo "1. Vercel + Railway (Recommended)"
echo "2. Docker Compose"
echo "3. Manual Setup"
read -p "Enter choice (1-3): " deployment_choice

case $deployment_choice in
    1)
        echo ""
        echo "Setting up for Vercel + Railway deployment..."
        
        # Install Vercel CLI
        echo "Installing Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI installed"
        
        # Install Railway CLI
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
        print_success "Railway CLI installed"
        
        echo ""
        print_warning "Next steps:"
        echo "1. Deploy frontend: cd frontend && vercel --prod"
        echo "2. Deploy backend: cd backend && railway up"
        echo "3. Update environment variables with deployment URLs"
        ;;
    2)
        echo ""
        echo "Setting up for Docker deployment..."
        
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker."
            exit 1
        fi
        print_success "Docker is installed"
        
        if ! command -v docker-compose &> /dev/null; then
            print_warning "docker-compose is not installed. Using 'docker compose' instead."
        fi
        
        # Create .env file if it doesn't exist
        if [ ! -f .env ]; then
            echo "Creating .env file..."
            # Generate JWT secret safely
            if command -v openssl &> /dev/null; then
                JWT_SECRET=$(openssl rand -hex 32)
            else
                print_warning "openssl not found. Using fallback method for JWT secret."
                JWT_SECRET=$(date +%s | sha256sum | base64 | head -c 32)
            fi
            
            cat > .env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
JWT_SECRET=${JWT_SECRET}
EOF
            print_success ".env file created. Please update with your actual values."
            print_warning "A random JWT_SECRET has been generated. Keep it secure!"
        fi
        
        echo ""
        print_warning "Next steps:"
        echo "1. Update .env file with your credentials"
        echo "2. Run: docker-compose up -d"
        ;;
    3)
        echo ""
        echo "Manual setup selected..."
        
        # Install dependencies
        echo "Installing frontend dependencies..."
        cd frontend
        npm install
        print_success "Frontend dependencies installed"
        
        cd ..
        echo "Installing backend dependencies..."
        cd backend
        npm install
        print_success "Backend dependencies installed"
        
        cd ..
        echo "Installing auth dependencies..."
        cd auth
        npm install
        print_success "Auth dependencies installed"
        
        cd ..
        echo ""
        print_warning "Next steps:"
        echo "1. Set up environment variables in backend/.env"
        echo "2. Set up environment variables in frontend/.env.production"
        echo "3. Build frontend: cd frontend && npm run build"
        echo "4. Start backend: cd backend && npm start"
        echo "5. Deploy built files to your hosting provider"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "======================================"
print_success "Setup complete!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md (Full documentation)"
echo "   - DEPLOYMENT.md (Quick deployment guide)"
echo ""
echo "🆘 Need help? Check the documentation or open an issue on GitHub"
