from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("TripMind Weather")


@mcp.tool()
async def get_weather(city: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://wttr.in/{city}",
            params={"format": "j1"}
        )

    response.raise_for_status()
    data = response.json()

    current = data["current_condition"][0]

    return {
        "city": city,
        "temperature_c": current["temp_C"],
        "feels_like_c": current["FeelsLikeC"],
        "condition": current["weatherDesc"][0]["value"],
        "humidity": current["humidity"],
        "wind_kmph": current["windspeedKmph"]
    }


if __name__ == "__main__":
    mcp.run()