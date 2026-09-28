from pydantic import BaseModel


class TripRequest(BaseModel):
    query: str
    thread_id: str