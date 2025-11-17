# Next.js Interview Project - Image Upload Application

Production-ready Next.js application with Docker support for image uploads.

## ⚡ Quick Start

### Local Development (2 minutes)

```bash
npm install
npm run dev
```

Open http://localhost:3000 and upload an image!

### Docker (5 minutes)

```bash
docker-compose up --build
```

Wait for "healthy" status, then open http://localhost:3000

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 🎯 Problem & Solution

**Original Problem:** Images uploaded in Docker containers returned 404 errors.

**Root Cause:** Next.js production doesn't serve runtime-added files from `/public`.

**Solution:** Dynamic API endpoint (`/api/uploads/[filename]`) for consistent file serving.

**Details:** See [SOLUTION.md](SOLUTION.md)

---

## 📁 Project Structure

```
interview-project/
├── app/
│   ├── api/
│   │   ├── health/              # Health check endpoint
│   │   ├── upload-image/        # Image upload handler
│   │   └── uploads/[filename]/  # Dynamic image serving
│   └── page.tsx                 # Main UI (42 lines, clean!)
├── components/ImageUpload/      # Modular UI components
├── hooks/                       # Custom React hooks
├── lib/i18n/                    # Internationalization (i18n)
├── __tests__/                   # Jest unit tests
├── Dockerfile                   # Production-ready 3-stage build
├── docker-compose.yml           # Container orchestration
├── Makefile                     # Quick commands
└── SOLUTION.md                  # Technical documentation ⭐
```

---

## 🚀 Features

- ✅ Image upload with validation (10MB limit, type checking)
- ✅ Works in development & Docker
- ✅ Persistent storage (Docker volumes)
- ✅ Health check endpoint (`/api/health`)
- ✅ Security (non-root container, path traversal protection)
- ✅ Unit tests (Jest)
- ✅ Production-ready Docker setup
- ✅ i18n ready (internationalization)
- ✅ Modular components (separation of concerns)
- ✅ CI/CD pipelines (GitLab + GitHub Actions)

---

## 🧪 Testing

```bash
# Local testing
npm run dev
# Upload image at http://localhost:3000

# Docker testing
docker-compose up --build
# Upload image, restart container: docker-compose restart
# Image should still be accessible

# Health check
curl http://localhost:3000/api/health

# Run unit tests
npm test
```

---

## 📚 Documentation

- **[SOLUTION.md](SOLUTION.md)** - Complete technical solution & root cause analysis ⭐

---

## 🔧 Commands

### npm Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run quality          # Format + Lint + Type-check + Test (auto-fix)
npm run validate         # Full validation (CI mode, no auto-fix)
npm run lint             # Lint JS + CSS
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript check

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Docker (simplified)
npm run docker           # Start Docker (build + up in background)
npm run docker:down      # Stop Docker
npm run docker:logs      # View logs
npm run docker:restart   # Restart Docker
npm run health           # Health check

# CI/CD
npm run ci:test          # Full validation for CI
npm run ci:build         # Build + Test for CI
```

---

## 🏆 Solution Highlights

1. **Root Cause Analysis** - Deep understanding of Next.js static vs dynamic serving
2. **Production-Ready** - Security, monitoring, health checks, CI/CD
3. **Well-Tested** - Unit tests with Jest (API + React hooks)
4. **Clean Architecture** - Modular components, custom hooks, i18n
5. **Professional Setup** - Prettier, ESLint, Stylelint, Husky pre-commit hooks

---

## 👨‍💻 Author

**Branislav Grozdanovic**  
**Date:** November 17, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production-Ready

---

For detailed technical analysis, see **[SOLUTION.md](SOLUTION.md)**