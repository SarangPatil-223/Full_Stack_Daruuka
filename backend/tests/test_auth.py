"""Tests for authentication endpoints."""
import pytest


def test_register_success(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "user@darukaa.earth",
        "full_name": "Darukaa User",
        "password": "securepassword",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "user@darukaa.earth"
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"email": "dup@darukaa.earth", "password": "securepassword"}
    client.post("/api/v1/auth/register", json=payload)
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 409


def test_register_weak_password(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "weak@darukaa.earth",
        "password": "short",
    })
    assert res.status_code == 422


def test_login_success(client):
    client.post("/api/v1/auth/register", json={
        "email": "login@darukaa.earth",
        "password": "securepassword",
    })
    res = client.post("/api/v1/auth/login", data={
        "username": "login@darukaa.earth",
        "password": "securepassword",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
    assert res.json()["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "email": "fail@darukaa.earth",
        "password": "securepassword",
    })
    res = client.post("/api/v1/auth/login", data={
        "username": "fail@darukaa.earth",
        "password": "wrongpassword",
    })
    assert res.status_code == 401


def test_me_authenticated(client, auth_headers):
    res = client.get("/api/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "test@darukaa.earth"


def test_me_unauthenticated(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
