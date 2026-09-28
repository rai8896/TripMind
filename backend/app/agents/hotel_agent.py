import asyncio
import json
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from app.models.travel_state import TravelState


async def search_hotels(
    destination: str,
    start_date: str,
    end_date: str,
    travelers: int
):
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "app.mcp.hotel_server"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            result = await session.call_tool(
                "search_hotels",
                {
                    "destination": destination,
                    "start_date": start_date,
                    "end_date": end_date,
                    "travelers": travelers
                }
            )

            return json.loads(result.content[0].text)


def hotel_agent(state: TravelState):
    constraints = state.trip_constraints

    destination = constraints.get("destination")
    start_date = constraints.get("start_date")
    end_date = constraints.get("end_date")
    travelers = constraints.get("travelers")

    if not destination or not start_date or not end_date:
        return {
            "hotel_results": [],
            "completed_agents": ["hotel"],
            "messages": [
                {
                    "role": "hotel_agent",
                    "content": "Hotel search skipped because destination or dates are missing."
                }
            ]
        }

    if not travelers:
        travelers = 1

    result = asyncio.run(
        search_hotels(
            destination,
            start_date,
            end_date,
            travelers
        )
    )

    return {
        "hotel_results": result.get("hotels", []),
        "completed_agents": ["hotel"],
        "messages": [
            {
                "role": "hotel_agent",
                "content": f"Hotels fetched for {destination} from {start_date} to {end_date}."
            }
        ]
    }