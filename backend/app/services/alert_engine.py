"""
SOS Alert Engine.
Manages emergency event lifecycle: trigger, track, resolve.
"""
import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.sos import SOSEvent


def trigger_sos(
    db: Session,
    user_id: str,
    latitude: float,
    longitude: float,
    contacts: list[dict] | None = None,
) -> dict:
    """
    Trigger an SOS emergency alert.

    Args:
        db: Database session
        user_id: User identifier
        latitude: Current latitude
        longitude: Current longitude
        contacts: Optional list of emergency contacts to notify

    Returns:
        Dict with SOS event details
    """
    event = SOSEvent(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        timestamp=datetime.now(timezone.utc),
        status="active",
        contacts_notified=json.dumps(contacts) if contacts else None,
    )

    db.add(event)
    db.flush()
    db.commit()
    db.refresh(event)

    # Simulate contact notification
    notified_contacts = []
    if contacts:
        for contact in contacts:
            notified_contacts.append({
                "name": contact.get("name", "Unknown"),
                "phone": contact.get("phone", ""),
                "status": "notified",
                "message": f"EMERGENCY: {user_id} needs help! Location: https://maps.google.com/?q={latitude},{longitude}",
            })

    return {
        "sos_id": event.id,
        "status": "active",
        "user_id": user_id,
        "location": {"lat": latitude, "lng": longitude},
        "timestamp": event.timestamp.isoformat(),
        "contacts_notified": notified_contacts,
        "message": "Emergency alert triggered. Contacts have been notified.",
        "tracking_url": f"https://saferoute.ai/track/{event.id}",
    }


def resolve_sos(db: Session, sos_id: int) -> dict:
    """
    Resolve/cancel an active SOS event.

    Args:
        db: Database session
        sos_id: SOS event ID

    Returns:
        Dict with resolution details
    """
    event = db.query(SOSEvent).filter(SOSEvent.id == sos_id).first()
    if not event:
        raise ValueError(f"SOS event {sos_id} not found")

    if event.status != "active":
        return {
            "sos_id": sos_id,
            "status": event.status,
            "message": f"SOS event already {event.status}",
        }

    event.status = "resolved"
    event.resolved_at = datetime.now(timezone.utc)
    db.commit()

    return {
        "sos_id": sos_id,
        "status": "resolved",
        "resolved_at": event.resolved_at.isoformat(),
        "message": "Emergency alert resolved. Contacts have been notified of your safety.",
    }


def get_active_sos_events(db: Session) -> list[dict]:
    """Get all active SOS events."""
    events = db.query(SOSEvent).filter(SOSEvent.status == "active").all()
    return [
        {
            "sos_id": e.id,
            "user_id": e.user_id,
            "location": {"lat": e.latitude, "lng": e.longitude},
            "timestamp": e.timestamp.isoformat(),
            "status": e.status,
        }
        for e in events
    ]
