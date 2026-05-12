"""
SurakṣāMārga.ai - Backend API
5G-Powered Women Safety Navigation System

Entry point for the FastAPI application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.routes.routes import router as routes_router
from app.routes.crime import router as crime_router
from app.routes.sos import router as sos_router
from app.routes.simulation import router as simulation_router
from app.routes.advanced_safety import router as advanced_safety_router

# Create FastAPI app
app = FastAPI(
    title="SurakṣāMārga.ai",
    description="5G-Powered Women Safety Navigation System - Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware - allow all origins for hackathon demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes_router, prefix="/api", tags=["Routes"])
app.include_router(crime_router, prefix="/api", tags=["Crime Data"])
app.include_router(sos_router, prefix="/api", tags=["SOS / Emergency"])
app.include_router(simulation_router, prefix="/api", tags=["5G Simulation"])
app.include_router(advanced_safety_router, prefix="/api", tags=["Advanced Safety Mock"])


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "SurakṣāMārga.ai Backend",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "name": "SurakṣāMārga.ai",
        "tagline": "Not the fastest route. The safest one.",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "get_routes": "POST /api/get-routes",
            "safe_route": "POST /api/safe-route",
            "crime_zones": "GET /api/crime-zones",
            "send_sos": "POST /api/send-sos",
            "simulation_status": "GET /api/simulation/status",
        },
    }


@app.on_event("startup")
def startup_event():
    """Initialize database on startup if needed."""
    print("=" * 60)
    print("SurakṣāMārga.ai Backend - Starting up...")
    print("=" * 60)
    try:
        from app.database.connection import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("[OK] Database connection successful")
    except Exception as e:
        print(f"[WARN] Database not available: {e}")
        print("[INFO] Run 'python -m app.database.init_db' to initialize the database")
