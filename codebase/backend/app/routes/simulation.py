"""
5G Simulation endpoints.
Demonstrates the impact of 5G vs 4G/3G on real-time safety features.
"""
import asyncio
from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.services.realtime_simulator import (
    simulate_real_time_risk,
    get_network_status,
    set_network_mode,
    NETWORK_PROFILES,
)
from app.services.crowd_simulator import get_crowd_density

router = APIRouter()


class NetworkModeRequest(BaseModel):
    mode: str  # "5G", "4G", or "3G"


@router.get("/simulation/status")
def simulation_status():
    """Get current network simulation status and available profiles."""
    return {
        "status": "success",
        "current": get_network_status(),
        "available_profiles": {k: v for k, v in NETWORK_PROFILES.items()},
    }


@router.post("/simulation/set-mode")
async def set_mode(request: NetworkModeRequest):
    """
    Switch the simulated network mode.
    Affects latency, bandwidth, and feature availability.
    """
    try:
        # Simulate switching delay based on target mode
        profile = NETWORK_PROFILES.get(request.mode.upper())
        if profile:
            await asyncio.sleep(0.1)  # Brief switching delay

        result = set_network_mode(request.mode)
        return {
            "status": "success",
            "message": f"Network mode switched to {request.mode.upper()}",
            **result,
        }
    except ValueError as e:
        return {"status": "error", "message": str(e)}


@router.get("/simulation/crowd-density")
def crowd_density(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    hour: int = Query(None, description="Hour of day (0-23), defaults to current"),
    area_name: str = Query("", description="Area name for better accuracy"),
):
    """Get simulated crowd density for a location."""
    from datetime import datetime
    h = hour if hour is not None else datetime.now().hour

    result = get_crowd_density(lat, lng, h, area_name)
    network = get_network_status()

    return {
        "status": "success",
        **result,
        "network_mode": network["mode"],
        "edge_computed": network["edge_computing"],
    }


@router.get("/simulation/realtime-risk")
def realtime_risk(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    hour: int = Query(None, description="Hour of day (0-23)"),
):
    """
    Get real-time risk assessment with dynamic alerts.
    Simulates live safety monitoring with 5G capabilities.
    """
    result = simulate_real_time_risk(lat, lng, hour)
    return {
        "status": "success",
        **result,
    }


@router.get("/simulation/compare")
async def compare_networks(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
):
    """
    Compare performance across all network modes for a given location.
    Shows the advantage of 5G over 4G/3G.
    """
    import time
    results = {}

    for mode in ["3G", "4G", "5G"]:
        profile = NETWORK_PROFILES[mode]

        # Simulate the latency of each network
        start = time.time()
        await asyncio.sleep(profile["latency_ms"] / 1000)  # Simulate network latency
        risk_data = simulate_real_time_risk(lat, lng)
        elapsed = time.time() - start

        results[mode] = {
            "latency_ms": profile["latency_ms"],
            "actual_response_ms": round(elapsed * 1000, 1),
            "bandwidth_mbps": profile["bandwidth_mbps"],
            "edge_computing": profile["edge_computing"],
            "update_interval_seconds": profile["update_interval_seconds"],
            "alerts_count": len(risk_data["alerts"]),
        }

    return {
        "status": "success",
        "location": {"lat": lat, "lng": lng},
        "comparison": results,
        "advantage": "5G provides 10-40x lower latency, enabling real-time safety monitoring and instant SOS response.",
    }
