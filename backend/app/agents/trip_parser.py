from langchain_groq import ChatGroq
from app.models.travel_state import TravelState
from app.config.settings import settings
import json


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
    temperature=0
)


def trip_parser_node(state: TravelState):
    prompt = f"""
Extract travel constraints from the user query.

Return ONLY valid JSON with these fields:
origin
destination
duration_days
flight_date
start_date
end_date
budget
travelers

Rules:
- Use null when information is not available.
- flight_date should be the date on which the user wants to travel.
- Use YYYY-MM-DD format for dates whenever possible.

User query:
{state.user_query}
"""

    response = llm.invoke(prompt)

    content = response.content.strip()

    if content.startswith("```"):
        content = content.replace("```json", "").replace("```", "").strip()

    constraints = json.loads(content)

    return {
        "trip_constraints": constraints,
        "messages": [
            {
                "role": "trip_parser",
                "content": f"Extracted constraints: {constraints}"
            }
        ]
    }