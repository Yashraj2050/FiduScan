"""
FiduScan — FastAPI Backend Entry Point
Anti-Gravity Phase 1: Hardened image forensic detection API
"""

import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

sys.path.insert(0, str(Path(__file__).parent.parent))

from routers import detect, health, audio, video, auth, history, apikeys, billing, watermark, reports, audio_watermark
from middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from database import engine
import models
from utils.logger import setup_logger

logger = setup_logger("fiduscan.main")

ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS", "http://localhost:3000,https://fiduscan.vercel.app,https://frontend-nu-ten-16.vercel.app"
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 FiduScan backend starting up...")
    
    models.Base.metadata.create_all(bind=engine)
    logger.info("✅ Database initialized.")
    
    from services.inference_service import InferenceService
    app.state.inference_service = InferenceService()
    app.state.inference_service.load_model()
    
    from services.audio_service import AudioInferenceService
    app.state.audio_service = AudioInferenceService()
    app.state.audio_service.load_model()
    
    from services.video_service import VideoInferenceService
    app.state.video_service = VideoInferenceService(app.state)
    
    logger.info("✅ Models loaded and Grad-CAM initialized.")
    yield
    logger.info("🛑 FiduScan backend shutting down.")


app = FastAPI(
    title="FiduScan — AI Forensic Detection API",
    description=(
        "Anti-Gravity Phase 1: Detects AI-generated vs authentic images. "
        "Returns prediction, confidence, EXIF metadata, forensic flags, "
        "and Grad-CAM explainability heatmaps."
    ),
    version="1.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ─── Rate Limiter ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ─── CORS (hardened) ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)

# ─── Security Headers Middleware ──────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src \'self\ ; img-src \'self\ data:; script-src \'self\ ; style-src \'self\ \'unsafe-inline\ ;"

    return response

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(detect.router, prefix="/api/v1", tags=["Detection"])
app.include_router(audio.router, prefix="/api/v1", tags=["Audio Detection"])
app.include_router(video.router, prefix="/api/v1", tags=["Video Detection"])
app.include_router(history.router, prefix="/api/v1", tags=["History"])
app.include_router(apikeys.router, prefix="/api/v1", tags=["API Keys"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["Billing"])
app.include_router(watermark.router, prefix="/api/v1/watermark", tags=["Watermark"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(audio_watermark.router, prefix="/api/v1/audio_watermark", tags=["Audio Watermark"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Incident logged."},
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
