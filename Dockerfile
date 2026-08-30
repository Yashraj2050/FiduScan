# Stage 1: Build the Next.js frontend
FROM node:20-slim AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build

# Stage 2: Runtime environment (Python 3.10 + Node.js)
FROM python:3.10-slim

# Install Node.js 20 and necessary system dependencies for OpenCV/ML
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    libgl1 \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend and install Python requirements
COPY backend/requirements.txt /app/backend/
# Hugging Face caches default to ~/.cache/huggingface, which is fine for Spaces
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source code
COPY backend/ /app/backend/

# Copy Next.js standalone build from builder stage
COPY --from=builder /app/frontend/.next/standalone /app/frontend/
COPY --from=builder /app/frontend/.next/static /app/frontend/.next/static/
COPY --from=builder /app/frontend/public /app/frontend/public/

# Copy startup script
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Expose Hugging Face Space port
EXPOSE 7860

# Start both FastAPI and Next.js
CMD ["/app/start.sh"]
