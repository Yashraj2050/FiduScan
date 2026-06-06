"""
Public API Documentation Portal Router — FiduScan v6.6
Serves OpenAPI 3.1 specification, Interactive Explorer, and Guides.
"""

from fastapi import APIRouter, Request
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import JSONResponse, PlainTextResponse
import yaml

router = APIRouter()

# Serve standard Swagger UI (Interactive API Explorer)
@router.get("/explorer", include_in_schema=False)
async def custom_swagger_ui_html(req: Request):
    return get_swagger_ui_html(
        openapi_url="/api/v1/docs/openapi.json",
        title="FiduScan API - Interactive Explorer",
        swagger_ui_parameters={"tryItOutEnabled": True}
    )

# Serve ReDoc (Detailed API Reference)
@router.get("/reference", include_in_schema=False)
async def custom_redoc_ui_html(req: Request):
    return get_redoc_html(
        openapi_url="/api/v1/docs/openapi.json",
        title="FiduScan API - Detailed Reference"
    )

# Serve OpenAPI JSON
@router.get("/openapi.json", include_in_schema=False)
async def get_openapi_json(request: Request):
    app = request.app
    if not app.openapi_schema:
        # We assume main.py customizes app.openapi()
        app.openapi()
    return JSONResponse(app.openapi_schema)

# Serve OpenAPI YAML
@router.get("/openapi.yaml", include_in_schema=False)
async def get_openapi_yaml(request: Request):
    app = request.app
    if not app.openapi_schema:
        app.openapi()
    yaml_s = yaml.dump(app.openapi_schema, sort_keys=False)
    return PlainTextResponse(yaml_s, media_type="text/yaml")
