import asyncio
import json
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from app.models.travel_state import TravelState


async def get_weather(city: str):
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "app.mcp.weather_server"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            result = await session.call_tool(
                "get_weather",
                {
                    "city": city
                }
            )

            return json.loads(result.content[0].text)


def weather_agent(state: TravelState):
    city = state.trip_constraints.get("destination")

    if not city:
        return {
            "weather_info": {},
            "completed_agents": ["weather"],
            "messages": [
                {
                    "role": "weather_agent",
                    "content": "Weather search skipped because destination is missing."
                }
            ]
        }

    weather = asyncio.run(
        get_weather(city)
    )

    return {
        "weather_info": weather,
        "completed_agents": ["weather"],
        "messages": [
            {
                "role": "weather_agent",
                "content": f"Weather fetched for {city}."
            }
        ]
    }