"""
SafeRoute AI - API Test Suite
Run: python -m pytest tests/test_api.py -v
Or manually: python tests/test_api.py
"""
import httpx
import json
import sys

BASE_URL = "http://localhost:8000/api"


def test_health():
    """Test health check endpoint."""
    r = httpx.get(f"{BASE_URL}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    print(f"[PASS] Health check: {data['service']} v{data['version']}")


def test_crime_zones():
    """Test crime zones endpoint for heatmap data."""
    r = httpx.get(f"{BASE_URL}/crime-zones")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert data["count"] > 0
    zone = data["zones"][0]
    assert "lat" in zone
    assert "lng" in zone
    assert "risk_level" in zone
    print(f"[PASS] Crime zones: {data['count']} zones returned")
    print(f"  Sample zone: lat={zone['lat']}, lng={zone['lng']}, risk={zone['risk_level']}, count={zone['crime_count']}")


def test_get_routes():
    """Test route fetching."""
    payload = {
        "source": "Koramangala, Bangalore",
        "destination": "MG Road, Bangalore",
    }
    r = httpx.post(f"{BASE_URL}/get-routes", json=payload, timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert data["count"] > 0
    route = data["routes"][0]
    assert "polyline" in route
    assert "distance" in route
    print(f"[PASS] Get routes: {data['count']} routes found")
    print(f"  Route 1: {route['distance']}, {route['duration']}")


def test_safe_route():
    """Test safe route with risk scoring."""
    payload = {
        "source": "Koramangala, Bangalore",
        "destination": "MG Road, Bangalore",
        "time_of_day": "night",
    }
    r = httpx.post(f"{BASE_URL}/safe-route", json=payload, timeout=60)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert data["recommended_route"] is not None
    rec = data["recommended_route"]
    print(f"[PASS] Safe route (night):")
    print(f"  Recommended: {rec['label']} - Risk: {rec['risk_score']}, Safety: {rec['safety_score']}/10")
    print(f"  Distance: {rec['distance']}, Duration: {rec['duration']}")
    if data.get("alternatives"):
        for alt in data["alternatives"]:
            print(f"  Alternative: {alt['label']} - Risk: {alt['risk_score']}, Safety: {alt['safety_score']}/10")
    print(f"  Time context: {data['time_context']['label']} ({data['time_context']['risk_level']})")


def test_safe_route_day():
    """Test safe route during daytime (should have lower risk scores)."""
    payload = {
        "source": "Indiranagar, Bangalore",
        "destination": "Whitefield, Bangalore",
        "time_of_day": "morning",
    }
    r = httpx.post(f"{BASE_URL}/safe-route", json=payload, timeout=60)
    assert r.status_code == 200
    data = r.json()
    rec = data["recommended_route"]
    print(f"[PASS] Safe route (morning): Risk={rec['risk_score']}, Safety={rec['safety_score']}/10")


def test_send_sos():
    """Test SOS emergency trigger."""
    payload = {
        "user_id": "test_user",
        "location": {"lat": 12.9716, "lng": 77.5946},
        "contacts": [
            {"name": "Emergency Contact 1", "phone": "+91-9999999999"},
        ],
    }
    r = httpx.post(f"{BASE_URL}/send-sos", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert data["sos_id"] is not None
    print(f"[PASS] SOS triggered: ID={data['sos_id']}, Status={data['status']}")
    print(f"  Message: {data['message']}")
    return data["sos_id"]


def test_simulation_status():
    """Test network simulation status."""
    r = httpx.get(f"{BASE_URL}/simulation/status")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    print(f"[PASS] Simulation status: Mode={data['current']['mode']}, Latency={data['current']['latency_ms']}ms")


def test_simulation_set_mode():
    """Test switching network modes."""
    for mode in ["4G", "3G", "5G"]:
        r = httpx.post(f"{BASE_URL}/simulation/set-mode", json={"mode": mode})
        assert r.status_code == 200
        data = r.json()
        assert data["mode"] == mode
        print(f"  {mode}: latency={data['latency_ms']}ms, edge={data.get('edge_computing', False)}")
    print(f"[PASS] Network mode switching works")


def test_realtime_risk():
    """Test real-time risk assessment."""
    r = httpx.get(f"{BASE_URL}/simulation/realtime-risk", params={"lat": 12.935, "lng": 77.632, "hour": 23})
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert len(data["alerts"]) > 0
    print(f"[PASS] Real-time risk: {len(data['alerts'])} alerts")
    for alert in data["alerts"]:
        print(f"  [{alert['severity']}] {alert['text']}")


def test_crowd_density():
    """Test crowd density simulation."""
    r = httpx.get(f"{BASE_URL}/simulation/crowd-density", params={
        "lat": 12.9716, "lng": 77.5946, "hour": 14, "area_name": "koramangala"
    })
    assert r.status_code == 200
    data = r.json()
    print(f"[PASS] Crowd density: {data['crowd_level']} ({data['density_score']}), Area: {data['area_type']}")


if __name__ == "__main__":
    tests = [
        test_health,
        test_crime_zones,
        test_simulation_status,
        test_simulation_set_mode,
        test_realtime_risk,
        test_crowd_density,
        test_get_routes,
        test_safe_route,
        test_safe_route_day,
        test_send_sos,
    ]

    print("=" * 60)
    print("SafeRoute AI - API Test Suite")
    print("=" * 60)

    passed = 0
    failed = 0
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"[FAIL] {test.__name__}: {e}")
            failed += 1
        print()

    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed, {passed + failed} total")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)
