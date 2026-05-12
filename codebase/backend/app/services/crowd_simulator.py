"""
Crowd density simulator.
Simulates crowd levels based on time-of-day and area characteristics.
Used to adjust risk perception - crowded areas are generally safer.
"""
import hashlib
import math
from datetime import datetime


# Area classifications for Bangalore
COMMERCIAL_AREAS = {
    "mg road", "brigade road", "commercial street", "indiranagar",
    "koramangala", "whitefield", "electronic city", "jayanagar",
    "malleshwaram", "rajajinagar", "ub city", "forum mall",
}

TRANSIT_HUBS = {
    "majestic", "kempegowda", "yeshwanthpur", "bangalore city",
    "kr puram", "silk board", "tin factory", "marathahalli",
}

RESIDENTIAL_AREAS = {
    "jp nagar", "btm layout", "hsr layout", "banashankari",
    "vijayanagar", "hebbal", "yelahanka", "rr nagar",
    "sadashivanagar", "frazer town",
}


def get_crowd_density(lat: float, lng: float, hour: int, area_name: str = "") -> dict:
    """
    Simulate crowd density for a given location and time.

    Args:
        lat: Latitude
        lng: Longitude
        hour: Hour of day (0-23)
        area_name: Optional area name for more accurate simulation

    Returns:
        Dict with crowd_level, density_score, impact_on_risk, description
    """
    area = area_name.lower().strip() if area_name else ""

    # Base density from area type
    if area in COMMERCIAL_AREAS:
        base = _commercial_density(hour)
    elif area in TRANSIT_HUBS:
        base = _transit_density(hour)
    elif area in RESIDENTIAL_AREAS:
        base = _residential_density(hour)
    else:
        base = _default_density(hour)

    # Add deterministic variation based on location (so same place = same density in demo)
    location_hash = hashlib.md5(f"{lat:.3f},{lng:.3f}".encode()).hexdigest()
    variation = (int(location_hash[:4], 16) % 20 - 10) / 100  # -0.10 to +0.10
    density_score = max(0.0, min(1.0, base + variation))

    # Crowd level classification
    if density_score > 0.7:
        crowd_level = "high"
    elif density_score > 0.4:
        crowd_level = "medium"
    else:
        crowd_level = "low"

    # Impact on risk: higher crowd = lower risk
    impact = -0.3 * density_score  # Max 30% risk reduction

    description = _get_description(crowd_level, hour)

    return {
        "crowd_level": crowd_level,
        "density_score": round(density_score, 2),
        "impact_on_risk": round(impact, 3),
        "description": description,
        "area_type": _classify_area(area),
    }


def _commercial_density(hour: int) -> float:
    """Commercial areas: busy during day, moderate evening, quiet at night."""
    if 10 <= hour < 21:
        return 0.8
    elif 7 <= hour < 10 or 21 <= hour < 23:
        return 0.5
    else:
        return 0.15


def _transit_density(hour: int) -> float:
    """Transit hubs: rush hour peaks, moderate otherwise."""
    if 7 <= hour < 10 or 17 <= hour < 20:
        return 0.9  # Rush hour
    elif 10 <= hour < 17:
        return 0.6
    elif 20 <= hour < 23:
        return 0.4
    else:
        return 0.1


def _residential_density(hour: int) -> float:
    """Residential areas: moderate mornings/evenings, lower during work hours."""
    if 7 <= hour < 9 or 18 <= hour < 21:
        return 0.6
    elif 9 <= hour < 18:
        return 0.3
    elif 21 <= hour < 23:
        return 0.4
    else:
        return 0.2


def _default_density(hour: int) -> float:
    """Default density curve using sine wave approximation."""
    # Peak at 2pm (hour 14), trough at 3am
    normalized = math.sin(math.pi * (hour - 3) / 18)
    return max(0.05, min(0.7, (normalized + 1) / 3))


def _classify_area(area: str) -> str:
    if area in COMMERCIAL_AREAS:
        return "commercial"
    elif area in TRANSIT_HUBS:
        return "transit_hub"
    elif area in RESIDENTIAL_AREAS:
        return "residential"
    return "general"


def _get_description(crowd_level: str, hour: int) -> str:
    descriptions = {
        "high": "High pedestrian activity. Well-populated area.",
        "medium": "Moderate foot traffic. Some people around.",
        "low": "Low pedestrian activity. Few people nearby.",
    }
    base = descriptions.get(crowd_level, "")
    if hour < 6 or hour >= 22:
        base += " Late night - limited visibility."
    return base
