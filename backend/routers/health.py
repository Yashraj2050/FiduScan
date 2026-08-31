"""
Health check router.
"""
import platform
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    version: str
    device: str
    model_loaded: bool
    platform: str


@router.get("/health", response_model=HealthResponse, summary="System Health Check")
async def health_check(request=None):
    """Returns system health including device availability and model state."""
    device = "Unknown"
    try:
        import torch
        if torch.backends.mps.is_available():
            device = "Apple Silicon MPS"
        elif torch.cuda.is_available():
            device = f"CUDA ({torch.cuda.get_device_name(0)})"
        else:
            device = "CPU"
    except ImportError:
        device = "PyTorch not loaded"

    return HealthResponse(
        status="operational",
        version="1.0.0",
        device=device,
        model_loaded=False, # We don't eagerly load anymore

        platform=platform.platform(),
    )
