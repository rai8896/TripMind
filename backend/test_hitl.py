from langgraph.types import Command

from app.graph.workflow import graph


config = {
    "configurable": {
        "thread_id": "trip-001"
    }
}


result = graph.invoke(
    {
        "user_query": "Plan a 5 day trip to Dubai from 2026-10-15 to 2026-10-19 for 2 people with flights, hotels and weather"
    },
    config=config
)


print("\n========== GRAPH PAUSED ==========")

print("\nHITL DATA:")
print(result["__interrupt__"])


result = graph.invoke(
    Command(
        resume={
            "action": "approve"
        }
    ),
    config=config
)


print("\n========== GRAPH RESUMED ==========")

print("\nHITL STATUS:")
print(result["hitl_status"])

print("\nFINAL STATE:")
print(result)
