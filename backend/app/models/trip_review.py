from typing import Optional

from pydantic import BaseModel


class TripReview(BaseModel):
    action: str
    feedback: Optional[str] = None