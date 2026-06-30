from pydantic import BaseModel


class SystemHealth(BaseModel):
    status: str
    environment: str
    project_name: str
