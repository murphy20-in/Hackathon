"""
SafeRoute AI - Risk Scoring Engine

Multi-factor risk scoring for route segments and complete routes.
Factors:
  1. Crime Density (weight: 0.30)
  2. Severity Average (weight: 0.25)
  3. Category Weight - women safety focus (weight: 0.20)
  4. Recency - recent crimes weighted more (weight: 0.15)
  5. Infrastructure proxy (weight: 0.10)

Score is multiplied by time-of-day multiplier for temporal awareness.
"""
from datetime import datetime, timedelta
from statistics import mean
from sqlalchemy.orm import Session

from app.services.geo_utils import get_crimes_near_point, sample_points_along_route
from app.services.time_risk import get_time_multiplier, get_time_period, get_time_context
from app.utils.polyline_decoder import decode_polyline


# ─── Crime Category Weights ────────────────────────────────────────
# Higher weight = more relevant to women's safety (0.0 - 1.0)
CRIME_WEIGHTS = {
    # High relevance to women's safety
    "molestation": 1.0,
    "rape": 1.0,
    "eve_teasing": 0.95,
    "sexual_harassment": 0.95,
    "murder": 0.95,
    "kidnapping": 0.9,
    "child_abuse": 0.9,
    "stalking": 0.9,
    "domestic_violence": 0.85,
    "dowry_crime": 0.85,
    "culpable_homicide": 0.9,
    # Moderate relevance
    "assault": 0.8,
    "robbery": 0.75,
    "chain_snatching": 0.75,
    "dacoity": 0.75,
    "rioting": 0.7,
    "criminal_intimidation": 0.7,
    "extortion": 0.65,
    "arms_violation": 0.6,
    "arson": 0.6,
    "abetment": 0.6,
    # Lower relevance
    "theft": 0.5,
    "burglary": 0.5,
    "affray": 0.5,
    "trespass": 0.45,
    "accident": 0.4,
    "negligence": 0.35,
    "cyber_crime": 0.3,
    "cheating": 0.3,
    "forgery": 0.3,
    "breach_of_trust": 0.3,
    "narcotics": 0.3,
    "other": 0.3,
    "counterfeiting": 0.2,
    "gambling": 0.2,
    "excise_violation": 0.2,
    "prohibition": 0.2,
}

# Risk factor weights (must sum to 1.0)
FACTOR_WEIGHTS = {
    "crime_density": 0.30,
    "severity_avg": 0.25,
    "category_max": 0.20,
    "recency": 0.15,
    "infrastructure": 0.10,
}

# Thresholds
MAX_CRIME_DENSITY = 50  # Normalize crime count against this max
RECENCY_CUTOFF_DAYS = 730  # 2 years


def get_crime_weight(crime_type: str) -> float:
    """Get the safety-relevance weight for a crime type."""
    return CRIME_WEIGHTS.get(crime_type.lower().strip(), 0.3)


def compute_point_risk(
    db: Session, lat: float, lon: float, hour: int, radius: float = 200
) -> dict:
    """
    Compute risk score for a single point based on nearby crime data.

    Args:
        db: Database session
        lat: Point latitude
        lon: Point longitude
        hour: Current hour (0-23) for time-based adjustment
        radius: Search radius in meters

    Returns:
        Dict with score, factors, and metadata
    """
    crimes = get_crimes_near_point(db, lat, lon, radius)

    if not crimes:
        return {
            "score": 0.0,
            "factors": {k: 0.0 for k in FACTOR_WEIGHTS},
            "crime_count": 0,
            "risk_level": "low",
            "color": "#4CAF50",
        }

    # Factor 1: Crime Density (count normalized against max)
    density = min(len(crimes) / MAX_CRIME_DENSITY, 1.0)

    # Factor 2: Severity Average (mean category weight of nearby crimes)
    weights = [get_crime_weight(c["crime_type"]) for c in crimes]
    severity_avg = mean(weights)

    # Factor 3: Category Max (worst nearby crime type)
    category_max = max(weights)

    # Factor 4: Recency (fraction of crimes in last 2 years)
    cutoff = datetime.now() - timedelta(days=RECENCY_CUTOFF_DAYS)
    recent_count = sum(1 for c in crimes if c["timestamp"] and c["timestamp"] >= cutoff)
    recency = recent_count / len(crimes)

    # Factor 5: Infrastructure proxy (inverse of density - denser areas = more infrastructure)
    infrastructure = 1.0 - density

    # Compute weighted raw score
    factors = {
        "crime_density": density,
        "severity_avg": severity_avg,
        "category_max": category_max,
        "recency": recency,
        "infrastructure": infrastructure,
    }

    raw_score = sum(FACTOR_WEIGHTS[k] * factors[k] for k in FACTOR_WEIGHTS)

    # Apply time multiplier
    time_mult = get_time_multiplier(hour)
    final_score = min(raw_score * time_mult, 1.0)

    # Determine risk level and color
    if final_score > 0.6:
        risk_level = "high"
        color = "#F44336"
    elif final_score > 0.3:
        risk_level = "medium"
        color = "#FFC107"
    else:
        risk_level = "low"
        color = "#4CAF50"

    return {
        "score": round(final_score, 4),
        "factors": {k: round(v, 4) for k, v in factors.items()},
        "crime_count": len(crimes),
        "risk_level": risk_level,
        "color": color,
    }


def score_route(
    db: Session, polyline_encoded: str, hour: int,
    sample_interval: float = 100, query_radius: float = 200
) -> dict:
    """
    Score an entire route by sampling points and computing risk at each.

    Args:
        db: Database session
        polyline_encoded: Google-encoded polyline string
        hour: Hour of day for time context
        sample_interval: Distance between sample points (meters)
        query_radius: Crime search radius per point (meters)

    Returns:
        Dict with overall score, risk level, segments, and summary
    """
    # Decode polyline into coordinates
    coordinates = decode_polyline(polyline_encoded)
    if not coordinates:
        return _empty_route_score()

    # Sample points along the route
    sample_points = sample_points_along_route(coordinates, sample_interval)
    if not sample_points:
        return _empty_route_score()

    # Score each sample point
    segments = []
    for i, (lat, lon) in enumerate(sample_points):
        point_risk = compute_point_risk(db, lat, lon, hour, query_radius)
        segments.append({
            "index": i,
            "lat": lat,
            "lng": lon,
            "score": point_risk["score"],
            "risk_level": point_risk["risk_level"],
            "color": point_risk["color"],
            "crime_count": point_risk["crime_count"],
        })

    # Aggregate scores
    scores = [s["score"] for s in segments]
    avg_score = mean(scores) if scores else 0
    max_score = max(scores) if scores else 0
    risk_score = round(avg_score * 100, 1)  # Scale to 0-100

    # Safety score (inverted: 10 = safest)
    safety_score = round(10 * (1 - avg_score), 1)

    # Count risk levels
    high_risk = sum(1 for s in segments if s["risk_level"] == "high")
    medium_risk = sum(1 for s in segments if s["risk_level"] == "medium")
    low_risk = sum(1 for s in segments if s["risk_level"] == "low")

    # Overall risk level
    if risk_score > 60:
        overall_risk = "high"
    elif risk_score > 30:
        overall_risk = "medium"
    else:
        overall_risk = "low"

    # Generate message
    message = _generate_route_message(overall_risk, high_risk, len(segments), hour)

    return {
        "risk_score": risk_score,
        "safety_score": safety_score,
        "risk_level": overall_risk,
        "max_segment_risk": round(max_score * 100, 1),
        "segments": segments,
        "segment_scores": [s["score"] for s in segments],
        "summary": {
            "total_segments": len(segments),
            "high_risk_segments": high_risk,
            "medium_risk_segments": medium_risk,
            "low_risk_segments": low_risk,
        },
        "message": message,
        "time_context": get_time_context(hour),
    }


def rank_routes(db: Session, routes: list[dict], hour: int) -> dict:
    """
    Score and rank multiple routes, returning the safest as recommended.

    Args:
        db: Database session
        routes: List of route dicts with polyline, distance, duration
        hour: Hour of day for time context

    Returns:
        Dict with recommended route, alternatives, and time context
    """
    scored_routes = []

    for route in routes:
        score_data = score_route(db, route["polyline"], hour)
        scored_routes.append({
            **route,
            "risk_score": score_data["risk_score"],
            "safety_score": score_data["safety_score"],
            "risk_level": score_data["risk_level"],
            "segment_scores": score_data["segment_scores"],
            "segments": score_data["segments"],
            "summary": score_data["summary"],
            "message": score_data["message"],
        })

    # Sort by risk score ascending (lowest risk first)
    scored_routes.sort(key=lambda r: r["risk_score"])

    # Label routes
    if scored_routes:
        scored_routes[0]["label"] = "Safest Route"
        for i, route in enumerate(scored_routes[1:], 2):
            if route["risk_score"] > 60:
                route["label"] = f"Route {i} (Risky)"
            elif route["risk_score"] > 30:
                route["label"] = f"Route {i} (Moderate)"
            else:
                route["label"] = f"Route {i} (Safe)"

    recommended = scored_routes[0] if scored_routes else None
    alternatives = scored_routes[1:] if len(scored_routes) > 1 else []

    # Generate trade-off note
    trade_off = ""
    if recommended and alternatives:
        alt = alternatives[0]
        if recommended["risk_score"] < alt["risk_score"]:
            diff = round(alt["risk_score"] - recommended["risk_score"], 1)
            trade_off = f"The safest route has {diff} lower risk score than the next alternative."

    return {
        "recommended_route": recommended,
        "alternatives": alternatives,
        "time_context": get_time_context(hour),
        "trade_off_note": trade_off,
    }


def _empty_route_score() -> dict:
    """Return an empty route score for invalid/empty routes."""
    return {
        "risk_score": 0,
        "safety_score": 10.0,
        "risk_level": "low",
        "max_segment_risk": 0,
        "segments": [],
        "segment_scores": [],
        "summary": {
            "total_segments": 0,
            "high_risk_segments": 0,
            "medium_risk_segments": 0,
            "low_risk_segments": 0,
        },
        "message": "No route data available.",
        "time_context": get_time_context(datetime.now().hour),
    }


def _generate_route_message(risk_level: str, high_risk_count: int, total: int, hour: int) -> str:
    """Generate a human-readable message about route safety."""
    period = get_time_period(hour)

    if risk_level == "low":
        base = "This route passes through mostly safe areas."
    elif risk_level == "medium":
        base = f"This route has {high_risk_count} high-risk segment(s) out of {total}."
    else:
        base = f"Caution: {high_risk_count} of {total} segments are high-risk."

    time_msg = ""
    if period == "night":
        time_msg = " Exercise extra caution during night hours."
    elif period == "evening":
        time_msg = " Be alert as evening risk levels are elevated."

    return base + time_msg
