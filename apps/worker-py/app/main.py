"""FastAPI application entry point."""
from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.parse import router as parse_router
from app.routes.export import router as export_router

def create_app() -> FastAPI:
    app = FastAPI(title='Invoice Audit Parser', version='0.1.0')
    app.include_router(health_router)
    app.include_router(parse_router)
    app.include_router(export_router, prefix="/v1")
    return app

app = create_app()
