"""SQLAlchemy ORM models for Darukaa.Earth.

Design notes:
- UUID primary keys throughout to allow shard-safe IDs.
- PostGIS POLYGON(4326) geometry on Site is the source of truth for spatial data.
- GiST index on geometry is created in the Alembic migration.
- `project_type` avoids shadowing Python's built-in `type`.
- All tables have timezone-aware created_at/updated_at.
"""
import uuid

from geoalchemy2 import Geometry
from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    projects = relationship("Project", back_populates="creator")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    project_type = Column(String)  # renamed from `type` to avoid shadowing Python built-in
    status = Column(String, index=True, default="Planning", nullable=False)
    start_date = Column(Date)
    target_date = Column(Date)
    total_area = Column(Float)
    organization = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    creator = relationship("User", back_populates="projects")
    sites = relationship("Site", back_populates="project", cascade="all, delete-orphan")


class Site(Base):
    __tablename__ = "sites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    # PostGIS polygon — source of truth for spatial data. GiST index in migration.
    geometry = Column(Geometry("POLYGON", srid=4326))
    area = Column(Float)
    ecosystem_type = Column(String)
    monitoring_status = Column(String, default="Active", index=True)
    carbon_baseline = Column(Float)
    current_carbon_estimate = Column(Float)
    biodiversity_index = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    project = relationship("Project", back_populates="sites")
    carbon_metrics = relationship(
        "CarbonMetric", back_populates="site", cascade="all, delete-orphan"
    )
    biodiversity_metrics = relationship(
        "BiodiversityMetric", back_populates="site", cascade="all, delete-orphan"
    )


class CarbonMetric(Base):
    __tablename__ = "carbon_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id = Column(UUID(as_uuid=True), ForeignKey("sites.id"), nullable=False, index=True)
    recorded_at = Column(Date, nullable=False, index=True)
    co2e_tonnes = Column(Float, nullable=False)
    notes = Column(Text)

    site = relationship("Site", back_populates="carbon_metrics")


class BiodiversityMetric(Base):
    __tablename__ = "biodiversity_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id = Column(UUID(as_uuid=True), ForeignKey("sites.id"), nullable=False, index=True)
    recorded_at = Column(Date, nullable=False, index=True)
    index_score = Column(Float, nullable=False)
    species_count = Column(Integer)
    habitat_health = Column(String)

    site = relationship("Site", back_populates="biodiversity_metrics")
