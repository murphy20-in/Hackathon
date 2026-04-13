"""
Route fetching service.
Supports Google Directions API and OSRM as routing providers.
"""
import httpx
from app.config.settings import settings


async def fetch_routes(origin: str, destination: str) -> list[dict]:
    """
    Fetch multiple route alternatives between origin and destination.
    Delegates to Google or OSRM based on configuration.
    """
    if settings.ROUTING_PROVIDER == "google" and settings.GOOGLE_MAPS_API_KEY:
        return await fetch_routes_google(origin, destination)
    return await fetch_routes_osrm(origin, destination)


async def fetch_routes_google(origin: str, destination: str) -> list[dict]:
    """
    Fetch routes from Google Directions API.

    Args:
        origin: Origin address or "lat,lng"
        destination: Destination address or "lat,lng"

    Returns:
        List of route dicts with route_id, distance, duration, polyline, etc.
    """
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "alternatives": "true",
        "mode": "walking",
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params=params)
        data = resp.json()

    if data.get("status") != "OK":
        raise ValueError(f"Google Directions API error: {data.get('status')} - {data.get('error_message', '')}")

    routes = []
    for i, route in enumerate(data.get("routes", [])):
        leg = route["legs"][0]
        routes.append({
            "route_id": i + 1,
            "distance": leg["distance"]["text"],
            "distance_meters": leg["distance"]["value"],
            "duration": leg["duration"]["text"],
            "duration_seconds": leg["duration"]["value"],
            "polyline": route["overview_polyline"]["points"],
            "start_address": leg.get("start_address", origin),
            "end_address": leg.get("end_address", destination),
            "start_location": leg["start_location"],
            "end_location": leg["end_location"],
            "provider": "google",
        })

    return routes


async def fetch_routes_osrm(origin: str, destination: str) -> list[dict]:
    """
    Fetch routes from OSRM (Open Source Routing Machine).
    First geocodes addresses via Nominatim, then queries OSRM.

    Args:
        origin: Origin address or "lat,lng"
        destination: Destination address or "lat,lng"

    Returns:
        List of route dicts
    """
    # Parse or geocode coordinates
    origin_coords = await _parse_or_geocode(origin)
    dest_coords = await _parse_or_geocode(destination)

    if not origin_coords or not dest_coords:
        raise ValueError("Could not geocode origin or destination")

    # Query OSRM
    base_url = settings.OSRM_BASE_URL.rstrip("/")
    coords_str = f"{origin_coords[1]},{origin_coords[0]};{dest_coords[1]},{dest_coords[0]}"
    url = f"{base_url}/route/v1/foot/{coords_str}"
    params = {
        "alternatives": "3",
        "overview": "full",
        "geometries": "polyline",
        "steps": "false",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params=params)
        data = resp.json()

    if data.get("code") != "Ok":
        raise ValueError(f"OSRM error: {data.get('code')} - {data.get('message', '')}")

    routes = []
    for i, route in enumerate(data.get("routes", [])):
        distance_m = route["distance"]
        duration_s = route["duration"]

        # Format distance
        if distance_m >= 1000:
            distance_text = f"{distance_m / 1000:.1f} km"
        else:
            distance_text = f"{int(distance_m)} m"

        # Format duration
        minutes = int(duration_s / 60)
        if minutes >= 60:
            hours = minutes // 60
            mins = minutes % 60
            duration_text = f"{hours} hr {mins} min"
        else:
            duration_text = f"{minutes} min"

        routes.append({
            "route_id": i + 1,
            "distance": distance_text,
            "distance_meters": distance_m,
            "duration": duration_text,
            "duration_seconds": duration_s,
            "polyline": route["geometry"],
            "start_address": origin,
            "end_address": destination,
            "start_location": {"lat": origin_coords[0], "lng": origin_coords[1]},
            "end_location": {"lat": dest_coords[0], "lng": dest_coords[1]},
            "provider": "osrm",
        })

    return routes


async def _parse_or_geocode(location: str) -> tuple[float, float] | None:
    """
    Parse a "lat,lng" string or geocode an address via Nominatim.
    Returns (lat, lng) tuple or None.
    """
    # Try parsing as coordinates
    parts = location.replace(" ", "").split(",")
    if len(parts) == 2:
        try:
            lat, lng = float(parts[0]), float(parts[1])
            if -90 <= lat <= 90 and -180 <= lng <= 180:
                return (lat, lng)
        except ValueError:
            pass

    # Geocode via Nominatim
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location,
        "format": "json",
        "limit": 1,
        "countrycodes": "in",
    }
    headers = {"User-Agent": "SafeRouteAI/1.0"}

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params, headers=headers)
        data = resp.json()

    if data:
        return (float(data[0]["lat"]), float(data[0]["lon"]))
    return None
