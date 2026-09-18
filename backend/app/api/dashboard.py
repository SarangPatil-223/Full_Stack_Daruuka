"""Dashboard summary endpoint — returns portfolio KPIs without fetching full datasets."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.api.auth import get_current_user
from app.db.database import get_db
from app.db.models import Project, Site, CarbonMetric, BiodiversityMetric, User

router = APIRouter()


class DashboardSummary(BaseModel):
    total_projects: int
    total_sites: int
    total_area_ha: float
    avg_biodiversity_index: float | None
    avg_carbon_estimate: float | None
    projects_by_status: dict[str, int]


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardSummary:
    total_projects = db.query(func.count(Project.id)).scalar() or 0
    total_sites = db.query(func.count(Site.id)).scalar() or 0
    total_area = db.query(func.coalesce(func.sum(Site.area), 0.0)).scalar()
    avg_bio = db.query(func.avg(Site.biodiversity_index)).scalar()
    avg_carbon = db.query(func.avg(Site.current_carbon_estimate)).scalar()

    status_rows = (
        db.query(Project.status, func.count(Project.id))
        .group_by(Project.status)
        .all()
    )
    projects_by_status = {row[0]: row[1] for row in status_rows}

    return DashboardSummary(
        total_projects=total_projects,
        total_sites=total_sites,
        total_area_ha=round(total_area or 0.0, 2),
        avg_biodiversity_index=round(avg_bio, 3) if avg_bio else None,
        avg_carbon_estimate=round(avg_carbon, 2) if avg_carbon else None,
        projects_by_status=projects_by_status,
    )
