"""
Time-based risk intelligence.
Adjusts safety scores based on time-of-day, providing temporal context
for route risk assessments.
"""
from datetime import datetime, timezone


# Time period definitions with risk multipliers
TIME_PERIODS = {
    "morning": {
        "hours": range(6, 12),
        "multiplier": 0.6,
        "risk_level": "LOW",
        "label": "Morning",
        "description": "Daytime with high activity and visibility",
    },
    "afternoon": {
        "hours": range(12, 18),
        "multiplier": 0.8,
        "risk_level": "MEDIUM",
        "label": "Afternoon",
        "description": "Moderate activity, generally safe",
    },
    "evening": {
        "hours": range(18, 22),
        "multiplier": 1.2,
        "risk_level": "HIGH",
        "label": "Evening",
        "description": "Reduced visibility, decreasing foot traffic",
    },
    "night": {
        "hours": range(22, 24),  # 22-23, plus 0-5 handled below
        "multiplier": 1.5,
        "risk_level": "VERY_HIGH",
        "label": "Night",
        "description": "Low visibility, minimal foot traffic, highest risk",
    },
}


def get_time_period(hour: int) -> str:
    """
    Get the time period name for a given hour.

    Args:
        hour: Hour of day (0-23)

    Returns:
        Period name: "morning", "afternoon", "evening", or "night"
    """
    if 6 <= hour < 12:
        return "morning"
    elif 12 <= hour < 18:
        return "afternoon"
    elif 18 <= hour < 22:
        return "evening"
    else:  # 22-23 and 0-5
        return "night"


def get_time_multiplier(hour: int) -> float:
    """
    Get the risk multiplier for a given hour.
    Higher multiplier = higher risk.

    Args:
        hour: Hour of day (0-23)

    Returns:
        Risk multiplier (0.6 - 1.5)
    """
    period = get_time_period(hour)
    return TIME_PERIODS[period]["multiplier"]


def get_time_context(hour: int) -> dict:
    """
    Get full time context information for display.

    Args:
        hour: Hour of day (0-23)

    Returns:
        Dict with period info, multiplier, risk level, label, description
    """
    period = get_time_period(hour)
    info = TIME_PERIODS[period]
    return {
        "period": period,
        "multiplier": info["multiplier"],
        "risk_level": info["risk_level"],
        "label": info["label"],
        "description": info["description"],
        "hour": hour,
    }


def parse_time_of_day(time_str: str | None) -> int:
    """
    Parse a time-of-day string or return current hour.

    Args:
        time_str: One of "morning", "afternoon", "evening", "night", or None for current time

    Returns:
        Representative hour (0-23)
    """
    if time_str is None:
        return datetime.now().hour

    mapping = {
        "morning": 9,
        "afternoon": 14,
        "evening": 20,
        "night": 1,
        "day": 10,
    }
    return mapping.get(time_str.lower(), datetime.now().hour)
