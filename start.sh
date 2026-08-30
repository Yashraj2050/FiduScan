#!/bin/bash

# Ensure robust exit on error
set -e

echo "Starting FastAPI backend..."
export PYTHONPATH=/app/backend
# Start FastAPI on port 8000 in the background
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!

echo "Waiting for FastAPI to initialize..."
# Wait a few seconds to let models load (if needed) or at least begin initializing
sleep 3

echo "Starting Next.js frontend proxy..."
export HOSTNAME="0.0.0.0"
export PORT=7860
# Next.js standalone outputs a minimal server.js
node frontend/server.js &
NEXTJS_PID=$!

# Define a robust signal handler
cleanup() {
    echo "Received termination signal. Stopping processes..."
    kill -TERM $FASTAPI_PID 2>/dev/null
    kill -TERM $NEXTJS_PID 2>/dev/null
    wait $FASTAPI_PID
    wait $NEXTJS_PID
    exit 0
}

# Trap termination signals
trap cleanup SIGINT SIGTERM

echo "Both processes started. Monitoring..."
# Wait for either process to exit
wait -n $FASTAPI_PID $NEXTJS_PID
EXIT_CODE=$?

echo "A critical process exited with code $EXIT_CODE. Shutting down..."
cleanup
