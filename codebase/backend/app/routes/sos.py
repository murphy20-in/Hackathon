"""
SOS / Emergency endpoints.
POST /send-sos - Trigger emergency alert
POST /sos/resolve - Resolve active SOS
GET /sos/active - List active SOS events
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.alert_engine import trigger_sos, resolve_sos, get_active_sos_events

router = APIRouter()


class SOSRequest(BaseModel):
    user_id: str = "anonymous"
    location: dict  # {"lat": float, "lng": float}
    timestamp: str | None = None
    contacts: list[dict] | None = None  # [{"name": str, "phone": str}]


class SOSResolveRequest(BaseModel):
    sos_id: int


@router.post("/send-sos")
def send_sos(request: SOSRequest, db: Session = Depends(get_db)):
    """
    Trigger an SOS emergency alert.
    Logs the event, notifies contacts, and returns tracking info.
    """
    try:
        lat = request.location.get("lat")
        lng = request.location.get("lng")

        if lat is None or lng is None:
            raise HTTPException(status_code=400, detail="Location must include 'lat' and 'lng'")

        result = trigger_sos(
            db=db,
            user_id=request.user_id,
            latitude=float(lat),
            longitude=float(lng),
            contacts=request.contacts,
        )

        return {
            "status": "success",
            **result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SOS trigger failed: {str(e)}")


@router.post("/sos/resolve")
def sos_resolve(request: SOSResolveRequest, db: Session = Depends(get_db)):
    """Resolve an active SOS event."""
    try:
        result = resolve_sos(db, request.sos_id)
        return {"status": "success", **result}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/sos/active")
def get_active_sos(db: Session = Depends(get_db)):
    """List all active SOS events."""
    events = get_active_sos_events(db)
    return {
        "status": "success",
        "count": len(events),
        "events": events,
    }
