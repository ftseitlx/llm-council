# Multi-stage build for LLM Council
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python runtime stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy .env if it exists (Railway will provide env vars)
COPY .env* ./

# Expose port (Railway will set PORT env var)
EXPOSE 8001

# Start command
CMD python -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8001}
