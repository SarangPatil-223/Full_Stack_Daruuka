"""FastAPI application entry point."""
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import auth, dashboard, projects, sites
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Darukaa.Earth API",
    version="1.0.0",
    description="Geospatial analytics platform for carbon and biodiversity projects.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.info("%s %s → %d", request.method, request.url.path, response.status_code)
    return response


# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(sites.router, prefix="/api/v1", tags=["sites"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])


@app.get("/health", tags=["health"])
def health_check() -> dict:
    return {"status": "ok"}
