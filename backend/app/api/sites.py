"""Sites API — uses PostGIS for spatial geometry, returns GeoJSON for Mapbox."""
import json
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.database import get_db
from app.db.models import BiodiversityMetric, CarbonMetric, Project, Site, User
from app.schemas.site import (
    BiodiversityMetricResponse,
    CarbonMetricResponse,
    SiteCreate,
    SiteResponse,
    SiteUpdate,
)

router = APIRouter()


def _site_to_response(site: Site, db: Session) -> SiteResponse:
    """Convert ORM site to response schema, resolving PostGIS geometry to GeoJSON."""
    geojson = None
    if site.geometry is not None:
        raw = db.execute(ST_AsGeoJSON(site.geometry)).scalar()
        geojson = json.loads(raw) if raw else None

    data = SiteResponse(
        id=site.id,
        project_id=site.project_id,
        name=site.name,
        location=site.location,
        latitude=site.latitude,
        longitude=site.longitude,
        geometry=geojson,
        area=site.area,
        ecosystem_type=site.ecosystem_type,
        monitoring_status=site.monitoring_status,
        carbon_baseline=site.carbon_baseline,
        current_carbon_estimate=site.current_carbon_estimate,
        biodiversity_index=site.biodiversity_index,
        created_at=site.created_at,
        updated_at=site.updated_at,
    )
    return data


@router.get("/projects/{project_id}/sites", response_model=List[SiteResponse])
def list_project_sites(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[SiteResponse]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail={"code": "PROJECT_NOT_FOUND", "message": "Project not found"})
    sites = db.query(Site).filter(Site.project_id == project_id).all()
    return [_site_to_response(s, db) for s in sites]


@router.post("/projects/{project_id}/sites", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(
    project_id: UUID,
    site: SiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SiteResponse:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail={"code": "PROJECT_NOT_FOUND", "message": "Project not found"})

    site_data = site.model_dump(exclude={"geometry"})
    db_site = Site(**site_data, project_id=project_id)

    # Store GeoJSON polygon as PostGIS geometry
    if site.geometry:
        from geoalchemy2.shape import from_shape
        from shapely.geometry import shape
        db_site.geometry = f"SRID=4326;{shape(site.geometry).wkt}"

    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return _site_to_response(db_site, db)


@router.get("/sites/{site_id}", response_model=SiteResponse)
def get_site(
    site_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SiteResponse:
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail={"code": "SITE_NOT_FOUND", "message": "Site not found"})
    return _site_to_response(site, db)


@router.patch("/sites/{site_id}", response_model=SiteResponse)
def update_site(
    site_id: UUID,
    site_update: SiteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SiteResponse:
    db_site = db.query(Site).filter(Site.id == site_id).first()
    if not db_site:
        raise HTTPException(status_code=404, detail={"code": "SITE_NOT_FOUND", "message": "Site not found"})

    update_data = site_update.model_dump(exclude_unset=True, exclude={"geometry"})
    for key, value in update_data.items():
        setattr(db_site, key, value)

    if site_update.geometry is not None:
        from shapely.geometry import shape
        db_site.geometry = f"SRID=4326;{shape(site_update.geometry).wkt}"

    db.commit()
    db.refresh(db_site)
    return _site_to_response(db_site, db)


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(
    site_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    db_site = db.query(Site).filter(Site.id == site_id).first()
    if not db_site:
        raise HTTPException(status_code=404, detail={"code": "SITE_NOT_FOUND", "message": "Site not found"})
    db.delete(db_site)
    db.commit()


@router.get("/sites/{site_id}/carbon-metrics", response_model=List[CarbonMetricResponse])
def get_carbon_metrics(
    site_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[CarbonMetric]:
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail={"code": "SITE_NOT_FOUND", "message": "Site not found"})
    return db.query(CarbonMetric).filter(CarbonMetric.site_id == site_id).order_by(CarbonMetric.recorded_at).all()


@router.get("/sites/{site_id}/biodiversity-metrics", response_model=List[BiodiversityMetricResponse])
def get_biodiversity_metrics(
    site_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[BiodiversityMetric]:
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail={"code": "SITE_NOT_FOUND", "message": "Site not found"})
    return db.query(BiodiversityMetric).filter(BiodiversityMetric.site_id == site_id).order_by(BiodiversityMetric.recorded_at).all()
