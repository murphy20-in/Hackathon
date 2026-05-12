"""
Core routing endpoints.
POST /get-routes - Fetch multiple route alternatives
POST /safe-route - Fetch routes with risk scoring and recommendation
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.routing import fetch_routes
from app.services.risk_engine import rank_routes
from app.services.time_risk import parse_time_of_day

router = APIRouter()


class RouteRequest(BaseModel):
    source: str
    destination: str


class RouteSafetyRequest(BaseModel):
    source: str
    destination: str
    time_of_day: str | None = None  # "morning", "afternoon", "evening", "night", or None for auto


@router.post("/get-routes")
async def get_routes(request: RouteRequest):
    """
    Fetch multiple route alternatives between source and destination.
    Returns raw routes without risk scoring.
    """
    try:
        routes = await fetch_routes(request.source, request.destination)
        if not routes:
            raise HTTPException(status_code=404, detail="No routes found between the given locations")
        return {
            "status": "success",
            "count": len(routes),
            "routes": routes,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route fetching failed: {str(e)}")


@router.post("/safe-route")
async def get_safe_route(request: RouteSafetyRequest, db: Session = Depends(get_db)):
    """
    Fetch routes and score them for safety, returning the safest recommendation.
    Considers crime data, time-of-day, and location risk factors.
    """
    try:
        # Fetch routes
        routes = await fetch_routes(request.source, request.destination)
        if not routes:
            raise HTTPException(status_code=404, detail="No routes found between the given locations")

        # Determine hour from time_of_day
        hour = parse_time_of_day(request.time_of_day)

        # Score and rank routes
        result = rank_routes(db, routes, hour)

        return {
            "status": "success",
            **result,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Safe route computation failed: {str(e)}")
