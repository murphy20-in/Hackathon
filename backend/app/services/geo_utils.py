"""
Geospatial utility functions.
- Haversine distance
- Route point sampling
- PostGIS spatial queries
"""
import math
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.crime import CrimeIncident


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth.
    Returns distance in meters.
    """
    R = 6371000  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def interpolate_point(lat1: float, lon1: float, lat2: float, lon2: float, fraction: float) -> tuple[float, float]:
    """Linearly interpolate between two points."""
    return (
        lat1 + (lat2 - lat1) * fraction,
        lon1 + (lon2 - lon1) * fraction,
    )


def sample_points_along_route(
    coordinates: list[tuple[float, float]], interval_meters: float = 100
) -> list[tuple[float, float]]:
    """
    Sample points at regular intervals along a route defined by coordinates.

    Args:
        coordinates: List of (lat, lng) tuples
        interval_meters: Distance between sample points in meters

    Returns:
        List of (lat, lng) sample points
    """
    if not coordinates:
        return []

    sampled = [coordinates[0]]
    accumulated = 0.0

    for i in range(1, len(coordinates)):
        lat1, lon1 = coordinates[i - 1]
        lat2, lon2 = coordinates[i]
        segment_dist = haversine(lat1, lon1, lat2, lon2)

        if segment_dist == 0:
            continue

        remaining = interval_meters - accumulated

        while remaining <= segment_dist:
            fraction = remaining / segment_dist
            point = interpolate_point(lat1, lon1, lat2, lon2, fraction)
            sampled.append(point)
            lat1, lon1 = point
            segment_dist -= remaining
            remaining = interval_meters

        accumulated = segment_dist

    # Always include the last point
    if coordinates[-1] != sampled[-1]:
        sampled.append(coordinates[-1])

    return sampled


def get_crimes_near_point(
    db: Session, lat: float, lon: float, radius_meters: float = 200
) -> list[dict]:
    """
    Query crime incidents within a given radius of a point using Haversine SQL.

    Args:
        db: SQLAlchemy session
        lat: Latitude of the center point
        lon: Longitude of the center point
        radius_meters: Search radius in meters

    Returns:
        List of dicts with crime_type, timestamp, distance
    """
    # Use a bounding box pre-filter for performance, then Haversine for accuracy
    # ~0.009 degrees latitude ≈ 1km
    deg_offset = radius_meters / 111000.0 * 1.2  # 20% buffer

    # SQLite-compatible query (no ::numeric casting)
    query = text("""
        SELECT crime_type, timestamp, distance_meters FROM (
            SELECT crime_type, timestamp,
                6371000 * 2 * ASIN(SQRT(
                    POWER(SIN(RADIANS(latitude - :lat) / 2), 2) +
                    COS(RADIANS(:lat)) * COS(RADIANS(latitude)) *
                    POWER(SIN(RADIANS(longitude - :lon) / 2), 2)
                )) as distance_meters
            FROM crime_incidents
            WHERE latitude BETWEEN :lat_min AND :lat_max
              AND longitude BETWEEN :lon_min AND :lon_max
        ) sub
        WHERE distance_meters <= :radius
        ORDER BY distance_meters
    """)

    result = db.execute(query, {
        "lat": lat, "lon": lon, "radius": radius_meters,
        "lat_min": lat - deg_offset, "lat_max": lat + deg_offset,
        "lon_min": lon - deg_offset, "lon_max": lon + deg_offset,
    })
    rows = result.fetchall()

    return [
        {
            "crime_type": row[0],
            "timestamp": row[1],
            "distance": row[2],
        }
        for row in rows
    ]


def get_aggregated_crime_zones(db: Session) -> list[dict]:
    """
    Aggregate crime data into grid cells for heatmap display.
    Rounds coordinates to 3 decimal places (~110m grid) for aggregation.

    Returns:
        List of dicts with lat, lng, crime_count, weighted_score, risk_level
    """
    # SQLite-compatible query (ROUND works differently in SQLite)
    query = text("""
        SELECT
            ROUND(latitude, 3) as lat,
            ROUND(longitude, 3) as lng,
            COUNT(*) as crime_count,
            SUM(CASE
                WHEN crime_type IN ('molestation', 'rape', 'eve_teasing', 'sexual_harassment',
                                     'kidnapping', 'murder', 'child_abuse', 'domestic_violence',
                                     'stalking', 'dowry_crime')
                THEN 1.0
                WHEN crime_type IN ('assault', 'robbery', 'chain_snatching', 'dacoity', 'rioting')
                THEN 0.7
                ELSE 0.3
            END) as weighted_score
        FROM crime_incidents
        GROUP BY ROUND(latitude, 3), ROUND(longitude, 3)
        HAVING COUNT(*) >= 3
        ORDER BY weighted_score DESC
    """)

    result = db.execute(query)
    rows = result.fetchall()

    zones = []
    if not rows:
        return zones

    # Find max weighted score for normalization
    max_score = max(float(row[3]) for row in rows) if rows else 1.0

    for row in rows:
        score = float(row[3])
        normalized = score / max_score if max_score > 0 else 0

        if normalized > 0.66:
            risk_level = "high"
        elif normalized > 0.33:
            risk_level = "medium"
        else:
            risk_level = "low"

        zones.append({
            "lat": float(row[0]),
            "lng": float(row[1]),
            "crime_count": int(row[2]),
            "weighted_score": round(score, 2),
            "risk_level": risk_level,
            "intensity": round(normalized, 3),
        })

    return zones
