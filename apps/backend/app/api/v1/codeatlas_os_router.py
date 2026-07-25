# apps/backend/app/api/v1/codeatlas_os_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.os_kernel.integration_bus import ToolIntegrationBus
from app.os_kernel.os_kernel_orchestrator import CodeAtlasOSKernel
from app.os_kernel.universal_query_engine import UniversalEngineeringQueryEngine

router = APIRouter(prefix="/os", tags=["CodeAtlas OS Kernel"])


class OSQueryRequest(BaseModel):
    query_text: str
    session_name: Optional[str] = "CodeAtlas-OS-Main"

    model_config = ConfigDict(from_attributes=True)


class RegisterToolAdapterRequest(BaseModel):
    tool_name: str
    category: str
    endpoint_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


@router.get("/status")
def get_os_status(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return CodeAtlasOSKernel().get_kernel_status(db)


@router.post("/query", status_code=status.HTTP_200_OK)
def process_universal_query(
    req: OSQueryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    session = CodeAtlasOSKernel().get_or_create_kernel_session(db, req.session_name)
    return UniversalEngineeringQueryEngine().process_universal_query(
        db, session.id, req.query_text
    )


@router.get("/integrations")
def get_tool_integrations(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ToolIntegrationBus().get_integration_status(db)


@router.post("/integrations", status_code=status.HTTP_201_CREATED)
def register_tool_integration(
    req: RegisterToolAdapterRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return ToolIntegrationBus().register_tool_adapter(
        db, req.tool_name, req.category, req.endpoint_url
    )


@router.get("/desktop")
def get_desktop_shell_state(db: Session = Depends(get_db)) -> Dict[str, Any]:
    kernel_status = CodeAtlasOSKernel().get_kernel_status(db)
    return {
        "desktop_title": "CodeAtlas OS Desktop Shell v20.0.0",
        "kernel_status": kernel_status["kernel_status"],
        "subsystems_loaded": kernel_status["active_subsystems_count"],
        "window_dock": [
            {
                "id": "win-repo-intel",
                "title": "Repository Intelligence",
                "route": "/repository-dna",
            },
            {
                "id": "win-digital-twin",
                "title": "Digital Twin Engine",
                "route": "/scenario-simulator",
            },
            {"id": "win-ai-council", "title": "AI CTO Council", "route": "/council"},
            {
                "id": "win-autonomous",
                "title": "Autonomous Engineering",
                "route": "/autonomous",
            },
            {
                "id": "win-enterprise",
                "title": "Enterprise Portfolio",
                "route": "/enterprise",
            },
        ],
        "system_tray": {
            "notifications_active": 0,
            "security_alerts": 3,
            "event_bus_fps": 60,
        },
    }
