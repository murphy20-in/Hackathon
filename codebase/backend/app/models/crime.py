from sqlalchemy import Column, String, Float, DateTime, Index
from app.database.connection import Base


class CrimeIncident(Base):
    __tablename__ = "crime_incidents"

    id = Column(String, primary_key=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    crime_type = Column(String(100), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    area_name = Column(String(200), nullable=False)

    __table_args__ = (
        Index("idx_crime_lat_lon", "latitude", "longitude"),
        Index("idx_crime_type", "crime_type"),
        Index("idx_crime_timestamp", "timestamp"),
    )

    def __repr__(self):
        return f"<CrimeIncident {self.id} {self.crime_type} at ({self.latitude}, {self.longitude})>"
