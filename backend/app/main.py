from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.types import Command

from app.graph.workflow import graph
from app.models.trip_request import TripRequest
from app.models.trip_review import TripReview


app = FastAPI(
    title="TripMind API",
    description="AI-Powered Multi-Agent Travel Planning Platform",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TripMind Backend"
    }


# --------------------------------------------------
# Create Trip Plan
# --------------------------------------------------

@app.post("/plan")
def create_trip_plan(request: TripRequest):
    try:
        config = {
            "configurable": {
                "thread_id": request.thread_id
            }
        }

        result = graph.invoke(
            {
                "user_query": request.query
            },
            config=config
        )

        if "__interrupt__" in result:
            interrupt_data = result["__interrupt__"][0].value

            return {
                "status": "awaiting_approval",
                "thread_id": request.thread_id,
                "review": interrupt_data
            }

        return {
            "status": "completed",
            "thread_id": request.thread_id,
            "final_response": result.get("final_response")
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------------------------
# Review Trip
# --------------------------------------------------

@app.post("/plan/{thread_id}/review")
def review_trip(
    thread_id: str,
    review: TripReview
):
    try:
        if review.action not in {
            "approve",
            "changes"
        }:
            raise HTTPException(
                status_code=400,
                detail="Action must be 'approve' or 'changes'."
            )

        if (
            review.action == "changes"
            and not review.feedback
        ):
            raise HTTPException(
                status_code=400,
                detail="Feedback is required when requesting changes."
            )

        config = {
            "configurable": {
                "thread_id": thread_id
            }
        }

        result = graph.invoke(
            Command(
                resume={
                    "action": review.action,
                    "feedback": review.feedback or ""
                }
            ),
            config=config
        )

        if "__interrupt__" in result:
            interrupt_data = result["__interrupt__"][0].value

            return {
                "status": "awaiting_approval",
                "thread_id": thread_id,
                "review": interrupt_data
            }

        return {
        "status": "completed",
        "thread_id": thread_id,
        "final_response": result.get("final_response"),
        "trip_data": {
        "trip_constraints": result.get("trip_constraints", {}),
        "flights": result.get("flight_results", []),
        "hotels": result.get("hotel_results", []),
        "weather": result.get("weather_info", {}),
        "budget": result.get("budget_analysis", {}),
        "itinerary": result.get("itinerary_plan", []),
    }
}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )