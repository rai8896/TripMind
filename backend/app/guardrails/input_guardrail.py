from app.models.travel_state import TravelState


def input_guardrail(state: TravelState):
    query = state.user_query.strip()

    if not query:
        raise ValueError("User query cannot be empty.")

    if len(query) < 5:
        raise ValueError("User query is too short.")

    return {
        "messages": [
            {
                "role": "system",
                "content": "Input validation passed."
            }
        ]
    }