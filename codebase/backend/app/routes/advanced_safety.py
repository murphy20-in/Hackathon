"""
Advanced safety mock endpoints for hackathon demo.
Implements identity verification, offline fallback, route sharing,
emergency stops, proximity detection, SOS escalation, and loop closure.
"""
from __future__ import annotations

import hashlib
import math
import random
import re
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.realtime_simulator import NETWORK_PROFILES

router = APIRouter()


class IdentityVerifyRequest(BaseModel):
    gov_id: str
    face_embedding: str


class LocationPayload(BaseModel):
    lat: float
    lon: float


class OfflineAlertRequest(BaseModel):
    user_id: str = "anonymous"
    location: LocationPayload
    eta_minutes: int = 0
    latency_ms: int = 0
    connected: bool = True
    emergency_contacts: list[str] = Field(default_factory=list)


class SOSTriggerRequest(BaseModel):
    user_id: str = "anonymous"
    location: LocationPayload
    network_mode: str = "5G"
    connected: bool = True
    emergency_contacts: list[str] = Field(default_factory=list)


class SOSCompleteRequest(BaseModel):
    user_id: str = "anonymous"
    status: str = "safe"


class RideShareRequest(BaseModel):
    app: str
    pickup: LocationPayload
    dropoff: LocationPayload
    route_geometry: list[dict] = Field(default_factory=list)


class ProximityScanRequest(BaseModel):
    user_id: str = "anonymous"
    tx_power: int = -59
    path_heading: float = 0.0
    devices: list[dict] = Field(default_factory=list)


class ThreatAssessRequest(BaseModel):
    user_id: str = "anonymous"
    rssi_threat_score: float = 0.0
    route_deviation_score: float = 0.0
    time_risk_score: float = 0.0
    crime_density_score: float = 0.0


_offline_retry_queue: list[dict] = []
_sos_sessions: dict[str, dict] = {}


def _seeded_random(seed_text: str) -> random.Random:
    digest = hashlib.md5(seed_text.encode()).hexdigest()[:8]
    return random.Random(int(digest, 16))


def _gov_id_valid(gov_id: str) -> bool:
    aadhaar_like = bool(re.fullmatch(r"\d{4}-\d{4}-\d{4}", gov_id))
    pan_like = bool(re.fullmatch(r"[A-Z]{5}[0-9]{4}[A-Z]", gov_id.upper()))
    return aadhaar_like or pan_like


def _face_confidence(face_embedding: str, gov_id: str) -> float:
    rng = _seeded_random(f"{gov_id}:{face_embedding}")
    return round(0.72 + (rng.random() * 0.26), 3)


def _sos_message(lat: float, lon: float, eta_minutes: int, status: str = "ACTIVE SOS") -> str:
    now_str = datetime.now().strftime("%H:%M")
    return (
        "🚨 HELP! Emergency Triggered\n\n"
        f"Location: https://maps.google.com/?q={lat},{lon}\n"
        f"Time: {now_str}\n"
        f"Status: {status}\n"
        f"Last known safe ETA: {max(eta_minutes, 0)} min"
    )


def _offline_message(lat: float, lon: float, eta_minutes: int) -> str:
    now_str = datetime.now().strftime("%H:%M")
    return (
        "🚨 HELP! Caution Alert\n"
        "User has entered low/no network zone.\n\n"
        f"Location: https://maps.google.com/?q={lat},{lon}\n"
        f"Time: {now_str}\n\n"
        f"Last known safe ETA: {max(eta_minutes, 0)} min"
    )


def _default_emergency_stops() -> list[dict]:
    return [
        {"type": "hospital", "name": "St. John Medical Center", "lat": 12.9352, "lon": 77.6204},
        {"type": "police", "name": "Koramangala Police Station", "lat": 12.9359, "lon": 77.6245},
        {"type": "pharmacy", "name": "24x7 MedPlus", "lat": 12.9382, "lon": 77.6183},
        {"type": "hospital", "name": "Manipal Hospital", "lat": 12.9598, "lon": 77.6488},
        {"type": "police", "name": "Ashok Nagar Police Station", "lat": 12.9744, "lon": 77.6064},
    ]


def _estimate_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


@router.post("/v1/auth/verify-identity")
def verify_identity(request: IdentityVerifyRequest):
    valid_id = _gov_id_valid(request.gov_id)
    confidence = _face_confidence(request.face_embedding, request.gov_id)
    verified = bool(valid_id and confidence > 0.8)
    return {
        "verified": verified,
        "confidence": confidence,
        "id_valid": valid_id,
        "message": "Identity Verified ✅" if verified else "Verification failed in mock validator",
    }


@router.post("/v1/sos/offline-alert")
def queue_or_send_offline_alert(request: OfflineAlertRequest):
    is_low_network = (not request.connected) or request.latency_ms > 140
    alert_payload = {
        "user_id": request.user_id,
        "location": request.location.model_dump(),
        "eta_minutes": request.eta_minutes,
        "message": _offline_message(request.location.lat, request.location.lon, request.eta_minutes),
        "contacts": request.emergency_contacts,
        "authorities": ["police_control_room", "city_women_safety_cell"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "retries": 0,
    }

    if is_low_network:
        _offline_retry_queue.append(alert_payload)
        return {
            "status": "queued",
            "queued_items": len(_offline_retry_queue),
            "message": "Low/no network detected. Alert queued for retry.",
            "alert": alert_payload,
        }

    return {
        "status": "sent",
        "queued_items": len(_offline_retry_queue),
        "message": "Network available. Offline caution alert sent.",
        "alert": alert_payload,
    }


@router.get("/v1/sos/retry-queue")
def get_retry_queue():
    return {
        "status": "success",
        "count": len(_offline_retry_queue),
        "items": _offline_retry_queue,
    }


@router.post("/v1/sos/retry-queue/flush")
def flush_retry_queue():
    flushed = []
    for item in _offline_retry_queue:
        item["retries"] = int(item.get("retries", 0)) + 1
        item["flushed_at"] = datetime.now(timezone.utc).isoformat()
        flushed.append(item)
    _offline_retry_queue.clear()
    return {
        "status": "success",
        "flushed_count": len(flushed),
        "message": "Queued alerts auto-sent after network recovery.",
        "items": flushed,
    }


@router.post("/v1/sos/trigger")
def trigger_enhanced_sos(request: SOSTriggerRequest):
    session_id = f"sos-{int(datetime.now().timestamp())}-{request.user_id}"
    payload = {
        "session_id": session_id,
        "user_id": request.user_id,
        "location": request.location.model_dump(),
        "message": _sos_message(request.location.lat, request.location.lon, 0),
        "network_mode": request.network_mode,
        "connected": request.connected,
        "authority_ping": True,
        "live_location_stream": True,
        "offline_fallback_enabled": True,
        "emergency_contacts": request.emergency_contacts,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    _sos_sessions[session_id] = {
        "status": "active",
        "payload": payload,
    }

    if not request.connected:
        _offline_retry_queue.append(
            {
                "user_id": request.user_id,
                "location": request.location.model_dump(),
                "message": payload["message"],
                "contacts": request.emergency_contacts,
                "authorities": ["police_control_room", "city_women_safety_cell"],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "retries": 0,
            }
        )

    return {
        "status": "success",
        **payload,
        "queued_offline_alerts": len(_offline_retry_queue),
    }


@router.post("/v1/sos/complete")
def complete_sos_loop(request: SOSCompleteRequest):
    now = datetime.now(timezone.utc).isoformat()
    return {
        "status": "success",
        "user_id": request.user_id,
        "result": request.status,
        "safe": request.status.lower() == "safe",
        "message": "Safety loop closed. Arrival confirmed." if request.status.lower() == "safe" else "Escalation remains active.",
        "completed_at": now,
    }


@router.get("/v1/maps/emergency-stops")
def emergency_stops(route_id: str = "default", lat: float | None = None, lon: float | None = None):
    stops = _default_emergency_stops()
    if lat is not None and lon is not None:
        for stop in stops:
            stop["distance_m"] = round(_estimate_distance_m(lat, lon, stop["lat"], stop["lon"]), 1)
        stops = sorted(stops, key=lambda s: s["distance_m"])
    nearest = stops[0] if stops else None
    return {
        "status": "success",
        "route_id": route_id,
        "nearest_safe_stop": nearest,
        "stops": stops,
    }


@router.post("/v1/rides/share-route")
def share_route_to_ride_app(request: RideShareRequest):
    app_name = request.app.lower()
    pickup = f"{request.pickup.lat},{request.pickup.lon}"
    dropoff = f"{request.dropoff.lat},{request.dropoff.lon}"
    deep_links = {
        "uber": f"uber://?action=setPickup&pickup={pickup}&dropoff={dropoff}",
        "ola": f"olacabs://app/launch?pickup={pickup}&drop={dropoff}",
        "rapido": f"rapido://book?pickup={pickup}&drop={dropoff}",
    }
    return {
        "status": "success",
        "app": request.app,
        "deep_link": deep_links.get(app_name, f"{app_name}://book?pickup={pickup}&drop={dropoff}"),
        "shared_points": len(request.route_geometry),
        "message": f"Route shared to {request.app.title()}",
    }


@router.post("/v1/proximity/scan")
def proximity_scan(request: ProximityScanRequest):
    n = 2.2
    devices = request.devices or [
        {"id": "dev-a", "rssi": -65, "duration_seconds": 150, "movement_similarity": 0.84},
        {"id": "dev-b", "rssi": -80, "duration_seconds": 50, "movement_similarity": 0.31},
    ]

    findings = []
    flagged = []
    for item in devices:
        rssi = float(item.get("rssi", -90))
        distance_m = round(10 ** ((request.tx_power - rssi) / (10 * n)), 2)
        duration = int(item.get("duration_seconds", 0))
        movement_similarity = float(item.get("movement_similarity", 0.0))
        is_threat = distance_m < 10 and duration > 120 and movement_similarity > 0.7

        label = "Device nearby (~3m)" if distance_m <= 3 else "Moving with you (~5–10m)" if distance_m <= 10 else "Nearby device (approximate)"
        result = {
            "id": item.get("id", "unknown"),
            "rssi": rssi,
            "distance_m": distance_m,
            "duration_seconds": duration,
            "movement_similarity": round(movement_similarity, 2),
            "approximate": True,
            "label": label,
            "threat": is_threat,
        }
        findings.append(result)
        if is_threat:
            flagged.append(result)

    return {
        "status": "success",
        "formula": "d = 10 ^ ((TxPower - RSSI) / (10 * n))",
        "tx_power": request.tx_power,
        "path_heading": request.path_heading,
        "findings": findings,
        "alert": "⚠️ A device has been consistently near you" if flagged else None,
        "flagged_count": len(flagged),
    }


@router.post("/v1/threat/assess")
def assess_behavioral_threat(request: ThreatAssessRequest):
    risk = (
        0.35 * request.rssi_threat_score
        + 0.25 * request.route_deviation_score
        + 0.2 * request.time_risk_score
        + 0.2 * request.crime_density_score
    )

    if risk >= 0.72:
        level = "high"
        action = "Suggest immediate SOS escalation"
    elif risk >= 0.45:
        level = "medium"
        action = "Soft alert with precaution guidance"
    else:
        level = "low"
        action = "Continue monitoring"

    return {
        "status": "success",
        "risk_score": round(risk, 3),
        "risk_level": level,
        "action": action,
        "inputs": request.model_dump(),
    }


@router.get("/v1/simulation/compare-5g")
def compare_4g_5g_sos():
    profile_4g = NETWORK_PROFILES["4G"]
    profile_5g = NETWORK_PROFILES["5G"]
    return {
        "status": "success",
        "comparison": {
            "4G": {
                "sos_latency_ms": profile_4g["latency_ms"],
                "route_update_interval_s": profile_4g["update_interval_seconds"],
                "risk_scoring_mode": "centralized",
            },
            "5G": {
                "sos_latency_ms": profile_5g["latency_ms"],
                "route_update_interval_s": profile_5g["update_interval_seconds"],
                "risk_scoring_mode": "edge-computed",
                "priority_sos_channel": True,
                "network_slicing": profile_5g["network_slicing"],
            },
        },
        "advantage_summary": "5G supports priority SOS channel + faster edge alerts for near real-time interventions.",
    }