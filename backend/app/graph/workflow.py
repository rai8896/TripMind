from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from app.models.travel_state import TravelState
from app.guardrails.input_guardrail import input_guardrail
from app.agents.trip_parser import trip_parser_node
from app.agents.supervisor import supervisor_node
from app.agents.flight_agent import flight_agent
from app.agents.hotel_agent import hotel_agent
from app.agents.weather_agent import weather_agent
from app.agents.budget_agent import budget_agent
from app.agents.itinerary_agent import itinerary_agent
from app.agents.hitl import hitl_node
from app.agents.final_response_agent import final_response_agent


def input_node(state: TravelState):
    return state


def join_node(state: TravelState):
    selected = set(state.selected_agents)
    completed = set(state.completed_agents)

    if selected.issubset(completed):
        return {
            "messages": [
                {
                    "role": "join",
                    "content": "All selected agents completed successfully."
                }
            ]
        }

    return {
        "messages": [
            {
                "role": "join",
                "content": f"Waiting for agents. Completed: {completed}"
            }
        ]
    }


def route_from_supervisor(state: TravelState):
    selected = [
        agent
        for agent in state.selected_agents
        if agent in {"flight", "hotel", "weather"}
    ]

    if not selected:
        return "join"

    return selected


def route_after_hitl(state: TravelState):
    if state.hitl_status == "approved":
        return "final_response"

    if state.hitl_status == "changes_requested":
        return "regenerate"

    return "final_response"


builder = StateGraph(TravelState)


builder.add_node("input", input_node)
builder.add_node("guardrail", input_guardrail)
builder.add_node("trip_parser", trip_parser_node)
builder.add_node("supervisor", supervisor_node)

builder.add_node("flight", flight_agent)
builder.add_node("hotel", hotel_agent)
builder.add_node("weather", weather_agent)

builder.add_node("join", join_node)
builder.add_node("budget", budget_agent)
builder.add_node("itinerary", itinerary_agent)
builder.add_node("hitl", hitl_node)
builder.add_node("final_response", final_response_agent)


builder.add_edge(START, "input")

builder.add_edge("input", "guardrail")

builder.add_edge("guardrail", "trip_parser")

builder.add_edge("trip_parser", "supervisor")


builder.add_conditional_edges(
    "supervisor",
    route_from_supervisor,
    {
        "flight": "flight",
        "hotel": "hotel",
        "weather": "weather",
        "join": "join"
    }
)


builder.add_edge("flight", "join")
builder.add_edge("hotel", "join")
builder.add_edge("weather", "join")


builder.add_edge("join", "budget")

builder.add_edge("budget", "itinerary")

builder.add_edge("itinerary", "hitl")


builder.add_conditional_edges(
    "hitl",
    route_after_hitl,
    {
        "final_response": "final_response",
        "regenerate": "itinerary"
    }
)


builder.add_edge("final_response", END)


checkpointer = MemorySaver()


graph = builder.compile(
    checkpointer=checkpointer
)