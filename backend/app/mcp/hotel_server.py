from mcp.server.fastmcp import FastMCP
from tavily import TavilyClient

from app.config.settings import settings


mcp = FastMCP("TripMind Hotel")

client = TavilyClient(
    api_key=settings.tavily_api_key
)


@mcp.tool()
async def search_hotels(
    destination: str,
    start_date: str,
    end_date: str,
    travelers: int
) -> dict:
    query = (
        f"best hotels in {destination} "
        f"from {start_date} to {end_date} "
        f"for {travelers} travelers"
    )

    response = client.search(
        query=query,
        max_results=5
    )

    hotels = []

    for result in response.get("results", []):
        hotels.append({
            "title": result.get("title"),
            "url": result.get("url"),
            "content": result.get("content")
        })

    return {
        "destination": destination,
        "start_date": start_date,
        "end_date": end_date,
        "travelers": travelers,
        "hotels": hotels
    }


if __name__ == "__main__":
    mcp.run()