from langgraph.types import Command

from app.graph.workflow import graph


config = {
    "configurable": {
        "thread_id": "hitl-changes-test"
    }
}


result = graph.invoke(
    {
        "user_query": "Plan a 5 day trip to Dubai from Delhi from 2026-10-15 to 2026-10-19 for 2 people with flights, hotels and weather"
    },
    config=config
)


print("\n========== FIRST HITL ==========")

print(result["__interrupt__"])


result = graph.invoke(
    Command(
        resume={
            "action": "changes",
            "feedback": "Replace the desert safari on Day 2 with a relaxing beach day."
        }
    ),
    config=config
)


print("\n========== SECOND HITL ==========")

print(result["__interrupt__"])


print("\n========== UPDATED ITINERARY ==========")

state = graph.get_state(config)

for day in state.values["itinerary_plan"]:
    print(day)