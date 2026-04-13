import os
from pydantic_settings import BaseSettings

# Load .env from backend directory
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./saferoute.db"
    GOOGLE_MAPS_API_KEY: str = ""
    ROUTING_PROVIDER: str = "osrm"  # "google" or "osrm"
    OSRM_BASE_URL: str = "http://router.project-osrm.org"
    CORS_ORIGINS: str = "*"
    CRIME_QUERY_RADIUS_METERS: int = 200
    ROUTE_SAMPLE_INTERVAL_METERS: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
