#!/bin/bash

###############################################################################
# Comprehensive Test Script
# Tests the application in both development and Docker environments
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

test_url() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    print_info "Testing: $description"
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$description (HTTP $status_code)"
        return 0
    else
        print_error "$description (Expected $expected_status, got $status_code)"
        return 1
    fi
}

wait_for_service() {
    local url=$1
    local max_attempts=$2
    local attempt=1
    
    print_info "Waiting for service at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            print_success "Service is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Service did not become ready after $max_attempts attempts"
    return 1
}

###############################################################################
# Main Test Suite
###############################################################################

print_header "Starting Comprehensive Test Suite"

# Check prerequisites
print_header "Checking Prerequisites"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not installed"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not installed"
    exit 1
fi

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker installed: $DOCKER_VERSION"
else
    print_error "Docker not installed (Docker tests will be skipped)"
    SKIP_DOCKER=true
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "docker-compose installed: $COMPOSE_VERSION"
else
    print_error "docker-compose not installed (Docker tests will be skipped)"
    SKIP_DOCKER=true
fi

# Test 1: Local Development Setup
if [ "$1" != "--docker-only" ]; then
    print_header "Test Suite 1: Local Development"
    
    print_info "Installing dependencies..."
    if npm install --silent; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    print_info "Starting development server..."
    npm run dev > /dev/null 2>&1 &
    DEV_PID=$!
    print_info "Development server PID: $DEV_PID"
    
    # Wait for dev server
    if wait_for_service "http://localhost:3000/api/health" 30; then
        print_success "Development server started"
        
        # Test health endpoint
        test_url "http://localhost:3000/api/health" "200" "Health check endpoint"
        
        # Test main page
        test_url "http://localhost:3000" "200" "Main application page"
        
        # Test non-existent image (should 404)
        test_url "http://localhost:3000/api/uploads/nonexistent.png" "404" "Non-existent image returns 404"
        
        print_success "Local development tests completed"
    else
        print_error "Development server failed to start"
    fi
    
    # Cleanup dev server
    print_info "Stopping development server..."
    kill $DEV_PID 2>/dev/null || true
    sleep 2
    print_success "Development server stopped"
fi

# Test 2: Docker Environment
if [ "$SKIP_DOCKER" != true ]; then
    print_header "Test Suite 2: Docker Environment"
    
    print_info "Cleaning up any existing containers..."
    docker-compose down -v > /dev/null 2>&1 || true
    
    print_info "Building Docker image (this may take a few minutes)..."
    if docker-compose build --no-cache > /dev/null 2>&1; then
        print_success "Docker image built successfully"
    else
        print_error "Docker build failed"
        docker-compose logs
        exit 1
    fi
    
    print_info "Starting Docker container..."
    if docker-compose up -d; then
        print_success "Docker container started"
        
        # Wait for container to be healthy
        print_info "Waiting for container to be healthy..."
        if wait_for_service "http://localhost:3000/api/health" 60; then
            print_success "Container is healthy"
            
            # Run Docker-specific tests
            test_url "http://localhost:3000/api/health" "200" "Docker: Health check endpoint"
            test_url "http://localhost:3000" "200" "Docker: Main application page"
            test_url "http://localhost:3000/api/uploads/nonexistent.png" "404" "Docker: Non-existent image returns 404"
            
            # Check container status
            print_info "Checking container health status..."
            HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' nextjs-interview-app 2>/dev/null || echo "unknown")
            if [ "$HEALTH_STATUS" = "healthy" ]; then
                print_success "Container health status: $HEALTH_STATUS"
            else
                print_error "Container health status: $HEALTH_STATUS"
            fi
            
            # Test persistence (restart container)
            print_info "Testing persistence by restarting container..."
            if docker-compose restart > /dev/null 2>&1; then
                print_success "Container restarted"
                
                # Wait for it to come back up
                if wait_for_service "http://localhost:3000/api/health" 60; then
                    print_success "Container came back online after restart"
                    test_url "http://localhost:3000/api/health" "200" "Health check after restart"
                else
                    print_error "Container failed to come back online"
                fi
            else
                print_error "Failed to restart container"
            fi
            
            # Check volume mount
            print_info "Checking volume mount..."
            if docker exec nextjs-interview-app test -d /app/uploads; then
                print_success "Uploads directory exists in container"
            else
                print_error "Uploads directory missing in container"
            fi
            
            if docker exec nextjs-interview-app test -w /app/uploads; then
                print_success "Uploads directory is writable in container"
            else
                print_error "Uploads directory is not writable in container"
            fi
            
            # Check logs for errors
            print_info "Checking container logs for errors..."
            ERROR_COUNT=$(docker-compose logs 2>&1 | grep -i error | wc -l)
            if [ "$ERROR_COUNT" -eq 0 ]; then
                print_success "No errors found in container logs"
            else
                print_error "Found $ERROR_COUNT errors in container logs"
                echo "Recent logs:"
                docker-compose logs --tail=20
            fi
            
        else
            print_error "Container failed to become healthy"
            echo "Container logs:"
            docker-compose logs
        fi
        
    else
        print_error "Failed to start Docker container"
        docker-compose logs
        exit 1
    fi
    
    # Cleanup
    print_info "Cleaning up Docker containers..."
    docker-compose down > /dev/null 2>&1
    print_success "Docker containers stopped and removed"
    
else
    print_info "Skipping Docker tests (Docker not available)"
fi

# Test 3: File Structure Check
print_header "Test Suite 3: File Structure Validation"

required_files=(
    "package.json"
    "Dockerfile"
    "docker-compose.yml"
    "next.config.ts"
    "app/page.tsx"
    "app/api/upload-image/route.ts"
    "app/api/uploads/[filename]/route.ts"
    "app/api/health/route.ts"
    "SOLUTION.md"
    "README.md"
    ".gitignore"
    ".env.example"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing: $file"
    fi
done

# Test 4: Code Quality
print_header "Test Suite 4: Code Quality Checks"

print_info "Running linter..."
if npm run lint --silent 2>&1 | grep -q "No ESLint warnings or errors"; then
    print_success "No linter errors"
else
    print_info "Linter output:"
    npm run lint
fi

print_info "Checking for sensitive data in git..."
if grep -r "aws_secret\|password\|api_key" --include="*.ts" --include="*.js" --include="*.tsx" --exclude-dir="node_modules" . 2>/dev/null | grep -v "// " | grep -v ".example"; then
    print_error "Potential secrets found in code"
else
    print_success "No sensitive data found in code"
fi

# Test Summary
print_header "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo -e "${BLUE}Total:  $TOTAL_TESTS${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed! 🎉${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed. Please review the output above.${NC}\n"
    exit 1
fi

