"""Integration checks for the real Horizon backend. Run with pytest."""
import importlib
import os
from pathlib import Path

os.environ["APP_ENV"]="test"
os.environ["SEED_DEMO"]="1"
os.environ["APP_SECRET"]="test-secret-for-integrated-horizon-event-testing-012345"
os.environ["DATABASE_URL"]="sqlite:///./horizon-test.db"
os.environ["CORS_ORIGINS"]="https://royalpuskar.github.io"

from fastapi.testclient import TestClient
from app import app, Base, engine, SessionLocal, User, hasher

def test_horizon_core_flow():
    Base.metadata.drop_all(bind=engine)
    with TestClient(app) as client:
        health=client.get("/api/health")
        assert health.status_code==200 and health.json()["sample_data"] is True
        events=client.get("/api/events").json()
        assert len(events)>=3 and all(e["is_demo"] for e in events)
        assert client.get("/api/dashboard").json()["registrations"]==0

        def signup(name,email,role="student"):
            response=client.post("/api/auth/register",json={
                "name":name,"email":email,"password":"ExampleStrongPassword#2026","role":role})
            assert response.status_code==201,response.text
            return {"Authorization":"Bearer "+response.json()["access_token"]}

        student=signup("Study Student","student@horizon.test")
        another=signup("Second Student","second@horizon.test")
        assert client.get("/api/auth/me",headers=student).json()["role"]=="student"
        assert client.post("/api/auth/register",json={
            "name":"Admin Attempt","email":"fake@horizon.test",
            "password":"ExampleStrongPassword#2026","role":"admin"}).status_code==403
        assert client.get("/api/admin/analytics",headers=student).status_code==403

        registration=client.post(f"/api/events/{events[0]['id']}/register",headers=student)
        assert registration.status_code==201,registration.text
        registration_id=registration.json()["registration_id"]
        pass_token=registration.json()["pass"]
        assert client.post(f"/api/events/{events[0]['id']}/register",headers=student).status_code==409
        assert client.get(f"/api/registrations/{registration_id}/qr",headers=student).status_code==200
        assert client.post("/api/checkins",headers=student,json={"pass_token":pass_token}).status_code==403

        with SessionLocal() as db:
            admin=User(name="Organizer",email="admin@horizon.test",
                       hashed_password=hasher.hash("ExampleStrongPassword#2026"),role="admin")
            db.add(admin);db.commit()
        signed=client.post("/api/auth/login",json={"email":"admin@horizon.test","password":"ExampleStrongPassword#2026"})
        assert signed.status_code==200,signed.text
        administrator={"Authorization":"Bearer "+signed.json()["access_token"]}
        assert client.post("/api/checkins",headers=administrator,json={"pass_token":pass_token}).status_code==200
        assert client.post("/api/checkins",headers=administrator,json={"pass_token":pass_token}).status_code==409
        assert client.get("/api/dashboard").json()["attendance"]==1
        cert=client.post(f"/api/certificates/{registration_id}",headers=student)
        assert cert.status_code==200,cert.text
        cert_id=cert.json()["certificate_id"]
        assert client.get(f"/api/certificates/verify/{cert_id}").json()["verified"] is True
        pdf=client.get(f"/api/certificates/{cert_id}.pdf",headers=student)
        assert pdf.status_code==200 and pdf.content.startswith(b"%PDF")

        challenges=client.get("/api/cyber/challenges").json()
        assert challenges and all("correct" not in c for c in challenges)
        wrong=client.post(f"/api/cyber/{challenges[0]['id']}/answer",headers=student,json={"selected":1})
        assert wrong.status_code==200 and wrong.json()["correct"] is False
        right=client.post(f"/api/cyber/{challenges[0]['id']}/answer",headers=student,json={"selected":0})
        assert right.json()["correct"] is True
        again=client.post(f"/api/cyber/{challenges[0]['id']}/answer",headers=student,json={"selected":0})
        assert again.status_code==200
        scores=client.get("/api/leaderboard").json()
        assert scores and scores[0]["points"]==35  # attendance 10 + challenge 25

        projects=client.get("/api/expo").json()
        assert projects
        project_id=projects[0]["id"]
        assert client.post(f"/api/expo/{project_id}/vote",headers=student).status_code==201
        assert client.post(f"/api/expo/{project_id}/vote",headers=student).status_code==409
        assert client.post(f"/api/expo/{project_id}/vote",headers=another).status_code==201

        polls=client.get("/api/polls").json()
        assert polls
        poll_id=polls[0]["id"]
        assert client.post(f"/api/polls/{poll_id}/vote",headers=student,json={"selected":0}).status_code==201
        assert client.post(f"/api/polls/{poll_id}/vote",headers=student,json={"selected":0}).status_code==409
        assert client.get(f"/api/polls/{poll_id}/results").json()["total"]==1
        assert client.post("/api/admin/announcements",headers=administrator,json={"text":"Welcome to the demo!"}).status_code==201
        assert client.get("/api/admin/analytics",headers=administrator).json()["registrations"]==1
        assert "registration_id" in client.get("/api/admin/registrations.csv",headers=administrator).text
        assert client.post("/api/assistant/ask",json={"question":"When is the schedule?","language":"en"}).status_code==200
        assert client.post("/api/careers/recommend",json={"interests":["cybersecurity"]}).json()["recommendations"]
        assert client.get("/api/navigation").status_code==200
        assert client.get("/api/connect").status_code==200
    Base.metadata.drop_all(bind=engine)
    try:Path("horizon-test.db").unlink(missing_ok=True)
    except PermissionError:pass
