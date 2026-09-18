"""Tests for project CRUD endpoints."""


def test_create_project(client, auth_headers):
    res = client.post("/api/v1/projects/", json={
        "name": "Kibale Reforestation",
        "project_type": "Reforestation",
        "status": "Active",
    }, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Kibale Reforestation"
    assert data["status"] == "Active"


def test_create_project_empty_name(client, auth_headers):
    res = client.post("/api/v1/projects/", json={"name": "  "}, headers=auth_headers)
    assert res.status_code == 422


def test_list_projects(client, auth_headers):
    client.post("/api/v1/projects/", json={"name": "Project A"}, headers=auth_headers)
    client.post("/api/v1/projects/", json={"name": "Project B"}, headers=auth_headers)
    res = client.get("/api/v1/projects/", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


def test_list_projects_unauthenticated(client):
    res = client.get("/api/v1/projects/")
    assert res.status_code == 401


def test_get_project_not_found(client, auth_headers):
    res = client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000", headers=auth_headers)
    assert res.status_code == 404


def test_patch_project(client, auth_headers):
    create_res = client.post("/api/v1/projects/", json={"name": "Before Patch"}, headers=auth_headers)
    project_id = create_res.json()["id"]
    patch_res = client.patch(f"/api/v1/projects/{project_id}", json={"status": "Active"}, headers=auth_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Active"
    assert patch_res.json()["name"] == "Before Patch"  # unchanged


def test_delete_project(client, auth_headers):
    create_res = client.post("/api/v1/projects/", json={"name": "To Delete"}, headers=auth_headers)
    project_id = create_res.json()["id"]
    del_res = client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert del_res.status_code == 204
    get_res = client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert get_res.status_code == 404
