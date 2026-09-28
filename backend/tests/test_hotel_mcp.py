import asyncio
import json
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "app.mcp.hotel_server"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = await session.list_tools()

            print(
                "Available tools:",
                [tool.name for tool in tools.tools]
            )

            result = await session.call_tool(
                "search_hotels",
                {
                    "destination": "Dubai",
                    "start_date": "2026-10-15",
                    "end_date": "2026-10-19",
                    "travelers": 2
                }
            )

            print("Hotel result:")
            print(
                json.dumps(
                    json.loads(result.content[0].text),
                    indent=2
                )
            )


if __name__ == "__main__":
    asyncio.run(main())