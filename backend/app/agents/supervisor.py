from langchain_groq import ChatGroq
from app.models.travel_state import TravelState
from app.config.settings import settings


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
    temperature=0
)


def supervisor_node(state: TravelState):
    prompt = f"""
You are the supervisor of a multi-agent travel planning system.

Available agents:
- flight
- hotel
- weather
- budget
- itinerary

User query:
{state.user_query}

Select only the agents required to fulfill the query.

Return only a comma-separated list of agent names.
"""

    response = llm.invoke(prompt)

    selected_agents = [
        agent.strip()
        for agent in response.content.split(",")
        if agent.strip() in {"flight", "hotel", "weather", "budget", "itinerary"}
    ]

    return {
        "selected_agents": selected_agents,
        "messages": [
            {
                "role": "supervisor",
                "content": f"Selected agents: {selected_agents}"
            }
        ]
    }