# tests/test_visual_experience.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.visual_engine.ai_debate_theater import AIDebateTheaterEngine
from app.visual_engine.gamification_engine import GamificationEngine
from app.visual_engine.rocket_launch_simulator import RocketLaunchSimulator
from app.visual_engine.software_universe_builder import SoftwareUniverseBuilder
from app.visual_engine.tech_debt_weather import TechDebtWeatherEngine
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_visual_temp.db")
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_software_universe_builder():
    db = TestingSessionLocal()
    try:
        builder = SoftwareUniverseBuilder()
        universe = builder.build_software_universe(db)
        assert universe["universe_name"] == "Acme Corp Software Galaxy"
        assert len(universe["hierarchy"]["repositories"]) == 3

        city = builder.build_software_city(db)
        assert len(city["districts"]) == 3

        orbit = builder.build_repository_orbit(db)
        assert len(orbit["orbiting_planets"]) == 4
    finally:
        db.close()


def test_tech_debt_weather_engine():
    db = TestingSessionLocal()
    try:
        engine_instance = TechDebtWeatherEngine()
        weather = engine_instance.get_weather_forecast(db)
        assert "overall_weather" in weather

        heartbeats = engine_instance.get_service_heartbeats(db)
        assert heartbeats["total_services"] == 4

        mission = engine_instance.get_mission_control_data(db)
        assert mission["system_status"] == "MISSION CONTROL OPERATIONAL"
    finally:
        db.close()


def test_rocket_launch_simulator():
    db = TestingSessionLocal()
    try:
        sim = RocketLaunchSimulator()
        launch_100k = sim.simulate_capacity_launch(db, "100K")
        assert launch_100k["architecture_blueprint"]["server_pods"] == 2

        launch_100m = sim.simulate_capacity_launch(db, "100M")
        assert launch_100m["architecture_blueprint"]["server_pods"] == 48

        portal = sim.get_time_portal_frames(db)
        assert len(portal["frames"]) == 4
    finally:
        db.close()


def test_ai_debate_theater():
    db = TestingSessionLocal()
    try:
        debate_engine = AIDebateTheaterEngine()
        stream = debate_engine.get_debate_stream(db, "Split Payments")
        assert stream["debate_status"] == "CONSENSUS_REACHED"
        assert len(stream["transcript"]) == 4

        mentor = debate_engine.get_ai_mentor_lesson(db, "Circular Dependencies")
        assert "Circular Dependencies" in mentor["topic"]
    finally:
        db.close()


def test_gamification_engine():
    db = TestingSessionLocal()
    try:
        game_engine = GamificationEngine()
        mission = game_engine.get_mission_mode_status(db)
        assert mission["mission_progress_pct"] == 75

        achievements = game_engine.get_achievements(db)
        assert achievements["total_available"] >= 4

        dna = game_engine.get_code_dna(db)
        assert dna["dna_metrics"]["reliability"] == 94
    finally:
        db.close()


def test_visual_experience_api_endpoints():
    assert client.get("/api/v1/visual/universe").status_code == 200
    assert client.get("/api/v1/visual/city").status_code == 200
    assert client.get("/api/v1/visual/orbit").status_code == 200
    assert client.get("/api/v1/visual/weather").status_code == 200
    assert client.get("/api/v1/visual/heartbeat").status_code == 200
    assert client.get("/api/v1/visual/mission-control").status_code == 200
    assert (
        client.post(
            "/api/v1/visual/simulate-scaling", json={"target_users_scale": "10M"}
        ).status_code
        == 200
    )
    assert client.get("/api/v1/visual/debate").status_code == 200
    assert client.get("/api/v1/visual/achievements").status_code == 200
    assert client.get("/api/v1/visual/code-dna").status_code == 200
