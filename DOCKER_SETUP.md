# Docker Setup Guide

This guide explains how to run the Resume Optimizer application using Docker Compose.

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. Build and Start Services

```bash
# Build and start both backend and frontend
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Common Commands

### View Logs

```bash
# View all services logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild Services

```bash
# Rebuild without cache
docker-compose up --build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

### Execute Commands in Container

```bash
# Access backend shell
docker-compose exec backend bash

# Access frontend shell
docker-compose exec frontend sh

# Run Python command in backend
docker-compose exec backend python -c "import sys; print(sys.version)"
```

## Service Details

### Backend Service
- **Container Name**: resume-optimizer-backend
- **Port**: 8000
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Health Check**: Enabled (checks every 10s)

### Frontend Service
- **Container Name**: resume-optimizer-frontend
- **Port**: 3000
- **Framework**: Next.js
- **Language**: Node.js 20
- **Health Check**: Enabled (checks every 10s)

## Troubleshooting

### Port Already in Use

If ports 3000 or 8000 are already in use, modify the `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Maps host port 8001 to container port 8000
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Backend Connection Issues

If the frontend can't connect to the backend:

1. Check backend logs: `docker-compose logs backend`
2. Verify the API URL in frontend: `NEXT_PUBLIC_API_URL=http://backend:8000`
3. Ensure backend is healthy: `docker-compose ps`

### Out of Memory

If Docker runs out of memory:

1. Increase Docker's memory allocation in Docker Desktop settings
2. Or reduce the number of services running

### Rebuild Everything

```bash
# Complete reset
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development Workflow

### Hot Reload

Both services support hot reload:

- **Backend**: Changes to Python files automatically reload
- **Frontend**: Changes to Next.js files automatically reload

### Adding Dependencies

**Backend (Python)**:
```bash
docker-compose exec backend pip install package-name
# Then update backend/requirements.txt
```

**Frontend (Node)**:
```bash
docker-compose exec frontend npm install package-name
```

## Production Considerations

For production deployment:

1. Update `docker-compose.yml` to use production builds
2. Remove volume mounts for code
3. Set `NODE_ENV=production` for frontend
4. Use environment-specific `.env` files
5. Configure proper CORS origins
6. Use a reverse proxy (nginx)
7. Enable HTTPS/SSL

## Network Communication

Services communicate via the `resume-optimizer-network` bridge network:

- Backend is accessible as `http://backend:8000` from frontend container
- Frontend is accessible as `http://frontend:3000` from backend container
- Both are accessible from host at `localhost:PORT`

## Monitoring

Check service status:

```bash
# List all containers
docker-compose ps

# View resource usage
docker stats

# Inspect service details
docker-compose exec backend curl http://localhost:8000/
```

