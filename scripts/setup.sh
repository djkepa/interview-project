#!/bin/bash

###############################################################################
# Setup Script
# Prepares the development environment
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

###############################################################################
# Main Setup
###############################################################################

print_header "Interview Project Setup"

# Check Node.js
print_info "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    echo "Error: Node.js is not installed"
    echo "Please install Node.js 20.x from https://nodejs.org/"
    exit 1
fi

# Check npm
print_info "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    echo "Error: npm is not installed"
    exit 1
fi

# Install dependencies
print_header "Installing Dependencies"
print_info "Running npm install..."
npm install
print_success "Dependencies installed"

# Create uploads directory
print_header "Creating Directories"
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    print_success "Created uploads directory"
else
    print_info "uploads directory already exists"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env file from .env.example..."
    cp .env.example .env
    print_success "Created .env file"
    print_info "Please review .env and update with your configuration"
else
    print_info ".env file already exists"
fi

# Check Docker (optional)
print_header "Checking Docker (Optional)"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker installed: $DOCKER_VERSION"
    
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        print_success "docker-compose installed: $COMPOSE_VERSION"
    else
        print_info "docker-compose not found (install for Docker support)"
    fi
else
    print_info "Docker not found (optional, but recommended for production testing)"
fi

# Display next steps
print_header "Setup Complete!"

echo -e "${GREEN}Your environment is ready!${NC}\n"
echo "Next steps:"
echo ""
echo "1. Start development server:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Open in browser:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "3. Test Docker deployment:"
echo "   ${BLUE}docker-compose up --build${NC}"
echo ""
echo "For more information, see:"
echo "  - README.md: Project overview"
echo "  - SOLUTION.md: Technical solution"
echo "  - TESTING.md: Testing guide"
echo "  - DEPLOYMENT.md: Deployment guide"
echo ""

print_success "Happy coding! 🚀"

