"""
Crime data endpoints.
GET /crime-zones - Aggregated crime zones for heatmap display
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.geo_utils import get_aggregated_crime_zones

router = APIRouter()

# In-memory cache for crime zones (computed once, reused)
_crime_zones_cache: list[dict] | None = None


@router.get("/crime-zones")
def get_crime_zones(db: Session = Depends(get_db)):
    """
    Return aggregated crime zone data for heatmap overlay.
    Data is pre-aggregated into ~800 grid cells with risk levels.
    Cached after first computation.
    """
    global _crime_zones_cache

    if _crime_zones_cache is None:
        _crime_zones_cache = get_aggregated_crime_zones(db)

    return {
        "status": "success",
        "count": len(_crime_zones_cache),
        "zones": _crime_zones_cache,
    }


@router.get("/crime-zones/refresh")
def refresh_crime_zones(db: Session = Depends(get_db)):
    """Force refresh the crime zones cache."""
    global _crime_zones_cache
    _crime_zones_cache = get_aggregated_crime_zones(db)
    return {
        "status": "success",
        "count": len(_crime_zones_cache),
        "message": "Crime zones cache refreshed",
    }
