import json

from langchain_groq import ChatGroq

from app.models.travel_state import TravelState
from app.config.settings import settings


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
    temperature=0
)


def final_response_agent(state: TravelState):
    prompt = f"""
You are the final response agent of a travel planning system.

Generate a clear and useful final travel plan using ONLY the information
explicitly available in the provided state.

Trip constraints:
{json.dumps(state.trip_constraints, indent=2)}

Flight information:
{json.dumps(state.flight_results, indent=2)}

Hotel information:
{json.dumps(state.hotel_results, indent=2)}

Weather information:
{json.dumps(state.weather_info, indent=2)}

Budget analysis:
{json.dumps(state.budget_analysis, indent=2)}

Approved itinerary:
{json.dumps(state.itinerary_plan, indent=2)}

Return a polished user-facing travel plan.

Use these sections:

1. Trip Summary
2. Flights
3. Hotels
4. Weather
5. Budget
6. Day-wise Itinerary
7. Important Notes

Strict grounding rules:

- Use ONLY information explicitly present in the provided state.
- Never invent flight numbers, airlines, departure times, arrival times,
  terminals, booking status or prices.
- Never invent hotel availability, room type, booking status or exact prices.
- Never invent visa, immigration, health, safety, emergency or legal information.
- Never invent currency exchange rates.
- Never invent transportation availability or connectivity information.
- Never present an estimate as an actual booking price.
- If information is unavailable, clearly say:
  "Not available in the current travel data."
- Do not convert assumptions into facts.
- Do not add recommendations that require external information.
- Keep estimates clearly labeled as estimates.
- Do not claim that something was booked or confirmed.
- Keep the response concise and practical.

For flights:
- If flight_results is empty, say that flight details are not available
  in the current travel data.
- If flight results exist, show only fields actually present.

For hotels:
- Show only hotel information present in hotel_results.
- Treat search results as search results, not confirmed bookings.

For weather:
- Show only the weather information present in weather_info.

For budget:
- Use the values from budget_analysis.
- Clearly label them as estimates.

For itinerary:
- Use the approved itinerary exactly as the planning basis.
- Do not add unsupported facts to activities.
"""

    response = llm.invoke(prompt)

    return {
        "final_response": response.content,
        "messages": [
            {
                "role": "final_response_agent",
                "content": "Grounded final travel response generated successfully."
            }
        ]
    }