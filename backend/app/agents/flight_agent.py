# import asyncio
# import json
# import sys

# from mcp import ClientSession, StdioServerParameters
# from mcp.client.stdio import stdio_client

# from app.models.travel_state import TravelState


# async def search_flights(
#     origin: str,
#     destination: str,
#     flight_date: str
# ):
#     server_params = StdioServerParameters(
#         command=sys.executable,
#         args=["-m", "app.mcp.flight_server"],
#     )

#     async with stdio_client(server_params) as (read, write):
#         async with ClientSession(read, write) as session:
#             await session.initialize()

#             result = await session.call_tool(
#                 "search_flights",
#                 {
#                     "origin": origin,
#                     "destination": destination,
#                     "flight_date": flight_date
#                 }
#             )

#             return json.loads(result.content[0].text)


# def flight_agent(state: TravelState):
#     constraints = state.trip_constraints

#     origin = constraints.get("origin")
#     destination = constraints.get("destination")
#     flight_date = constraints.get("flight_date")

#     if not origin or not destination or not flight_date:
#         return {
#             "flight_results": [],
#             "completed_agents": ["flight"],
#             "messages": [
#                 {
#                     "role": "flight_agent",
#                     "content": "Flight search skipped because origin, destination, or flight date is missing."
#                 }
#             ]
#         }

#     result = asyncio.run(
#         search_flights(
#             origin,
#             destination,
#             flight_date
#         )
#     )

#     return {
#         "flight_results": result.get("flights", []),
#         "completed_agents": ["flight"],
#         "messages": [
#             {
#                 "role": "flight_agent",
#                 "content": f"Flights fetched from {origin} to {destination} for {flight_date}."
#             }
#         ]
#     }






















import asyncio
import json
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from app.models.travel_state import TravelState


CITY_TO_IATA = {
    "delhi": "DEL",
    "new delhi": "DEL",
    "dubai": "DXB",
    "mumbai": "BOM",
    "bangalore": "BLR",
    "bengaluru": "BLR",
    "hyderabad": "HYD",
    "chennai": "MAA",
    "kolkata": "CCU",
    "pune": "PNQ",
    "goa": "GOI",
    "abu dhabi": "AUH",
    "london": "LHR",
    "paris": "CDG",
    "new york": "JFK",
    "singapore": "SIN",
    "bangkok": "BKK",
}


def normalize_airport_code(value: str):
    if not value:
        return None

    value = value.strip()

    if len(value) == 3:
        return value.upper()

    return CITY_TO_IATA.get(
        value.lower()
    )


async def search_flights(
    origin: str,
    destination: str,
    flight_date: str
):
    server_params = StdioServerParameters(
        command=sys.executable,
        args=[
            "-m",
            "app.mcp.flight_server"
        ],
    )

    async with stdio_client(
        server_params
    ) as (read, write):

        async with ClientSession(
            read,
            write
        ) as session:

            await session.initialize()

            result = await session.call_tool(
                "search_flights",
                {
                    "origin": origin,
                    "destination": destination,
                    "flight_date": flight_date
                }
            )

            if not result.content:
                return {
                    "flights": [],
                    "error": "Empty response from Flight MCP."
                }

            raw_text = result.content[0].text

            print(
                "\n========== FLIGHT MCP RESPONSE =========="
            )
            print(raw_text)
            print(
                "==========================================\n"
            )

            return json.loads(raw_text)


def flight_agent(state: TravelState):

    constraints = state.trip_constraints

    print(
        "\n========== FLIGHT AGENT =========="
    )

    print(
        "Trip constraints:",
        json.dumps(
            constraints,
            indent=2
        )
    )

    origin_raw = constraints.get(
        "origin"
    )

    destination_raw = constraints.get(
        "destination"
    )

    flight_date = constraints.get(
        "flight_date"
    )

    origin = normalize_airport_code(
        origin_raw
    )

    destination = normalize_airport_code(
        destination_raw
    )

    print(
        "Origin raw:",
        origin_raw
    )

    print(
        "Destination raw:",
        destination_raw
    )

    print(
        "Origin IATA:",
        origin
    )

    print(
        "Destination IATA:",
        destination
    )

    print(
        "Flight date:",
        flight_date
    )

    if (
        not origin
        or not destination
        or not flight_date
    ):
        print(
            "Flight search skipped."
        )

        return {
            "flight_results": [],
            "completed_agents": ["flight"],
            "messages": [
                {
                    "role": "flight_agent",
                    "content": (
                        "Flight search skipped because "
                        "origin, destination, or flight date "
                        "is missing."
                    )
                }
            ]
        }

    try:

        result = asyncio.run(
            search_flights(
                origin,
                destination,
                flight_date
            )
        )

    except Exception as e:

        print(
            "Flight MCP error:",
            str(e)
        )

        return {
            "flight_results": [],
            "completed_agents": ["flight"],
            "messages": [
                {
                    "role": "flight_agent",
                    "content": (
                        f"Flight search failed: {str(e)}"
                    )
                }
            ]
        }

    flights = result.get(
        "flights",
        []
    )

    error = result.get(
        "error"
    )

    print(
        "Number of flights:",
        len(flights)
    )

    if error:
        print(
            "AviationStack error:",
            error
        )

    print(
        "====================================\n"
    )

    if not flights:

        message = (
            "Flight search returned no flight data."
        )

        if error:
            message += f" API error: {error}"

        return {
            "flight_results": [],
            "completed_agents": ["flight"],
            "messages": [
                {
                    "role": "flight_agent",
                    "content": message
                }
            ]
        }

    return {
        "flight_results": flights,
        "completed_agents": ["flight"],
        "messages": [
            {
                "role": "flight_agent",
                "content": (
                    f"Flights fetched from "
                    f"{origin} to {destination} "
                    f"for {flight_date}."
                )
            }
        ]
    }