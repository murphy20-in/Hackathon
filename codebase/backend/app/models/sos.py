from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.database.connection import Base


class SOSEvent(Base):
    __tablename__ = "sos_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), nullable=False, default="anonymous")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), nullable=False, default="active")  # active, resolved, cancelled
    resolved_at = Column(DateTime, nullable=True)
    contacts_notified = Column(Text, nullable=True)  # JSON string of notified contacts
    notes = Column(Text, nullable=True)

    def __repr__(self):
        return f"<SOSEvent {self.id} user={self.user_id} status={self.status}>"
