"""Site schemas — GeoJSON geometry is used for PostGIS interop."""
from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from enum import Enum


class EcosystemType(str, Enum):
    tropical_forest = "Tropical Forest"
    mangrove = "Mangrove"
    grassland = "Grassland"
    wetland = "Wetland"
    savanna = "Savanna"
    coastal = "Coastal"
    other = "Other"


class MonitoringStatus(str, Enum):
    active = "Active"
    paused = "Paused"
    completed = "Completed"


class SiteBase(BaseModel):
    name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area: Optional[float] = None
    ecosystem_type: Optional[EcosystemType] = None
    monitoring_status: MonitoringStatus = MonitoringStatus.active
    carbon_baseline: Optional[float] = None
    current_carbon_estimate: Optional[float] = None
    biodiversity_index: Optional[float] = None


class SiteCreate(SiteBase):
    # GeoJSON polygon geometry as dict — stored as PostGIS POLYGON
    geometry: Optional[Any] = None


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area: Optional[float] = None
    ecosystem_type: Optional[EcosystemType] = None
    monitoring_status: Optional[MonitoringStatus] = None
    carbon_baseline: Optional[float] = None
    current_carbon_estimate: Optional[float] = None
    biodiversity_index: Optional[float] = None
    geometry: Optional[Any] = None


class SiteResponse(SiteBase):
    id: UUID
    project_id: UUID
    # GeoJSON geometry returned for Mapbox consumption
    geometry: Optional[Any] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CarbonMetricResponse(BaseModel):
    id: UUID
    site_id: UUID
    recorded_at: Any
    co2e_tonnes: float
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


class BiodiversityMetricResponse(BaseModel):
    id: UUID
    site_id: UUID
    recorded_at: Any
    index_score: float
    species_count: Optional[int] = None
    habitat_health: Optional[str] = None

    model_config = {"from_attributes": True}
