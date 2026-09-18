from pydantic import BaseModel, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from enum import Enum


class ProjectStatus(str, Enum):
    planning = "Planning"
    active = "Active"
    monitoring = "Monitoring"
    completed = "Completed"
    archived = "Archived"


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None
    status: ProjectStatus = ProjectStatus.planning
    start_date: Optional[date] = None
    target_date: Optional[date] = None
    total_area: Optional[float] = None
    organization: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Project name cannot be empty")
        return v.strip()


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    """All fields optional for PATCH semantics."""
    name: Optional[str] = None
    description: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None
    total_area: Optional[float] = None
    organization: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    """Paginated project list — provides total for frontend pagination."""
    items: List[ProjectResponse]
    total: int
    skip: int
    limit: int
