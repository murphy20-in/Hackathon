"""
Real-time risk simulation.
Generates dynamic alerts and risk updates to demonstrate 5G capabilities.
Uses deterministic randomness for demo consistency.
"""
import hashlib
import random
from datetime import datetime

from app.services.crowd_simulator import get_crowd_density
from app.services.time_risk import get_time_context


# Alert pool - categorized by severity
ALERTS = {
    "info": [
        "Well-lit area with good visibility",
        "CCTV coverage detected in this zone",
        "Police patrol active in nearby area",
        "High pedestrian density - populated area",
        "Near major road with regular traffic",
        "Close to police station ({distance}m away)",
    ],
    "warning": [
        "Low pedestrian activity detected",
        "Entering area with moderate crime history",
        "Street lighting appears limited ahead",
        "Moving away from main road",
        "Reduced visibility zone ahead",
    ],
    "danger": [
        "Recent incident reported {distance}m away",
        "High-risk zone ahead - consider alternate route",
        "Very low foot traffic in this area",
        "Multiple incidents reported in last 30 days",
        "Isolated area with limited infrastructure",
    ],
}

# Network simulation profiles
NETWORK_PROFILES = {
    "5G": {
        "name": "5G",
        "latency_ms": 5,
        "bandwidth_mbps": 1000,
        "update_interval_seconds": 2,
        "edge_computing": True,
        "network_slicing": True,
        "description": "Ultra-low latency with edge computing",
    },
    "4G": {
        "name": "4G LTE",
        "latency_ms": 50,
        "bandwidth_mbps": 50,
        "update_interval_seconds": 15,
        "edge_computing": False,
        "network_slicing": False,
        "description": "Standard mobile broadband",
    },
    "3G": {
        "name": "3G",
        "latency_ms": 200,
        "bandwidth_mbps": 5,
        "update_interval_seconds": 30,
        "edge_computing": False,
        "network_slicing": False,
        "description": "Legacy mobile connection",
    },
}

# Module-level state for current network mode
_current_network_mode = "5G"


def set_network_mode(mode: str) -> dict:
    """Set the current simulated network mode."""
    global _current_network_mode
    mode = mode.upper()
    if mode not in NETWORK_PROFILES:
        raise ValueError(f"Invalid network mode: {mode}. Choose from: {list(NETWORK_PROFILES.keys())}")
    _current_network_mode = mode
    return get_network_status()


def get_network_status() -> dict:
    """Get current network simulation status."""
    profile = NETWORK_PROFILES[_current_network_mode]
    return {
        "mode": _current_network_mode,
        **profile,
    }


def simulate_real_time_risk(lat: float, lng: float, hour: int = None) -> dict:
    """
    Generate real-time risk assessment with dynamic alerts for a location.

    Uses deterministic hashing so the same location produces consistent
    alerts during a demo.

    Args:
        lat: Latitude
        lng: Longitude
        hour: Hour of day (defaults to current hour)

    Returns:
        Dict with alerts, crowd data, network info, and risk adjustments
    """
    if hour is None:
        hour = datetime.now().hour

    # Create deterministic seed from location
    seed = int(hashlib.md5(f"{lat:.4f},{lng:.4f},{hour}".encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)

    # Get crowd density
    crowd = get_crowd_density(lat, lng, hour)

    # Determine alert severity based on time and crowd
    time_ctx = get_time_context(hour)
    if time_ctx["period"] == "night" and crowd["crowd_level"] == "low":
        severity = rng.choice(["warning", "danger", "danger"])
    elif time_ctx["period"] == "evening" or crowd["crowd_level"] == "low":
        severity = rng.choice(["info", "warning", "warning"])
    else:
        severity = rng.choice(["info", "info", "warning"])

    # Pick alerts
    alert_text = rng.choice(ALERTS[severity])
    distance = rng.randint(100, 800)
    alert_text = alert_text.format(distance=distance)

    # Generate 1-3 alerts
    num_alerts = rng.randint(1, 3)
    alerts = [{"text": alert_text, "severity": severity, "distance_m": distance}]
    for _ in range(num_alerts - 1):
        extra_severity = rng.choice(["info", severity])
        extra_text = rng.choice(ALERTS[extra_severity])
        extra_dist = rng.randint(100, 1000)
        extra_text = extra_text.format(distance=extra_dist)
        alerts.append({"text": extra_text, "severity": extra_severity, "distance_m": extra_dist})

    # Compute dynamic risk adjustment
    risk_adjustment = 0.0
    if severity == "danger":
        risk_adjustment = 0.2
    elif severity == "warning":
        risk_adjustment = 0.1
    risk_adjustment += crowd["impact_on_risk"]  # Crowd reduces risk

    network = get_network_status()

    return {
        "location": {"lat": lat, "lng": lng},
        "alerts": alerts,
        "crowd_density": crowd,
        "time_context": time_ctx,
        "risk_adjustment": round(risk_adjustment, 3),
        "network": {
            "mode": network["mode"],
            "latency_ms": network["latency_ms"],
            "edge_computing": network["edge_computing"],
        },
        "computed_at": datetime.now().isoformat(),
        "edge_computed": network["edge_computing"],
    }
