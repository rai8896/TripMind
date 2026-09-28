import json

from langchain_groq import ChatGroq

from app.models.travel_state import TravelState
from app.config.settings import settings


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
    temperature=0
)


def clean_json_response(content: str):
    content = content.strip()

    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return content


def itinerary_agent(state: TravelState):
    constraints = state.trip_constraints
    feedback = state.human_feedback or ""

    duration = constraints.get("duration_days")

    try:
        duration = int(duration)
    except (TypeError, ValueError):
        duration = 1

    if duration < 1:
        duration = 1

    prompt = f"""
You are an AI travel itinerary planner.

Create a practical day-wise itinerary.

Trip constraints:
{json.dumps(constraints, indent=2)}

Required number of travel days:
{duration}

Flight information:
{json.dumps(state.flight_results, indent=2)}

Hotel information:
{json.dumps(state.hotel_results, indent=2)}

Weather information:
{json.dumps(state.weather_info, indent=2)}

Budget analysis:
{json.dumps(state.budget_analysis, indent=2)}

Previous human feedback:
{feedback}

IMPORTANT:
The itinerary MUST contain EXACTLY {duration} day objects.

Return ONLY valid JSON.

Required format:

[
    {{
        "day": 1,
        "title": "Day title",
        "activities": [
            "Activity 1",
            "Activity 2",
            "Activity 3"
        ],
        "estimated_cost": 0
    }}
]

Rules:

- Generate exactly {duration} objects.
- Day numbers MUST be sequential:
  1, 2, 3, ..., {duration}
- Do NOT skip any day.
- Do NOT generate fewer days.
- Do NOT generate extra days.
- Use the trip duration from the constraints.
- Each day must contain realistic activities.
- If human feedback is provided, modify the itinerary according to it.
- Consider weather when suggesting outdoor activities.
- Consider the available budget.
- estimated_cost is an approximate activity cost.
- Do not invent confirmed bookings.
- Do not claim activities are booked.
"""

    response = llm.invoke(prompt)

    content = clean_json_response(
        response.content
    )

    try:
        itinerary = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(
            "Itinerary agent returned invalid JSON."
        )

    if not isinstance(itinerary, list):
        raise ValueError(
            "Itinerary must be a JSON list."
        )

    valid_days = []

    for item in itinerary:
        if not isinstance(item, dict):
            continue

        day = item.get("day")

        try:
            day = int(day)
        except (TypeError, ValueError):
            continue

        if day < 1 or day > duration:
            continue

        activities = item.get(
            "activities",
            []
        )

        if not isinstance(activities, list):
            activities = [str(activities)]

        valid_days.append(
            {
                "day": day,
                "title": str(
                    item.get(
                        "title",
                        f"Day {day}"
                    )
                ),
                "activities": [
                    str(activity)
                    for activity in activities
                ],
                "estimated_cost": item.get(
                    "estimated_cost",
                    0
                )
            }
        )

    day_map = {
        item["day"]: item
        for item in valid_days
    }

    final_itinerary = []

    for day in range(1, duration + 1):
        if day in day_map:
            final_itinerary.append(
                day_map[day]
            )
        else:
            final_itinerary.append(
                {
                    "day": day,
                    "title": f"Day {day}",
                    "activities": [
                        "Free day for flexible sightseeing and local experiences."
                    ],
                    "estimated_cost": 0
                }
            )

    return {
        "itinerary_plan": final_itinerary,
        "messages": [
            {
                "role": "itinerary_agent",
                "content": (
                    f"Itinerary generated for exactly "
                    f"{duration} days."
                )
            }
        ]
    }