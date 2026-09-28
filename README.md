# ✈️ TripMind — AI-Powered Multi-Agent Travel Planner

TripMind is a **full-stack AI travel planning platform** that uses a multi-agent architecture to transform natural-language travel queries into structured, personalized travel plans.

It combines **React, FastAPI, LangGraph, MCP, and Groq LLMs** to coordinate specialized travel agents for flights, hotels, weather, budget analysis, and itinerary generation.

---

## 🚀 Features

* 🧠 **AI-powered trip constraint extraction**
* 🤖 **Multi-agent travel planning**
* 🔀 **LangGraph-based workflow orchestration**
* ✈️ **Flight search using AviationStack**
* 🏨 **Hotel discovery using Tavily**
* 🌤️ **Real-time weather information**
* 💰 **AI-based budget analysis**
* 🗓️ **Day-wise itinerary generation**
* 👤 **Human-in-the-Loop trip approval**
* 🔄 **Itinerary regeneration based on user feedback**
* 🔌 **MCP-based external tool integration**
* ⚡ **FastAPI backend**
* ⚛️ **React frontend**
* 📊 **Structured trip data rendering**
* 🌐 **REST API architecture**

---

## 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                     FastAPI API
                           │
                           ▼
                    Input Guardrail
                           │
                           ▼
                  Trip Constraint Parser
                           │
                           ▼
                      Supervisor
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Flight Agent   Hotel Agent   Weather Agent
             │             │             │
             ▼             ▼             ▼
        Flight MCP     Hotel MCP     Weather MCP
             │             │             │
             ▼             ▼             ▼
       AviationStack    Tavily        Weather API
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                     Shared State
                      TravelState
                           │
                           ▼
                    Budget Agent
                           │
                           ▼
                  Itinerary Agent
                           │
                           ▼
                    Human Review
                      /       \
                 Approve     Changes
                    │           │
                    │           ▼
                    │       Regenerate
                    │
                    ▼
              Final Response
                    │
                    ▼
              React Trip UI
```

---

## 🧠 Multi-Agent Architecture

TripMind uses specialized agents instead of a single LLM call.

### 1. Trip Parser Agent

Extracts structured travel constraints from the user's natural-language query.

Example:

```text
"Plan a 3 day trip from Delhi to Dubai
for 2 people starting September 29"
```

becomes:

```json
{
  "origin": "Delhi",
  "destination": "Dubai",
  "duration_days": 3,
  "flight_date": "2026-09-29",
  "travelers": 2
}
```

---

### 2. Supervisor Agent

The supervisor determines which specialist agents are required for the request.

Available agents:

```text
flight
hotel
weather
budget
itinerary
```

For example:

```text
User Query
    ↓
Supervisor
    ↓
Flight + Hotel + Weather
```

---

### 3. Flight Agent

Responsible for retrieving flight information.

```text
Flight Agent
     ↓
Flight MCP
     ↓
AviationStack API
     ↓
Flight Results
```

Flight information can include:

* Flight number
* Airline
* Departure airport
* Arrival airport
* Departure time
* Arrival time
* Flight status

---

### 4. Hotel Agent

Searches for hotel information using Tavily.

```text
Hotel Agent
     ↓
Hotel MCP
     ↓
Tavily Search
     ↓
Hotel Search Results
```

Hotel results are treated as **search results**, not confirmed bookings.

---

### 5. Weather Agent

Retrieves current weather information for the destination.

```text
Weather Agent
      ↓
Weather MCP
      ↓
Weather API
      ↓
Weather Information
```

---

### 6. Budget Agent

Analyzes the available trip information and produces an estimated budget.

The agent separates:

* Flight cost
* Hotel cost
* Food
* Local transport
* Activities
* Total estimated cost

Actual booking prices are not invented when external APIs do not provide them.

---

### 7. Itinerary Agent

Generates a day-wise itinerary based on:

* Trip duration
* Destination
* Weather
* Available flight information
* Hotel information
* Budget
* Human feedback

The system validates that the generated itinerary contains the requested number of days.

---

### 8. Human-in-the-Loop

Before generating the final response, the user can review the generated plan.

```text
Generated Plan
      ↓
Human Review
      │
      ├── Approve
      │      ↓
      │   Final Response
      │
      └── Request Changes
             ↓
       Itinerary Regeneration
```

This allows users to provide feedback before finalizing the travel plan.

---

## 🔌 MCP Architecture

TripMind uses **Model Context Protocol (MCP)** to separate external tool integrations from the agents.

```text
Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
External API
```

Current MCP integrations:

| MCP Server  | Purpose         | External Service |
| ----------- | --------------- | ---------------- |
| Flight MCP  | Flight search   | AviationStack    |
| Hotel MCP   | Hotel discovery | Tavily           |
| Weather MCP | Weather data    | Weather API      |

This architecture makes external tools modular and easier to replace.

---

## 🧰 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* REST API integration

### Backend

* Python
* FastAPI
* Pydantic
* Pydantic Settings
* Uvicorn

### AI / Agent Framework

* LangGraph
* LangChain
* Groq
* `openai/gpt-oss-20b`

### MCP

* Model Context Protocol
* FastMCP
* MCP Client

### External APIs

* AviationStack
* Tavily
* Weather API

### Development

* Git
* GitHub
* Python Virtual Environment
* npm

---

## 📁 Project Structure

```text
TripMind/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │
│   │   ├── agents/
│   │   │   ├── trip_parser.py
│   │   │   ├── supervisor.py
│   │   │   ├── flight_agent.py
│   │   │   ├── hotel_agent.py
│   │   │   ├── weather_agent.py
│   │   │   ├── budget_agent.py
│   │   │   ├── itinerary_agent.py
│   │   │   ├── hitl.py
│   │   │   └── final_response_agent.py
│   │   │
│   │   ├── graph/
│   │   │   └── workflow.py
│   │   │
│   │   ├── mcp/
│   │   │   ├── flight_server.py
│   │   │   ├── hotel_server.py
│   │   │   └── weather_server.py
│   │   │
│   │   ├── guardrails/
│   │   │   └── input_guardrail.py
│   │   │
│   │   ├── models/
│   │   │   ├── travel_state.py
│   │   │   ├── trip_request.py
│   │   │   └── trip_review.py
│   │   │
│   │   ├── config/
│   │   │   └── settings.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔄 End-to-End Workflow

A typical request flows through the system like this:

```text
User
 │
 │ "Plan a 3-day trip from Delhi to Dubai"
 ▼
React Frontend
 │
 ▼
FastAPI
 │
 ▼
Input Guardrail
 │
 ▼
Trip Parser
 │
 ▼
Structured Trip Constraints
 │
 ▼
Supervisor
 │
 ├──────────────┬──────────────┐
 ▼              ▼              ▼
Flight         Hotel         Weather
Agent          Agent          Agent
 │              │              │
 ▼              ▼              ▼
MCP            MCP            MCP
 │              │              │
 ▼              ▼              ▼
Results        Results        Results
 │              │              │
 └──────────────┼──────────────┘
                ▼
           TravelState
                │
                ▼
          Budget Agent
                │
                ▼
        Itinerary Agent
                │
                ▼
         Human Review
                │
          ┌─────┴─────┐
          ▼           ▼
       Approve      Changes
          │           │
          │           ▼
          │      Regenerate
          │           │
          └─────┬─────┘
                ▼
        Final Response Agent
                │
                ▼
          Structured API
                │
                ▼
          React Frontend
                │
                ▼
          Final Trip Plan
```

---

## 📡 API Endpoints

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "service": "TripMind Backend"
}
```

---

### Create Trip Plan

```http
POST /plan
```

Request:

```json
{
  "query": "Plan a 3 day trip from Delhi to Dubai for 2 travelers",
  "thread_id": "trip-001"
}
```

The API may return:

```json
{
  "status": "awaiting_approval",
  "thread_id": "trip-001",
  "review": {}
}
```

After approval:

```json
{
  "status": "completed",
  "thread_id": "trip-001",
  "final_response": "...",
  "trip_data": {
    "trip_constraints": {},
    "flights": [],
    "hotels": [],
    "weather": {},
    "budget": {},
    "itinerary": []
  }
}
```

---

### Review Trip

```http
POST /plan/{thread_id}/review
```

Approve:

```json
{
  "action": "approve"
}
```

Request changes:

```json
{
  "action": "changes",
  "feedback": "Add more sightseeing activities."
}
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/TripMind.git

cd TripMind
```

---

### 2. Backend Setup

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Environment Variables

Create:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key
TAVILY_API_KEY=your_tavily_api_key
```

**Never commit `.env` to GitHub.**

Use `.env.example` as the template.

---

### 4. Start Backend

From the `backend` directory:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 5. Start Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The frontend will be available at the URL shown by Vite.

---

## 🔐 Environment Variables

The following credentials are required:

| Variable                | Purpose          |
| ----------------------- | ---------------- |
| `GROQ_API_KEY`          | LLM inference    |
| `AVIATIONSTACK_API_KEY` | Flight data      |
| `TAVILY_API_KEY`        | Hotel/web search |

Credentials should always be stored in environment variables and **must not be committed to GitHub**.

---

## 🧪 Example Query

```text
Plan a 3-day trip from Delhi to Dubai for 2 travelers
starting on September 29 with a budget of $1000.
```

TripMind processes the request through:

```text
Natural Language Query
        ↓
Constraint Extraction
        ↓
Agent Selection
        ↓
Flight Search
        ↓
Hotel Search
        ↓
Weather Search
        ↓
Budget Analysis
        ↓
Itinerary Generation
        ↓
Human Review
        ↓
Final Trip Plan
```

---

## 🛡️ Grounding & Reliability

TripMind is designed to avoid presenting unsupported information as confirmed facts.

The system follows rules such as:

* No invented flight prices
* No invented hotel booking confirmations
* No invented flight availability
* No unsupported visa/legal information
* No unsupported currency exchange rates
* Search results are not treated as confirmed bookings
* Estimates are explicitly labeled
* Missing information is reported as unavailable

---

## 🎯 Future Improvements

Planned improvements include:

* PostgreSQL persistence
* LangGraph persistent checkpoints
* Redis caching
* Async agent execution
* Streaming responses
* Docker containerization
* AWS deployment
* Better MCP tool ecosystem
* Flight price integrations
* Hotel pricing/availability integrations
* Authentication and user accounts
* Trip history
* Advanced observability and logging
* Agent evaluation and tracing
* Improved itinerary regeneration
* Production-grade error handling

---

## 📌 Project Status

🚧 **Active Development**

Current version includes:

* Full-stack React + FastAPI architecture
* LangGraph workflow
* Multi-agent travel planning
* MCP integrations
* Flight search
* Hotel search
* Weather information
* Budget analysis
* Itinerary generation
* Human-in-the-Loop approval
* Structured trip data rendering

---

## 👨‍💻 Author

**Manish Rai**

M.Tech — Artificial Intelligence
Delhi Technological University

---
