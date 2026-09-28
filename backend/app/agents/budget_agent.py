import json

from langchain_groq import ChatGroq

from app.models.travel_state import TravelState
from app.config.settings import settings


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
    temperature=0
)


def budget_agent(state: TravelState):
    constraints = state.trip_constraints

    flight_available = bool(
        state.flight_results
    )

    hotel_available = bool(
        state.hotel_results
    )

    prompt = f"""
You are a travel budget analysis agent.

Analyze the trip information below.

Trip constraints:
{json.dumps(constraints, indent=2)}

Flight results:
{json.dumps(state.flight_results, indent=2)}

Hotel results:
{json.dumps(state.hotel_results, indent=2)}

Flight data available:
{flight_available}

Hotel data available:
{hotel_available}

Return ONLY valid JSON with these fields:

{{
    "currency": "USD",
    "flight_cost_estimate": 0,
    "hotel_cost_estimate": 0,
    "food_cost_estimate": 0,
    "local_transport_estimate": 0,
    "activities_cost_estimate": 0,
    "total_estimated_cost": 0,
    "budget_status": "unknown",
    "explanation": ""
}}

STRICT RULES:

1. NEVER invent an exact flight price.

2. If Flight results are empty:
   - flight_cost_estimate MUST be 0.
   - Clearly state that flight pricing is unavailable.

3. If Flight results contain no price field:
   - flight_cost_estimate MUST be 0.
   - Do NOT estimate a flight price.

4. If Hotel results contain no actual price:
   - hotel_cost_estimate may be a clearly labeled estimate.
   - Do not present it as an actual booking price.

5. Food, local transport and activities may be estimated.

6. Clearly distinguish estimates from actual data.

7. If user budget is unavailable:
   budget_status = "no_budget_provided"

8. If user budget is available:
   compare only the available/estimated costs with the user budget.

9. total_estimated_cost MUST equal the sum of:
   flight_cost_estimate
   + hotel_cost_estimate
   + food_cost_estimate
   + local_transport_estimate
   + activities_cost_estimate

10. Do not invent flight or hotel booking prices.

11. Keep explanation concise.
"""

    response = llm.invoke(prompt)

    content = response.content.strip()

    if content.startswith("```"):
        content = content.replace(
            "```json",
            ""
        )
        content = content.replace(
            "```",
            ""
        )
        content = content.strip()

    budget = json.loads(content)

    if not flight_available:
        budget["flight_cost_estimate"] = 0

    budget["total_estimated_cost"] = (
        budget.get("flight_cost_estimate", 0)
        + budget.get("hotel_cost_estimate", 0)
        + budget.get("food_cost_estimate", 0)
        + budget.get("local_transport_estimate", 0)
        + budget.get("activities_cost_estimate", 0)
    )

    return {
        "budget_analysis": budget,
        "messages": [
            {
                "role": "budget_agent",
                "content": (
                    "Trip budget analyzed using available "
                    "flight and hotel data."
                )
            }
        ]
    }