import asyncio
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "app.mcp.flight_server"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = await session.list_tools()
            print("Available tools:", [tool.name for tool in tools.tools])

            # result = await session.call_tool(
            #     "search_flights",
            #     {
            #         "origin": "DEL",
            #         "destination": "DXB",
            #         "flight_date": "2026-09-28"
            #     }
            # )
            result = await session.call_tool(
            "search_flights",
                {
                    "origin": "DEL",
                    "destination": "DXB",
                    "flight_date": "2026-09-28"
                })

            print("Flight result:")
            print(result)


if __name__ == "__main__":
    asyncio.run(main())