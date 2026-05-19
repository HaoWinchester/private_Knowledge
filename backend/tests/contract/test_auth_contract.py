from __future__ import annotations

import httpx


async def test_register_login_and_me_use_database_session(client: httpx.AsyncClient) -> None:
    register_response = await client.post(
        "/auth/register",
        json={
            "email": "tester@example.com",
            "password": "Passw0rd!",
            "displayName": "测试用户",
            "departmentName": "知识中台",
            "role": "knowledge_admin",
        },
    )

    assert register_response.status_code == 201
    registered = register_response.json()
    assert registered["token"].startswith("pk_")
    assert registered["user"]["displayName"] == "测试用户"

    me_response = await client.get(
        "/me",
        headers={"authorization": f"Bearer {registered['token']}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["displayName"] == "测试用户"

    login_response = await client.post(
        "/auth/login",
        json={"email": "tester@example.com", "password": "Passw0rd!"},
    )
    assert login_response.status_code == 200
    assert login_response.json()["user"]["userId"] == registered["user"]["userId"]


async def test_auth_rejects_duplicate_and_bad_password(client: httpx.AsyncClient) -> None:
    payload = {
        "email": "duplicate@example.com",
        "password": "Passw0rd!",
        "displayName": "重复用户",
        "departmentName": "售前咨询",
        "role": "domain_expert",
    }
    assert (await client.post("/auth/register", json=payload)).status_code == 201

    duplicate_response = await client.post("/auth/register", json=payload)
    assert duplicate_response.status_code == 409

    bad_login_response = await client.post(
        "/auth/login",
        json={"email": "duplicate@example.com", "password": "wrong-password"},
    )
    assert bad_login_response.status_code == 401


async def test_quick_login_account_is_seeded(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/auth/login",
        json={"email": "admin@puhua.local", "password": "Puhua@2026"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["user"]["displayName"] == "李晓楠"
    assert "knowledge_admin" in payload["user"]["roles"]
