from datetime import datetime

import httpx
from mcp.server.fastmcp import FastMCP

from app.config.settings import settings


mcp = FastMCP("TripMind Flight")


def matches_flight_date(
    flight_time: str | None,
    requested_date: str
) -> bool:
    if not flight_time:
        return False

    try:
        flight_datetime = datetime.fromisoformat(
            flight_time.replace("Z", "+00:00")
        )

        return (
            flight_datetime.date().isoformat()
            == requested_date
        )

    except ValueError:
        return False


@mcp.tool()
async def search_flights(
    origin: str,
    destination: str,
    flight_date: str
) -> dict:

    params = {
        "access_key": settings.aviationstack_api_key,
        "dep_iata": origin,
        "arr_iata": destination
    }

    async with httpx.AsyncClient(
        timeout=30.0
    ) as client:

        response = await client.get(
            "https://api.aviationstack.com/v1/flights",
            params=params
        )

    response.raise_for_status()

    data = response.json()

    if "error" in data:
        return {
            "origin": origin,
            "destination": destination,
            "flight_date": flight_date,
            "flights": [],
            "error": data["error"]
        }

    flights = []

    for flight in data.get("data", []):

        departure = flight.get(
            "departure",
            {}
        )

        arrival = flight.get(
            "arrival",
            {}
        )

        departure_time = departure.get(
            "scheduled"
        )

        arrival_time = arrival.get(
            "scheduled"
        )

        if not matches_flight_date(
            departure_time,
            flight_date
        ):
            continue

        flights.append({
            "flight_number": flight.get(
                "flight",
                {}
            ).get("iata"),

            "airline": flight.get(
                "airline",
                {}
            ).get("name"),

            "departure_airport": departure.get(
                "airport"
            ),

            "departure_iata": departure.get(
                "iata"
            ),

            "departure_time": departure_time,

            "arrival_airport": arrival.get(
                "airport"
            ),

            "arrival_iata": arrival.get(
                "iata"
            ),

            "arrival_time": arrival_time,

            "status": flight.get(
                "flight_status"
            )
        })

    return {
        "origin": origin,
        "destination": destination,
        "flight_date": flight_date,
        "flights": flights
    }


if __name__ == "__main__":
    mcp.run()