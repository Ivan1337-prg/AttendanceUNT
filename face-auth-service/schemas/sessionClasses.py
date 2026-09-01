from pydantic import BaseModel, Field

class StartSession(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    radius_meters: int = Field(gt=0)
