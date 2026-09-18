"""Application configuration loaded from environment variables."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "postgresql://darukaa_user:darukaa_password@localhost:5432/darukaa_earth"
    jwt_secret: str = "supersecretkey_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    cors_origins: List[str] = ["http://localhost:5173"]
    environment: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
