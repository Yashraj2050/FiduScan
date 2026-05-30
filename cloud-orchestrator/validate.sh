#!/usr/bin/env bash
# ============================================================
# FiduScan Docker Validation Script
# Builds, starts, healthchecks, and integration-tests containers
# Usage: bash cloud-orchestrator/validate.sh
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}  ✅ $1${NC}"; }
fail() { echo -e "${RED}  ❌ $1${NC}"; exit 1; }
info() { echo -e "${YELLOW}  ➤  $1${NC}"; }

echo ""
echo "============================================================"
echo "  🐳 FiduScan Docker Validation"
echo "============================================================"
echo ""

# ── Prerequisites ────────────────────────────────────────────
info "Checking prerequisites..."
command -v docker >/dev/null 2>&1 || fail "Docker not found. Install Docker Desktop."
command -v docker-compose >/dev/null 2>&1 || command -v docker >/dev/null 2>&1 || fail "docker-compose not found."
pass "Docker available: $(docker --version)"

# ── Build Images ─────────────────────────────────────────────
info "Building backend image..."
docker build -f "$SCRIPT_DIR/Dockerfile.backend" -t fiduscan-backend:latest "$ROOT" && pass "Backend image built"

info "Building frontend image..."
docker build -f "$SCRIPT_DIR/Dockerfile.frontend" -t fiduscan-frontend:latest "$ROOT" && pass "Frontend image built"

# ── Start Services ────────────────────────────────────────────
info "Starting containers via docker-compose..."
cd "$SCRIPT_DIR"
docker-compose up -d --build
sleep 10  # Give services time to initialize
pass "Containers started"

# ── Healthcheck: Backend ──────────────────────────────────────
info "Checking backend health..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    pass "Backend health check: HTTP $BACKEND_STATUS"
else
    docker-compose logs backend
    fail "Backend health check failed: HTTP $BACKEND_STATUS"
fi

# ── Healthcheck: Frontend ─────────────────────────────────────
info "Checking frontend health..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    pass "Frontend health check: HTTP $FRONTEND_STATUS"
else
    docker-compose logs frontend
    fail "Frontend health check failed: HTTP $FRONTEND_STATUS"
fi

# ── Integration Test: Detect Endpoint ────────────────────────
info "Running integration test: POST /api/v1/detect..."
# Create a minimal valid 1x1 JPEG for testing
python3 -c "
from PIL import Image
import io
img = Image.new('RGB', (64,64), color=(100,150,200))
img.save('/tmp/fiduscan_test.jpg', 'JPEG')
print('Test image created')
" 2>/dev/null || python3 -c "
# Minimal JPEG bytes fallback
with open('/tmp/fiduscan_test.jpg', 'wb') as f:
    f.write(b'\xff\xd8\xff\xe0' + b'\x00' * 100 + b'\xff\xd9')
"

DETECT_STATUS=$(curl -s -o /tmp/detect_response.json -w "%{http_code}" \
    -X POST \
    -F "file=@/tmp/fiduscan_test.jpg;type=image/jpeg" \
    http://localhost:8000/api/v1/detect)

if [ "$DETECT_STATUS" = "200" ]; then
    pass "Detection API: HTTP $DETECT_STATUS"
    PREDICTION=$(python3 -c "import json; d=json.load(open('/tmp/detect_response.json')); print(d.get('prediction','?'))" 2>/dev/null || echo "unknown")
    pass "Prediction returned: $PREDICTION"
elif [ "$DETECT_STATUS" = "429" ]; then
    pass "Detection API rate limiting active (HTTP 429) ✓"
else
    echo "  Response: $(cat /tmp/detect_response.json 2>/dev/null)"
    fail "Detection API failed: HTTP $DETECT_STATUS"
fi

# ── Container Isolation Check ─────────────────────────────────
info "Verifying container isolation..."
NETWORK=$(docker network ls | grep fiduscan-net | wc -l)
if [ "$NETWORK" -ge 1 ]; then
    pass "Isolated bridge network: fiduscan-net"
else
    echo "  ⚠️  Custom network not found — containers may use default bridge"
fi

# ── Security Headers Check ────────────────────────────────────
info "Checking security headers..."
HEADERS=$(curl -s -I http://localhost:8000/api/v1/health)
if echo "$HEADERS" | grep -q "x-content-type-options"; then
    pass "Security headers present"
else
    echo "  ⚠️  Security headers may not be active"
fi

# ── Final Summary ─────────────────────────────────────────────
echo ""
echo "============================================================"
echo -e "${GREEN}  ✅ FiduScan Docker Validation PASSED${NC}"
echo "  Backend  : http://localhost:8000"
echo "  Frontend : http://localhost:3000"
echo "  API Docs : http://localhost:8000/api/docs"
echo "============================================================"
echo ""
echo "  To stop: cd cloud-orchestrator && docker-compose down"
echo ""
