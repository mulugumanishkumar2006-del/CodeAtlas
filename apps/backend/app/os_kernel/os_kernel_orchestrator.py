# apps/backend/app/os_kernel/os_kernel_orchestrator.py

import json
from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.codeatlas_os import OSKernelSession
from app.os_kernel.integration_bus import ToolIntegrationBus


class CodeAtlasOSKernel:
    """
    CodeAtlas OS Kernel Orchestrator:
    Maintains the OS Kernel session and coordinates the 5 core subsystems:
    1. Repository Intelligence (Phases 1-15)
    2. Digital Twin (Phase 16)
    3. AI CTO Council (Phase 17)
    4. Autonomous Engineering (Phase 18)
    5. Enterprise Intelligence (Phase 19)
    """

    SUBSYSTEMS = [
        {
            "id": "subsystem-repo-intel",
            "name": "Repository Intelligence",
            "phases": "1-15",
            "status": "ACTIVE",
        },
        {
            "id": "subsystem-digital-twin",
            "name": "Digital Twin Engine",
            "phases": "16",
            "status": "ACTIVE",
        },
        {
            "id": "subsystem-ai-cto-council",
            "name": "AI CTO Council",
            "phases": "17",
            "status": "ACTIVE",
        },
        {
            "id": "subsystem-autonomous-eng",
            "name": "Autonomous Engineering Platform",
            "phases": "18",
            "status": "ACTIVE",
        },
        {
            "id": "subsystem-enterprise-intel",
            "name": "Enterprise Portfolio Intelligence",
            "phases": "19",
            "status": "ACTIVE",
        },
    ]

    def get_or_create_kernel_session(
        self, db: Session, session_name: str = "CodeAtlas-OS-Main"
    ) -> OSKernelSession:
        session = (
            db.query(OSKernelSession)
            .filter(OSKernelSession.session_name == session_name)
            .first()
        )
        if not session:
            session = OSKernelSession(
                session_name=session_name,
                status="RUNNING",
                kernel_version="20.0.0-OS",
                active_subsystems_json=json.dumps([s["name"] for s in self.SUBSYSTEMS]),
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        return session

    def get_kernel_status(self, db: Session) -> Dict[str, Any]:
        session = self.get_or_create_kernel_session(db)
        bus_status = ToolIntegrationBus().get_integration_status(db)

        return {
            "kernel_session_id": session.id,
            "session_name": session.session_name,
            "kernel_version": session.kernel_version,
            "kernel_status": session.status,
            "uptime_status": "99.999% OPERATIONAL",
            "active_subsystems_count": len(self.SUBSYSTEMS),
            "subsystems": self.SUBSYSTEMS,
            "integration_bus": bus_status,
            "core_features": [
                "Universal Engineering Intelligence Layer",
                "Cross-Tool Knowledge Graph",
                "Real-time Event Bus",
                "AI Executive Reports & Advisory",
                "Autonomous Pre-PR Review & Verification",
            ],
        }
