# from langgraph.types import interrupt

# from app.models.travel_state import TravelState


# def hitl_node(state: TravelState):
#     decision = interrupt(
#         {
#             "message": "Review your generated travel plan.",
#             "budget": state.budget_analysis,
#             "itinerary": state.itinerary_plan
#         }
#     )

#     if decision.get("action") == "approve":
#         return {
#             "hitl_status": "approved",
#             "messages": [
#                 {
#                     "role": "hitl",
#                     "content": "Trip plan approved by user."
#                 }
#             ]
#         }

#     return {
#         "hitl_status": "changes_requested",
#         "human_feedback": decision.get("feedback", ""),
#         "messages": [
#             {
#                 "role": "hitl",
#                 "content": f"Changes requested: {decision.get('feedback', '')}"
#             }
#         ]
#     }


from langgraph.types import interrupt

from app.models.travel_state import TravelState


def hitl_node(state: TravelState):
    decision = interrupt(
        {
            "message": "Review your generated travel plan.",
            "budget": state.budget_analysis,
            "itinerary": state.itinerary_plan,
            "flights": state.flight_results,
            "hotels": state.hotel_results,
            "weather": state.weather_info,
        }
    )

    if decision.get("action") == "approve":
        return {
            "hitl_status": "approved",
            "messages": [
                {
                    "role": "hitl",
                    "content": "Trip plan approved by user."
                }
            ]
        }

    return {
        "hitl_status": "changes_requested",
        "human_feedback": decision.get("feedback", ""),
        "messages": [
            {
                "role": "hitl",
                "content": (
                    f"Changes requested: "
                    f"{decision.get('feedback', '')}"
                )
            }
        ]
    }