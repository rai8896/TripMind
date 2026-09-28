from typing import Annotated, Any, Dict, List, Optional

from pydantic import BaseModel, Field


def merge_messages(
    existing: List[Dict[str, Any]],
    new: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    return existing + new


def merge_completed_agents(
    existing: List[str],
    new: List[str]
) -> List[str]:
    return list(dict.fromkeys(existing + new))


class TravelState(BaseModel):
    user_query: str = ""

    trip_constraints: Dict[str, Any] = Field(default_factory=dict)
    selected_agents: List[str] = Field(default_factory=list)
    completed_agents: Annotated[
        List[str],
        merge_completed_agents
    ] = Field(default_factory=list)

    flight_results: List[Dict[str, Any]] = Field(default_factory=list)
    hotel_results: List[Dict[str, Any]] = Field(default_factory=list)
    weather_info: Dict[str, Any] = Field(default_factory=dict)

    budget_analysis: Dict[str, Any] = Field(default_factory=dict)
    itinerary_plan: List[Dict[str, Any]] = Field(default_factory=list)

    human_feedback: Optional[str] = None
    hitl_status: str = "pending"

    final_response: Optional[str] = None

    messages: Annotated[
        List[Dict[str, Any]],
        merge_messages
    ] = Field(default_factory=list)