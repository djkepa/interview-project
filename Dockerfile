# =============================================================================
# Multi-stage Docker build for Next.js application
# Optimized for production with security best practices
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# Install all dependencies (including devDependencies for build)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

# Add metadata labels (best practice for container management)
LABEL maintainer="interview-project"
LABEL description="Next.js image upload application - dependencies stage"

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Using npm ci for deterministic builds
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Builder
# Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

LABEL description="Next.js image upload application - builder stage"

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Runner
# Production runtime with minimal footprint
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

LABEL description="Next.js image upload application - production"

WORKDIR /app

# Security: Create a non-root user to run the application
# This is a critical security best practice
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Create uploads directory with proper permissions
# This directory will be mounted as a volume for persistence
RUN mkdir -p /app/uploads && \
    chown -R nextjs:nodejs /app/uploads && \
    chmod 755 /app/uploads

# Security: Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check to ensure container is healthy
# Used by orchestration tools (Docker Compose, Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["npm", "start"]