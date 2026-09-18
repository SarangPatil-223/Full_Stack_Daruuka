"""Pytest fixtures shared across test modules."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.database import Base, get_db
from app.main import app

# Use SQLite for tests — no PostGIS required; spatial tests use the real DB
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=False)
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    """Register + login and return Authorization headers."""
    client.post("/api/v1/auth/register", json={
        "email": "test@darukaa.earth",
        "full_name": "Test User",
        "password": "testpassword123",
    })
    res = client.post("/api/v1/auth/login", data={
        "username": "test@darukaa.earth",
        "password": "testpassword123",
    })
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
