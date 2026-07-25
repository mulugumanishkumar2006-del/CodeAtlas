# apps/backend/app/api/v1/codeatlas_os_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.os_kernel.engineering_memory_os import EngineeringMemoryOS
from app.os_kernel.integration_hub import ToolIntegrationBus
from app.os_kernel.live_timeline_engine import LiveEngineeringTimelineEngine
from app.os_kernel.os_kernel_orchestrator import CodeAtlasOSKernel
from app.os_kernel.platform_sdk_engine import PlatformSDKEngine
from app.os_kernel.role_dashboard_engine import RoleDashboardEngine
from app.os_kernel.universal_query_engine import UniversalEngineeringQueryEngine
from app.os_kernel.universal_search_engine import UniversalSearchEngine

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


class RecordMemoryItemRequest(BaseModel):
    memory_type: str
    title: str
    content: str
    author_role: Optional[str] = "Architect"
    repository_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RecordTimelineEventRequest(BaseModel):
    event_type: str
    title: str
    details: str
    severity: Optional[str] = "INFO"
    repository_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RegisterPluginRequest(BaseModel):
    plugin_name: str
    description: str
    version: Optional[str] = "1.0.0"
    author: Optional[str] = "Custom Developer"

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


@router.get("/search")
def search_universal_domains(
    q: str = Query("Authentication", description="Search query string"),
    domain: Optional[str] = Query(None, description="Target domain filter"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return UniversalSearchEngine().search_all_domains(db, q, domain)


@router.get("/memory")
def get_engineering_memory(
    memory_type: Optional[str] = Query(None, description="Memory type filter"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return EngineeringMemoryOS().get_memory_records(db, memory_type)


@router.post("/memory", status_code=status.HTTP_201_CREATED)
def record_engineering_memory(
    req: RecordMemoryItemRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return EngineeringMemoryOS().record_memory_item(
        db,
        req.memory_type,
        req.title,
        req.content,
        req.author_role,
        req.repository_id,
    )


@router.get("/timeline")
def get_live_engineering_timeline(
    event_type: Optional[str] = Query(None, description="Event type filter"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return LiveEngineeringTimelineEngine().get_timeline_replay_stream(db, event_type)


@router.post("/timeline", status_code=status.HTTP_201_CREATED)
def record_timeline_event(
    req: RecordTimelineEventRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return LiveEngineeringTimelineEngine().record_timeline_event(
        db,
        req.event_type,
        req.title,
        req.details,
        req.severity,
        req.repository_name,
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


@router.get("/roles/{role}")
def get_role_dashboard(role: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RoleDashboardEngine().get_role_dashboard(db, role)


@router.get("/plugins")
def get_marketplace_plugins(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return PlatformSDKEngine().get_marketplace_plugins(db)


@router.post("/plugins", status_code=status.HTTP_201_CREATED)
def register_platform_plugin(
    req: RegisterPluginRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return PlatformSDKEngine().register_plugin(
        db, req.plugin_name, req.description, req.version, req.author
    )


@router.get("/desktop")
def get_desktop_shell_state(db: Session = Depends(get_db)) -> Dict[str, Any]:
    kernel_status = CodeAtlasOSKernel().get_kernel_status(db)
    return {
        "desktop_title": "CodeAtlas OS Desktop Shell v20.0.0",
        "kernel_status": kernel_status["kernel_status"],
        "subsystems_loaded": kernel_status["active_subsystems_count"],
        "all_40_features_active": True,
        "window_dock": [
            {"id": "win-workspace", "title": "Unified Workspace", "route": "/os"},
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
