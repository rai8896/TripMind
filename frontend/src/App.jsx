// import { useState } from "react"

// const API_BASE_URL = "http://127.0.0.1:8000"

// function App() {
//   const [query, setQuery] = useState("")
//   const [threadId, setThreadId] = useState("")
//   const [status, setStatus] = useState("idle")
//   const [review, setReview] = useState(null)
//   const [finalResponse, setFinalResponse] = useState("")
//   const [error, setError] = useState("")
//   const [feedback, setFeedback] = useState("")

//   async function createTripPlan() {
//     if (!query.trim()) {
//       setError("Please enter your travel request.")
//       return
//     }

//     const newThreadId =
//       typeof crypto !== "undefined" &&
//       crypto.randomUUID
//         ? crypto.randomUUID()
//         : `trip-${Date.now()}`

//     setThreadId(newThreadId)
//     setError("")
//     setReview(null)
//     setFinalResponse("")
//     setStatus("loading")

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/plan`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             query: query.trim(),
//             thread_id: newThreadId,
//           }),
//         }
//       )

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             "Failed to generate travel plan."
//         )
//       }

//       if (
//         data.status ===
//         "awaiting_approval"
//       ) {
//         setReview(data.review || {})
//         setStatus("review")
//         return
//       }

//       if (
//         data.status ===
//         "completed"
//       ) {
//         setFinalResponse(
//           data.final_response || ""
//         )
//         setStatus("completed")
//         return
//       }

//       throw new Error(
//         "Unexpected response from backend."
//       )
//     } catch (err) {
//       setError(
//         err.message ||
//           "Something went wrong."
//       )
//       setStatus("idle")
//     }
//   }

//   async function submitReview(action) {
//     if (
//       action === "changes" &&
//       !feedback.trim()
//     ) {
//       setError(
//         "Please enter your feedback before requesting changes."
//       )
//       return
//     }

//     setError("")
//     setStatus("loading")

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/plan/${threadId}/review`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             action,
//             feedback:
//               action === "changes"
//                 ? feedback.trim()
//                 : "",
//           }),
//         }
//       )

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             "Failed to submit review."
//         )
//       }

//       if (
//         data.status ===
//         "awaiting_approval"
//       ) {
//         setReview(data.review || {})
//         setFeedback("")
//         setStatus("review")
//         return
//       }

//       if (
//         data.status ===
//         "completed"
//       ) {
//         setFinalResponse(
//           data.final_response || ""
//         )
//         setFeedback("")
//         setStatus("completed")
//         return
//       }

//       throw new Error(
//         "Unexpected response from backend."
//       )
//     } catch (err) {
//       setError(
//         err.message ||
//           "Something went wrong."
//       )
//       setStatus("review")
//     }
//   }

//   function resetTrip() {
//     setQuery("")
//     setThreadId("")
//     setStatus("idle")
//     setReview(null)
//     setFinalResponse("")
//     setError("")
//     setFeedback("")
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       <Header />

//       {status === "idle" && (
//         <>
//           <Hero
//             query={query}
//             setQuery={setQuery}
//             onSubmit={createTripPlan}
//             error={error}
//           />
//         </>
//       )}

//       {status === "loading" && (
//         <LoadingState />
//       )}

//       {status === "review" && (
//         <ReviewScreen
//           review={review}
//           feedback={feedback}
//           setFeedback={setFeedback}
//           onApprove={() =>
//             submitReview("approve")
//           }
//           onChanges={() =>
//             submitReview("changes")
//           }
//           error={error}
//         />
//       )}

//       {status === "completed" && (
//         <FinalTrip
//           finalResponse={finalResponse}
//           onNewTrip={resetTrip}
//         />
//       )}
//     </div>
//   )
// }


// function Header() {
//   return (
//     <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
//             ✈️
//           </div>

//           <div>
//             <h1 className="text-xl font-bold tracking-tight text-white">
//               TripMind
//             </h1>

//             <p className="text-xs text-slate-500">
//               AI Travel Planning
//             </p>
//           </div>
//         </div>

//         <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400 sm:flex">
//           <span className="h-2 w-2 rounded-full bg-emerald-400" />
//           Multi-Agent AI
//         </div>
//       </div>
//     </header>
//   )
// }


// function Hero({
//   query,
//   setQuery,
//   onSubmit,
//   error,
// }) {
//   return (
//     <main className="mx-auto max-w-5xl px-6 pb-20 pt-16">
//       <div className="mx-auto max-w-3xl text-center">
//         <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium text-blue-300">
//           <span>🤖</span>
//           Multi-Agent Travel Intelligence
//         </div>

//         <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
//           Plan your next trip
//           <span className="block text-blue-400">
//             with AI
//           </span>
//         </h2>

//         <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
//           TripMind uses specialized AI agents to
//           analyze flights, hotels, weather, budget
//           and itinerary before creating your travel
//           plan.
//         </p>
//       </div>

//       <div className="mx-auto mt-12 max-w-3xl">
//         <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20">
//           <textarea
//             value={query}
//             onChange={(event) =>
//               setQuery(event.target.value)
//             }
//             placeholder="Example: Plan a 3 day trip from Delhi to Dubai for 2 people with a budget of $1000..."
//             rows={6}
//             className="w-full resize-none rounded-2xl border border-white/5 bg-slate-900/70 p-5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
//           />

//           <div className="mt-4 flex items-center justify-between gap-4">
//             <p className="hidden text-xs text-slate-600 sm:block">
//               Enter your destination, dates,
//               duration and preferences.
//             </p>

//             <button
//               onClick={onSubmit}
//               className="ml-auto rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
//             >
//               Plan My Trip →
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
//             {error}
//           </div>
//         )}
//       </div>

//       <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
//         <InfoBox
//           icon="✈️"
//           title="Flights"
//           text="Search available flight information."
//         />

//         <InfoBox
//           icon="🏨"
//           title="Hotels"
//           text="Find relevant hotel search results."
//         />

//         <InfoBox
//           icon="🗺️"
//           title="Itinerary"
//           text="Generate a day-wise travel plan."
//         />
//       </div>
//     </main>
//   )
// }


// function LoadingState() {
//   return (
//     <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
//       <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
//         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10 text-3xl">
//           ✈️
//         </div>

//         <h2 className="mt-6 text-2xl font-bold text-white">
//           Building your trip
//         </h2>

//         <p className="mt-3 text-sm leading-6 text-slate-400">
//           TripMind is coordinating the required
//           travel agents and preparing your plan.
//         </p>

//         <div className="mx-auto mt-8 h-2 max-w-xs overflow-hidden rounded-full bg-white/5">
//           <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
//         </div>

//         <p className="mt-4 text-xs text-slate-600">
//           Flights · Hotels · Weather · Budget · Itinerary
//         </p>
//       </div>
//     </main>
//   )
// }


// function ReviewScreen({
//   review,
//   feedback,
//   setFeedback,
//   onApprove,
//   onChanges,
//   error,
// }) {
//   const budget =
//     review?.budget || {}

//   const itinerary =
//     review?.itinerary || []

//   const flights =
//     review?.flights || []

//   const hotels =
//     review?.hotels || []

//   const weather =
//     review?.weather || {}

//   return (
//     <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
//       <div className="mb-10">
//         <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-300">
//           <span>👤</span>
//           Human Review Required
//         </div>

//         <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
//           Review your trip
//         </h2>

//         <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
//           Review the generated travel information.
//           You can approve the plan or request
//           changes.
//         </p>
//       </div>

//       <div className="space-y-6">
//         <BudgetBreakdown
//           budget={budget}
//         />

//         <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-xl bg-blue-400/10 p-3">
//               ✈️
//             </div>

//             <div>
//               <h3 className="font-semibold text-white">
//                 Available Flights
//               </h3>

//               <p className="text-sm text-slate-400">
//                 Flight information from the current
//                 travel data
//               </p>
//             </div>
//           </div>

//           {flights.length === 0 ? (
//             <EmptyText>
//               Flight information is not available
//               in the current travel data.
//             </EmptyText>
//           ) : (
//             <div className="space-y-3">
//               {flights.map(
//                 (flight, index) => (
//                   <ReviewFlightCard
//                     key={`${flight.flight_number || "flight"}-${index}`}
//                     flight={flight}
//                   />
//                 )
//               )}
//             </div>
//           )}
//         </div>

//         <HotelSection
//           hotels={hotels}
//         />

//         <WeatherCard
//           weather={weather}
//         />

//         <ItinerarySection
//           itinerary={itinerary}
//         />

//         <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//           <h3 className="text-lg font-semibold text-white">
//             Request changes
//           </h3>

//           <p className="mt-2 text-sm text-slate-400">
//             Tell TripMind what you want to modify.
//           </p>

//           <textarea
//             value={feedback}
//             onChange={(event) =>
//               setFeedback(
//                 event.target.value
//               )
//             }
//             placeholder="Example: Make Day 2 less expensive and add more indoor activities."
//             rows={4}
//             className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
//           />
//         </div>

//         {error && (
//           <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//           <button
//             onClick={onChanges}
//             className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
//           >
//             Request Changes
//           </button>

//           <button
//             onClick={onApprove}
//             className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
//           >
//             ✓ Approve Trip
//           </button>
//         </div>
//       </div>
//     </main>
//   )
// }


// function BudgetBreakdown({
//   budget,
// }) {
//   const currency =
//     budget.currency || "USD"

//   const flight =
//     budget.flight_cost_estimate || 0

//   const hotel =
//     budget.hotel_cost_estimate || 0

//   const food =
//     budget.food_cost_estimate || 0

//   const transport =
//     budget.local_transport_estimate || 0

//   const activities =
//     budget.activities_cost_estimate || 0

//   const total =
//     budget.total_estimated_cost || 0

//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm text-slate-400">
//             Estimated Budget
//           </p>

//           <h3 className="mt-2 text-3xl font-bold text-white">
//             {currency} {total}
//           </h3>
//         </div>

//         <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-medium capitalize text-emerald-300">
//           {formatBudgetStatus(
//             budget.budget_status
//           )}
//         </div>
//       </div>

//       <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
//         <BudgetItem
//           label="Flights"
//           value={flight}
//           currency={currency}
//         />

//         <BudgetItem
//           label="Hotels"
//           value={hotel}
//           currency={currency}
//         />

//         <BudgetItem
//           label="Food"
//           value={food}
//           currency={currency}
//         />

//         <BudgetItem
//           label="Transport"
//           value={transport}
//           currency={currency}
//         />

//         <BudgetItem
//           label="Activities"
//           value={activities}
//           currency={currency}
//         />
//       </div>
//     </div>
//   )
// }


// function BudgetItem({
//   label,
//   value,
//   currency,
// }) {
//   return (
//     <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
//       <p className="text-xs text-slate-500">
//         {label}
//       </p>

//       <p className="mt-2 font-semibold text-white">
//         {currency} {value}
//       </p>
//     </div>
//   )
// }


// function ReviewFlightCard({
//   flight,
// }) {
//   return (
//     <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-lg font-bold text-white">
//             {flight.flight_number ||
//               "Flight"}
//           </p>

//           <p className="mt-1 text-sm text-slate-400">
//             {flight.airline ||
//               "Airline unavailable"}
//           </p>
//         </div>

//         <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium capitalize text-emerald-300">
//           {flight.status ||
//             "unknown"}
//         </span>
//       </div>

//       <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
//         <div>
//           <p className="text-2xl font-bold text-white">
//             {flight.departure_iata ||
//               "—"}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             {formatFlightTime(
//               flight.departure_time
//             )}
//           </p>

//           <p className="mt-2 text-xs text-slate-600">
//             {flight.departure_airport ||
//               ""}
//           </p>
//         </div>

//         <div className="text-center">
//           <div className="text-xl text-blue-400">
//             ───✈───
//           </div>

//           <p className="mt-1 text-[10px] text-slate-600">
//             Flight
//           </p>
//         </div>

//         <div className="text-right">
//           <p className="text-2xl font-bold text-white">
//             {flight.arrival_iata ||
//               "—"}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             {formatFlightTime(
//               flight.arrival_time
//             )}
//           </p>

//           <p className="mt-2 text-xs text-slate-600">
//             {flight.arrival_airport ||
//               ""}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// function FinalTrip({
//   finalResponse,
//   onNewTrip,
// }) {
//   const flights =
//     parseFlights(finalResponse)

//   const hotels =
//     parseHotels(finalResponse)

//   const weather =
//     parseWeather(finalResponse)

//   const budget =
//     parseBudget(finalResponse)

//   const itinerary =
//     parseItinerary(finalResponse)

//   const summary =
//     parseTripSummary(finalResponse)

//   const importantNotes =
//     parseImportantNotes(
//       finalResponse
//     )

//   return (
//     <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">
//       <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300">
//             <span>✓</span>
//             Trip Approved
//           </div>

//           <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
//             Your Trip Plan
//           </h2>

//           <p className="mt-3 text-sm text-slate-400">
//             Your reviewed travel plan is ready.
//           </p>
//         </div>

//         <button
//           onClick={onNewTrip}
//           className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
//         >
//           + Plan Another Trip
//         </button>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
//         <div className="space-y-6">
//           <TripSummary
//             summary={summary}
//           />

//           <ItinerarySection
//             itinerary={itinerary}
//           />

//           <ImportantNotes
//             notes={importantNotes}
//           />
//         </div>

//         <div className="space-y-6">
//           <FlightCard
//             flights={flights}
//           />

//           <HotelSection
//             hotels={hotels}
//           />

//           <WeatherCard
//             weather={weather}
//           />

//           <BudgetCard
//             budget={budget}
//           />
//         </div>
//       </div>

//       {!summary &&
//         !itinerary.length &&
//         !flights.length &&
//         !hotels.length &&
//         !weather &&
//         !budget && (
//           <div className="mt-6">
//             <SideCard
//               icon="📄"
//               title="Travel Plan"
//               subtitle="Generated response"
//             >
//               <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
//                 {finalResponse}
//               </div>
//             </SideCard>
//           </div>
//         )}
//     </main>
//   )
// }


// function TripSummary({
//   summary,
// }) {
//   if (!summary) {
//     return null
//   }

//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//       <div className="mb-5 flex items-center gap-3">
//         <div className="rounded-xl bg-blue-400/10 p-3">
//           🧭
//         </div>

//         <div>
//           <h3 className="font-semibold text-white">
//             Trip Summary
//           </h3>

//           <p className="text-sm text-slate-500">
//             Overview of your trip
//           </p>
//         </div>
//       </div>

//       <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
//         {summary}
//       </div>
//     </div>
//   )
// }


// function InfoBox({
//   icon,
//   title,
//   text,
// }) {
//   return (
//     <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//       <div className="text-2xl">
//         {icon}
//       </div>

//       <h3 className="mt-4 font-semibold text-white">
//         {title}
//       </h3>

//       <p className="mt-2 text-sm leading-6 text-slate-500">
//         {text}
//       </p>
//     </div>
//   )
// }


// function FlightCard({
//   flights,
// }) {
//   const unavailable =
//     !Array.isArray(flights) ||
//     flights.length === 0

//   return (
//     <SideCard
//       icon="✈️"
//       title="Flights"
//       subtitle={
//         unavailable
//           ? "No flight data available"
//           : "Available flight information"
//       }
//     >
//       {unavailable ? (
//         <EmptyText>
//           Flight information is not available
//           in the current travel data.
//         </EmptyText>
//       ) : (
//         <div className="space-y-3">
//           {flights.map(
//             (flight, index) => (
//               <FlightItem
//                 key={`${flight.flight_number || "flight"}-${index}`}
//                 flight={flight}
//               />
//             )
//           )}
//         </div>
//       )}
//     </SideCard>
//   )
// }


// function FlightItem({
//   flight,
// }) {
//   const status =
//     flight.status || "unknown"

//   return (
//     <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-lg font-bold text-white">
//             {flight.flight_number ||
//               "Flight"}
//           </p>

//           <p className="mt-1 text-sm text-slate-400">
//             {flight.airline ||
//               "Airline unavailable"}
//           </p>
//         </div>

//         <span
//           className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
//             status.toLowerCase() ===
//             "scheduled"
//               ? "bg-emerald-400/10 text-emerald-300"
//               : status.toLowerCase() ===
//                   "active"
//                 ? "bg-blue-400/10 text-blue-300"
//                 : "bg-white/5 text-slate-400"
//           }`}
//         >
//           {status}
//         </span>
//       </div>

//       <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
//         <div>
//           <p className="text-xl font-bold text-white">
//             {flight.departure_iata ||
//               "—"}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             {formatFlightTime(
//               flight.departure_time
//             )}
//           </p>

//           <p className="mt-2 text-[11px] leading-4 text-slate-600">
//             {flight.departure_airport ||
//               ""}
//           </p>
//         </div>

//         <div className="flex flex-col items-center">
//           <span className="text-lg text-blue-400">
//             →
//           </span>

//           <span className="mt-1 text-[10px] text-slate-600">
//             flight
//           </span>
//         </div>

//         <div className="text-right">
//           <p className="text-xl font-bold text-white">
//             {flight.arrival_iata ||
//               "—"}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             {formatFlightTime(
//               flight.arrival_time
//             )}
//           </p>

//           <p className="mt-2 text-[11px] leading-4 text-slate-600">
//             {flight.arrival_airport ||
//               ""}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// function WeatherCard({
//   weather,
// }) {
//   if (
//     !weather ||
//     typeof weather !== "object" ||
//     Object.keys(weather).length === 0
//   ) {
//     return (
//       <SideCard
//         icon="🌤️"
//         title="Weather"
//         subtitle="No weather data available"
//       >
//         <EmptyText>
//           Weather information is not available
//           in the current travel data.
//         </EmptyText>
//       </SideCard>
//     )
//   }

//   return (
//     <SideCard
//       icon="🌤️"
//       title="Weather"
//       subtitle={
//         weather.city
//           ? `Current conditions in ${weather.city}`
//           : "Current weather"
//       }
//     >
//       <div className="grid grid-cols-2 gap-3">
//         <WeatherItem
//           label="Temperature"
//           value={
//             weather.temperature_c !==
//             undefined
//               ? `${weather.temperature_c}°C`
//               : "Unavailable"
//           }
//         />

//         <WeatherItem
//           label="Feels like"
//           value={
//             weather.feels_like_c !==
//             undefined
//               ? `${weather.feels_like_c}°C`
//               : "Unavailable"
//           }
//         />

//         <WeatherItem
//           label="Condition"
//           value={
//             weather.condition ||
//             "Unavailable"
//           }
//         />

//         <WeatherItem
//           label="Humidity"
//           value={
//             weather.humidity !==
//             undefined
//               ? `${weather.humidity}%`
//               : "Unavailable"
//           }
//         />
//       </div>

//       {weather.wind_kmph !==
//         undefined && (
//         <div className="mt-3 rounded-2xl border border-white/5 bg-slate-900/60 p-3">
//           <p className="text-xs text-slate-500">
//             Wind
//           </p>

//           <p className="mt-1 text-sm font-medium text-white">
//             {weather.wind_kmph} km/h
//           </p>
//         </div>
//       )}
//     </SideCard>
//   )
// }


// function WeatherItem({
//   label,
//   value,
// }) {
//   return (
//     <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
//       <p className="text-xs text-slate-500">
//         {label}
//       </p>

//       <p className="mt-1 text-sm font-medium text-white">
//         {value}
//       </p>
//     </div>
//   )
// }


// function BudgetCard({
//   budget,
// }) {
//   if (
//     !budget ||
//     typeof budget !== "object" ||
//     Object.keys(budget).length === 0
//   ) {
//     return (
//       <SideCard
//         icon="💰"
//         title="Budget"
//         subtitle="No budget data available"
//       >
//         <EmptyText>
//           Budget information is not available
//           in the current travel data.
//         </EmptyText>
//       </SideCard>
//     )
//   }

//   const currency =
//     budget.currency || "USD"

//   return (
//     <SideCard
//       icon="💰"
//       title="Budget"
//       subtitle="Estimated trip costs"
//     >
//       <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
//         <p className="text-xs text-slate-500">
//           Total estimated cost
//         </p>

//         <p className="mt-1 text-2xl font-bold text-white">
//           {currency}{" "}
//           {budget.total_estimated_cost ||
//             0}
//         </p>
//       </div>

//       <div className="mt-3 space-y-2">
//         <MiniBudgetRow
//           label="Flights"
//           value={
//             budget.flight_cost_estimate ||
//             0
//           }
//           currency={currency}
//         />

//         <MiniBudgetRow
//           label="Hotels"
//           value={
//             budget.hotel_cost_estimate ||
//             0
//           }
//           currency={currency}
//         />

//         <MiniBudgetRow
//           label="Food"
//           value={
//             budget.food_cost_estimate ||
//             0
//           }
//           currency={currency}
//         />

//         <MiniBudgetRow
//           label="Transport"
//           value={
//             budget.local_transport_estimate ||
//             0
//           }
//           currency={currency}
//         />

//         <MiniBudgetRow
//           label="Activities"
//           value={
//             budget.activities_cost_estimate ||
//             0
//           }
//           currency={currency}
//         />
//       </div>
//     </SideCard>
//   )
// }


// function MiniBudgetRow({
//   label,
//   value,
//   currency,
// }) {
//   return (
//     <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
//       <span className="text-xs text-slate-500">
//         {label}
//       </span>

//       <span className="text-xs font-medium text-slate-300">
//         {currency} {value}
//       </span>
//     </div>
//   )
// }


// function SideCard({
//   icon,
//   title,
//   subtitle,
//   children,
// }) {
//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
//       <div className="mb-5 flex items-center gap-3">
//         <div className="rounded-xl bg-white/[0.05] p-3">
//           {icon}
//         </div>

//         <div>
//           <h3 className="font-semibold text-white">
//             {title}
//           </h3>

//           <p className="text-xs text-slate-500">
//             {subtitle}
//           </p>
//         </div>
//       </div>

//       {children}
//     </div>
//   )
// }


// function HotelSection({
//   hotels,
// }) {
//   if (
//     !Array.isArray(hotels) ||
//     hotels.length === 0
//   ) {
//     return (
//       <SideCard
//         icon="🏨"
//         title="Hotels"
//         subtitle="No hotel data available"
//       >
//         <EmptyText>
//           Hotel information is not available
//           in the current travel data.
//         </EmptyText>
//       </SideCard>
//     )
//   }

//   return (
//     <SideCard
//       icon="🏨"
//       title="Hotels"
//       subtitle="Hotel search results"
//     >
//       <div className="space-y-3">
//         {hotels.map(
//           (hotel, index) => (
//             <div
//               key={`${hotel.title || "hotel"}-${index}`}
//               className="rounded-2xl border border-white/5 bg-slate-900/70 p-4"
//             >
//               <p className="font-semibold text-white">
//                 {hotel.title ||
//                   "Hotel result"}
//               </p>

//               {hotel.content && (
//                 <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-500">
//                   {hotel.content}
//                 </p>
//               )}

//               {hotel.url && (
//                 <a
//                   href={hotel.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="mt-3 inline-block text-xs font-medium text-blue-400 hover:text-blue-300"
//                 >
//                   View source →
//                 </a>
//               )}
//             </div>
//           )
//         )}
//       </div>
//     </SideCard>
//   )
// }


// function ItinerarySection({
//   itinerary,
// }) {
//   if (
//     !Array.isArray(itinerary) ||
//     itinerary.length === 0
//   ) {
//     return (
//       <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//         <div className="mb-5 flex items-center gap-3">
//           <div className="rounded-xl bg-blue-400/10 p-3">
//             🗓️
//           </div>

//           <div>
//             <h3 className="font-semibold text-white">
//               Day-wise Itinerary
//             </h3>

//             <p className="text-sm text-slate-500">
//               Generated travel schedule
//             </p>
//           </div>
//         </div>

//         <EmptyText>
//           Itinerary information is not available
//           in the current travel data.
//         </EmptyText>
//       </div>
//     )
//   }

//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//       <div className="mb-6 flex items-center gap-3">
//         <div className="rounded-xl bg-blue-400/10 p-3">
//           🗓️
//         </div>

//         <div>
//           <h3 className="font-semibold text-white">
//             Day-wise Itinerary
//           </h3>

//           <p className="text-sm text-slate-500">
//             Generated travel schedule
//           </p>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {itinerary.map(
//           (day, index) => (
//             <DayCard
//               key={`${day.day || index}-${index}`}
//               day={day}
//             />
//           )
//         )}
//       </div>
//     </div>
//   )
// }


// function DayCard({
//   day,
// }) {
//   return (
//     <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
//       <div className="flex items-start gap-4">
//         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
//           {day.day}
//         </div>

//         <div className="min-w-0 flex-1">
//           <h4 className="font-semibold text-white">
//             {day.title ||
//               `Day ${day.day}`}
//           </h4>

//           {Array.isArray(
//             day.activities
//           ) && (
//             <ul className="mt-4 space-y-2">
//               {day.activities.map(
//                 (
//                   activity,
//                   index
//                 ) => (
//                   <li
//                     key={`${index}-${activity}`}
//                     className="flex gap-3 text-sm leading-6 text-slate-400"
//                   >
//                     <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
//                     <span>
//                       {activity}
//                     </span>
//                   </li>
//                 )
//               )}
//             </ul>
//           )}

//           {day.estimated_cost !==
//             undefined && (
//             <div className="mt-4 text-xs text-slate-600">
//               Estimated activity cost:{" "}
//               {day.estimated_cost}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


// function ImportantNotes({
//   notes,
// }) {
//   if (!notes) {
//     return null
//   }

//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
//       <div className="mb-5 flex items-center gap-3">
//         <div className="rounded-xl bg-amber-400/10 p-3">
//           📝
//         </div>

//         <div>
//           <h3 className="font-semibold text-white">
//             Important Notes
//           </h3>

//           <p className="text-sm text-slate-500">
//             Additional travel information
//           </p>
//         </div>
//       </div>

//       <div className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
//         {notes}
//       </div>
//     </div>
//   )
// }


// function EmptyText({
//   children,
// }) {
//   return (
//     <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-sm leading-6 text-slate-500">
//       {children}
//     </div>
//   )
// }


// function formatBudgetStatus(
//   status
// ) {
//   if (!status) {
//     return "unknown"
//   }

//   return String(status).replace(
//     /_/g,
//     " "
//   )
// }


// function cleanText(value) {
//   if (
//     value === null ||
//     value === undefined
//   ) {
//     return ""
//   }

//   return String(value)
//     .replace(
//       /\*\*/g,
//       ""
//     )
//     .replace(
//       /`/g,
//       ""
//     )
//     .trim()
// }


// function getSectionByHeading(
//   markdown,
//   startHeading,
//   endHeading
// ) {
//   if (!markdown) {
//     return ""
//   }

//   const startIndex =
//     markdown.indexOf(
//       startHeading
//     )

//   if (startIndex === -1) {
//     return ""
//   }

//   const contentStart =
//     startIndex +
//     startHeading.length

//   const endIndex =
//     markdown.indexOf(
//       endHeading,
//       contentStart
//     )

//   if (endIndex === -1) {
//     return markdown.slice(
//       contentStart
//     )
//   }

//   return markdown.slice(
//     contentStart,
//     endIndex
//   )
// }


// function splitTableRow(
//   line
// ) {
//   return line
//     .split("|")
//     .map((cell) =>
//       cleanText(cell)
//     )
//     .filter(
//       (_, index, array) => {
//         if (
//           index === 0 ||
//           index === array.length - 1
//         ) {
//           return true
//         }

//         return true
//       }
//     )
// }


// function parseFlights(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "2. Flights",
//       "3. Hotels"
//     )

//   if (!section.trim()) {
//     return []
//   }

//   const flights = []

//   const lines =
//     section
//       .split("\n")
//       .map((line) =>
//         line.trim()
//       )
//       .filter(Boolean)

//   for (const line of lines) {
//     if (!line.includes("|")) {
//       continue
//     }

//     const cells =
//       splitTableRow(line)

//     if (cells.length < 6) {
//       continue
//     }

//     const flightNumber =
//       cleanText(cells[0])

//     const airline =
//       cleanText(cells[1])

//     const departure =
//       cleanText(cells[2])

//     const arrival =
//       cleanText(cells[3])

//     const status =
//       cleanText(cells[4])

//     if (
//       !flightNumber ||
//       !airline ||
//       !departure ||
//       !arrival
//     ) {
//       continue
//     }

//     if (
//       /^flight$/i.test(
//         flightNumber
//       ) ||
//       /^airline$/i.test(
//         airline
//       ) ||
//       /^departure$/i.test(
//         departure
//       )
//     ) {
//       continue
//     }

//     if (
//       /^-+$/.test(
//         flightNumber
//       )
//     ) {
//       continue
//     }

//     const departureData =
//       parseFlightLocation(
//         departure
//       )

//     const arrivalData =
//       parseFlightLocation(
//         arrival
//       )

//     flights.push({
//       flight_number:
//         flightNumber,

//       airline,

//       departure_iata:
//         departureData.iata,

//       departure_time:
//         departureData.time,

//       departure_airport:
//         departureData.airport,

//       arrival_iata:
//         arrivalData.iata,

//       arrival_time:
//         arrivalData.time,

//       arrival_airport:
//         arrivalData.airport,

//       status:
//         status || "unknown",
//     })
//   }

//   return uniqueFlights(
//     flights
//   )
// }


// function parseFlightLocation(
//   value
// ) {
//   const text =
//     cleanText(value)

//   const iataMatch =
//     text.match(
//       /\(([A-Z]{3})\)/
//     )

//   const iata =
//     iataMatch
//       ? iataMatch[1]
//       : ""

//   let time =
//     text.replace(
//       /\s*\([A-Z]{3}\)\s*$/,
//       ""
//     ).trim()

//   time =
//     time.replace(
//       /[‐-‒–—―]/g,
//       "-"
//     )

//   return {
//     iata,
//     time,
//     airport: "",
//   }
// }


// function uniqueFlights(
//   flights
// ) {
//   const seen = new Set()

//   return flights.filter(
//     (flight) => {
//       const key = [
//         flight.flight_number,
//         flight.departure_time,
//         flight.arrival_time,
//       ].join("|")

//       if (seen.has(key)) {
//         return false
//       }

//       seen.add(key)

//       return true
//     }
//   )
// }


// function parseHotels(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "3. Hotels",
//       "4. Weather"
//     )

//   if (!section.trim()) {
//     return []
//   }

//   const hotels = []

//   const lines =
//     section
//       .split("\n")
//       .map((line) =>
//         line.trim()
//       )
//       .filter(Boolean)

//   for (const line of lines) {
//     if (
//       line.startsWith("-")
//     ) {
//       const value =
//         cleanText(
//           line.replace(
//             /^-\s*/,
//             ""
//           )
//         )

//       if (value) {
//         hotels.push({
//           title: value,
//           content: "",
//           url: "",
//         })
//       }
//     }
//   }

//   return hotels
// }


// function parseWeather(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "4. Weather",
//       "5. Budget"
//     )

//   if (!section.trim()) {
//     return null
//   }

//   return {
//     raw: section.trim(),
//   }
// }


// function parseBudget(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "5. Budget",
//       "6. Day-wise Itinerary"
//     )

//   if (!section.trim()) {
//     return null
//   }

//   const budget = {
//     currency: "USD",
//     total_estimated_cost: 0,
//     flight_cost_estimate: 0,
//     hotel_cost_estimate: 0,
//     food_cost_estimate: 0,
//     local_transport_estimate: 0,
//     activities_cost_estimate: 0,
//   }

//   const totalMatch =
//     section.match(
//       /total[^0-9]*([0-9,]+(?:\.[0-9]+)?)/i
//     )

//   if (totalMatch) {
//     budget.total_estimated_cost =
//       Number(
//         totalMatch[1].replace(
//           /,/g,
//           ""
//         )
//       )
//   }

//   const currencyMatch =
//     section.match(
//       /\b(USD|INR|EUR|GBP)\b/i
//     )

//   if (currencyMatch) {
//     budget.currency =
//       currencyMatch[1].toUpperCase()
//   }

//   return budget
// }


// function parseItinerary(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "6. Day-wise Itinerary",
//       "7. Important Notes"
//     )

//   if (!section.trim()) {
//     return []
//   }

//   const itinerary = []

//   const blocks =
//     section.split(
//       /(?=Day\s+\d+)/i
//     )

//   for (const block of blocks) {
//     const dayMatch =
//       block.match(
//         /Day\s+(\d+)/i
//       )

//     if (!dayMatch) {
//       continue
//     }

//     const day =
//       Number(
//         dayMatch[1]
//       )

//     const lines =
//       block
//         .split("\n")
//         .map((line) =>
//           cleanText(line)
//         )
//         .filter(Boolean)

//     const title =
//       lines[0] ||
//       `Day ${day}`

//     const activities =
//       lines
//         .slice(1)
//         .filter(
//           (line) =>
//             line.startsWith("-") ||
//             line.startsWith("•")
//         )
//         .map((line) =>
//           line.replace(
//             /^[-•]\s*/,
//             ""
//           )
//         )

//     itinerary.push({
//       day,
//       title,
//       activities,
//       estimated_cost: 0,
//     })
//   }

//   return itinerary.sort(
//     (a, b) =>
//       a.day - b.day
//   )
// }


// function parseTripSummary(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "1. Trip Summary",
//       "2. Flights"
//     )

//   return section.trim()
//     ? section.trim()
//     : ""
// }


// function parseImportantNotes(
//   markdown
// ) {
//   const section =
//     getSectionByHeading(
//       markdown,
//       "7. Important Notes",
//       ""
//     )

//   return section.trim()
//     ? section.trim()
//     : ""
// }


// function formatFlightTime(
//   value
// ) {
//   if (!value) {
//     return "Time unavailable"
//   }

//   const date =
//     new Date(value)

//   if (
//     Number.isNaN(
//       date.getTime()
//     )
//   ) {
//     return cleanText(value)
//   }

//   return date.toLocaleString(
//     "en-IN",
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }
//   )
// }


// export default App


import { useState } from "react"

const API_BASE_URL = "http://127.0.0.1:8000"

function App() {
  const [query, setQuery] = useState("")
  const [threadId, setThreadId] = useState("")
  const [status, setStatus] = useState("idle")
  const [review, setReview] = useState(null)
  const [tripData, setTripData] = useState(null)
  const [finalResponse, setFinalResponse] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  async function createTripPlan() {
    if (!query.trim()) {
      setError("Please enter your travel request.")
      return
    }

    const newThreadId =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `trip-${Date.now()}`

    setThreadId(newThreadId)
    setError("")
    setReview(null)
    setTripData(null)
    setFinalResponse("")
    setStatus("loading")

    try {
      const response = await fetch(
        `${API_BASE_URL}/plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            thread_id: newThreadId,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to generate travel plan."
        )
      }

      if (
        data.status ===
        "awaiting_approval"
      ) {
        setReview(data.review || {})
        setStatus("review")
        return
      }

      if (
        data.status ===
        "completed"
      ) {
        setFinalResponse(
          data.final_response || ""
        )

        setTripData(
          data.trip_data || null
        )

        setStatus("completed")
        return
      }

      throw new Error(
        "Unexpected response from backend."
      )
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      )
      setStatus("idle")
    }
  }

  async function submitReview(action) {
    if (
      action === "changes" &&
      !feedback.trim()
    ) {
      setError(
        "Please enter your feedback before requesting changes."
      )
      return
    }

    setError("")
    setStatus("loading")

    try {
      const response = await fetch(
        `${API_BASE_URL}/plan/${threadId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            feedback:
              action === "changes"
                ? feedback.trim()
                : "",
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to submit review."
        )
      }

      if (
        data.status ===
        "awaiting_approval"
      ) {
        setReview(data.review || {})
        setFeedback("")
        setStatus("review")
        return
      }

      if (
        data.status ===
        "completed"
      ) {
        setFinalResponse(
          data.final_response || ""
        )

        setTripData(
          data.trip_data || null
        )

        setFeedback("")
        setStatus("completed")
        return
      }

      throw new Error(
        "Unexpected response from backend."
      )
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      )
      setStatus("review")
    }
  }

  function resetTrip() {
    setQuery("")
    setThreadId("")
    setStatus("idle")
    setReview(null)
    setTripData(null)
    setFinalResponse("")
    setFeedback("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      {status === "idle" && (
        <Hero
          query={query}
          setQuery={setQuery}
          onSubmit={createTripPlan}
          error={error}
        />
      )}

      {status === "loading" && (
        <LoadingState />
      )}

      {status === "review" && (
        <ReviewScreen
          review={review}
          feedback={feedback}
          setFeedback={setFeedback}
          onApprove={() =>
            submitReview("approve")
          }
          onChanges={() =>
            submitReview("changes")
          }
          error={error}
        />
      )}

      {status === "completed" && (
        <FinalTrip
          finalResponse={finalResponse}
          tripData={tripData}
          onNewTrip={resetTrip}
        />
      )}
    </div>
  )
}


function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
            ✈️
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              TripMind
            </h1>

            <p className="text-xs text-slate-500">
              AI Travel Planning
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Multi-Agent AI
        </div>
      </div>
    </header>
  )
}


function Hero({
  query,
  setQuery,
  onSubmit,
  error,
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium text-blue-300">
          <span>🤖</span>
          Multi-Agent Travel Intelligence
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Plan your next trip
          <span className="block text-blue-400">
            with AI
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          TripMind uses specialized AI agents to
          analyze flights, hotels, weather, budget
          and itinerary before creating your travel
          plan.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20">
          <textarea
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Example: Plan a 2 day trip from Delhi to Dubai for 2 people with a budget of $3000..."
            rows={6}
            className="w-full resize-none rounded-2xl border border-white/5 bg-slate-900/70 p-5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="hidden text-xs text-slate-600 sm:block">
              Enter your destination, dates,
              duration and preferences.
            </p>

            <button
              onClick={onSubmit}
              className="ml-auto rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Plan My Trip →
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
        <InfoBox
          icon="✈️"
          title="Flights"
          text="Search available flight information."
        />

        <InfoBox
          icon="🏨"
          title="Hotels"
          text="Find relevant hotel search results."
        />

        <InfoBox
          icon="🗺️"
          title="Itinerary"
          text="Generate a day-wise travel plan."
        />
      </div>
    </main>
  )
}


function LoadingState() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10 text-3xl">
          ✈️
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          Building your trip
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          TripMind is coordinating the required
          travel agents and preparing your plan.
        </p>

        <div className="mx-auto mt-8 h-2 max-w-xs overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
        </div>

        <p className="mt-4 text-xs text-slate-600">
          Flights · Hotels · Weather · Budget · Itinerary
        </p>
      </div>
    </main>
  )
}


function ReviewScreen({
  review,
  feedback,
  setFeedback,
  onApprove,
  onChanges,
  error,
}) {
  const budget =
    review?.budget || {}

  const itinerary =
    review?.itinerary || []

  const flights =
    review?.flights || []

  const hotels =
    review?.hotels || []

  const weather =
    review?.weather || {}

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-300">
          <span>👤</span>
          Human Review Required
        </div>

        <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
          Review your trip
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Review the generated travel information.
          You can approve the plan or request
          changes.
        </p>
      </div>

      <div className="space-y-6">
        <BudgetBreakdown
          budget={budget}
        />

        <ReviewFlights
          flights={flights}
        />

        <ReviewHotels
          hotels={hotels}
        />

        <ReviewWeather
          weather={weather}
        />

        <ItinerarySection
          itinerary={itinerary}
        />

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold text-white">
            Request changes
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Tell TripMind what you want to modify.
          </p>

          <textarea
            value={feedback}
            onChange={(event) =>
              setFeedback(
                event.target.value
              )
            }
            placeholder="Example: Make Day 2 less expensive and add more indoor activities."
            rows={4}
            className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400/40"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onChanges}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
          >
            Request Changes
          </button>

          <button
            onClick={onApprove}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            ✓ Approve Trip
          </button>
        </div>
      </div>
    </main>
  )
}


function BudgetBreakdown({
  budget,
}) {
  const currency =
    budget.currency || "USD"

  const flight =
    budget.flight_cost_estimate || 0

  const hotel =
    budget.hotel_cost_estimate || 0

  const food =
    budget.food_cost_estimate || 0

  const transport =
    budget.local_transport_estimate || 0

  const activities =
    budget.activities_cost_estimate || 0

  const total =
    budget.total_estimated_cost || 0

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            Estimated Budget
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {currency} {total}
          </h3>
        </div>

        <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-medium capitalize text-emerald-300">
          {formatBudgetStatus(
            budget.budget_status
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <BudgetItem
          label="Flights"
          value={flight}
          currency={currency}
        />

        <BudgetItem
          label="Hotels"
          value={hotel}
          currency={currency}
        />

        <BudgetItem
          label="Food"
          value={food}
          currency={currency}
        />

        <BudgetItem
          label="Transport"
          value={transport}
          currency={currency}
        />

        <BudgetItem
          label="Activities"
          value={activities}
          currency={currency}
        />
      </div>

      {budget.explanation && (
        <p className="mt-5 text-xs leading-5 text-slate-500">
          {budget.explanation}
        </p>
      )}
    </div>
  )
}


function BudgetItem({
  label,
  value,
  currency,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-white">
        {currency} {value}
      </p>
    </div>
  )
}


function ReviewFlights({
  flights,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-400/10 p-3">
          ✈️
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Available Flights
          </h3>

          <p className="text-sm text-slate-400">
            Flight information from current travel
            data
          </p>
        </div>
      </div>

      {!Array.isArray(flights) ||
      flights.length === 0 ? (
        <EmptyText>
          Flight information is not available
          in the current travel data.
        </EmptyText>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {flights.map(
            (flight, index) => (
              <ReviewFlightCard
                key={`${flight.flight_number || "flight"}-${index}`}
                flight={flight}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}


function ReviewFlightCard({
  flight,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-white">
            {flight.flight_number ||
              "Flight"}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {flight.airline ||
              "Airline unavailable"}
          </p>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium capitalize text-emerald-300">
          {flight.status ||
            "unknown"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div>
          <p className="text-2xl font-bold text-white">
            {flight.departure_iata ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatFlightTime(
              flight.departure_time
            )}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {flight.departure_airport ||
              ""}
          </p>
        </div>

        <div className="text-center">
          <div className="text-xl text-blue-400">
            ───✈───
          </div>

          <p className="mt-1 text-[10px] text-slate-600">
            Flight
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {flight.arrival_iata ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatFlightTime(
              flight.arrival_time
            )}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {flight.arrival_airport ||
              ""}
          </p>
        </div>
      </div>
    </div>
  )
}


function ReviewHotels({
  hotels,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-400/10 p-3">
          🏨
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Hotels
          </h3>

          <p className="text-sm text-slate-400">
            Hotel search results
          </p>
        </div>
      </div>

      {!Array.isArray(hotels) ||
      hotels.length === 0 ? (
        <EmptyText>
          Hotel information is not available
          in the current travel data.
        </EmptyText>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {hotels.map(
            (hotel, index) => (
              <HotelItem
                key={`${hotel.title || "hotel"}-${index}`}
                hotel={hotel}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}


function HotelItem({
  hotel,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
      <p className="font-semibold text-white">
        {hotel.title ||
          "Hotel result"}
      </p>

      {hotel.content && (
        <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-500">
          {hotel.content}
        </p>
      )}

      {hotel.url && (
        <a
          href={hotel.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          View source →
        </a>
      )}
    </div>
  )
}


function ReviewWeather({
  weather,
}) {
  const unavailable =
    !weather ||
    typeof weather !== "object" ||
    Object.keys(weather).length === 0

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-400/10 p-3">
          🌤️
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Weather
          </h3>

          <p className="text-sm text-slate-400">
            Current weather information
          </p>
        </div>
      </div>

      {unavailable ? (
        <EmptyText>
          Weather information is not available
          in the current travel data.
        </EmptyText>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <WeatherItem
            label="City"
            value={
              weather.city ||
              "Unavailable"
            }
          />

          <WeatherItem
            label="Temperature"
            value={
              weather.temperature_c !==
              undefined
                ? `${weather.temperature_c}°C`
                : "Unavailable"
            }
          />

          <WeatherItem
            label="Feels like"
            value={
              weather.feels_like_c !==
              undefined
                ? `${weather.feels_like_c}°C`
                : "Unavailable"
            }
          />

          <WeatherItem
            label="Condition"
            value={
              weather.condition ||
              "Unavailable"
            }
          />

          <WeatherItem
            label="Humidity"
            value={
              weather.humidity !==
              undefined
                ? `${weather.humidity}%`
                : "Unavailable"
            }
          />
        </div>
      )}
    </div>
  )
}


function WeatherItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white">
        {value}
      </p>
    </div>
  )
}


function FinalTrip({
  finalResponse,
  tripData,
  onNewTrip,
}) {
  const constraints =
    tripData?.trip_constraints || {}

  const flights =
    tripData?.flights || []

  const hotels =
    tripData?.hotels || []

  const weather =
    tripData?.weather || {}

  const budget =
    tripData?.budget || {}

  const itinerary =
    tripData?.itinerary || []

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300">
            <span>✓</span>
            Trip Approved
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Your Trip Plan
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Your reviewed travel plan is ready.
          </p>
        </div>

        <button
          onClick={onNewTrip}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
        >
          + Plan Another Trip
        </button>
      </div>

      <TripOverview
        constraints={constraints}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <ItinerarySection
            itinerary={itinerary}
          />

          {finalResponse && (
            <ImportantNotesFromResponse
              response={finalResponse}
            />
          )}
        </div>

        <div className="space-y-6">
          <FlightCard
            flights={flights}
          />

          <HotelSection
            hotels={hotels}
          />

          <WeatherCard
            weather={weather}
          />

          <BudgetCard
            budget={budget}
          />
        </div>
      </div>
    </main>
  )
}


function TripOverview({
  constraints,
}) {
  const origin =
    constraints.origin ||
    "Not available"

  const destination =
    constraints.destination ||
    "Not available"

  const startDate =
    constraints.start_date

  const endDate =
    constraints.end_date

  const duration =
    constraints.duration_days

  const travelers =
    constraints.travelers

  const budget =
    constraints.budget

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-400/10 p-3">
          🧭
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Trip Summary
          </h3>

          <p className="text-sm text-slate-500">
            Your travel constraints
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem
          label="Origin"
          value={origin}
        />

        <SummaryItem
          label="Destination"
          value={destination}
        />

        <SummaryItem
          label="Dates"
          value={
            startDate && endDate
              ? `${formatDate(startDate)} – ${formatDate(endDate)}`
              : "Not available"
          }
        />

        <SummaryItem
          label="Duration"
          value={
            duration
              ? `${duration} days`
              : "Not available"
          }
        />

        <SummaryItem
          label="Travelers"
          value={
            travelers
              ? `${travelers} traveler${Number(travelers) === 1 ? "" : "s"}`
              : "Not available"
          }
        />

        <SummaryItem
          label="Budget"
          value={
            budget !==
            undefined &&
            budget !== null
              ? String(budget)
              : "Not available"
          }
        />
      </div>
    </div>
  )
}


function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  )
}


function FlightCard({
  flights,
}) {
  const unavailable =
    !Array.isArray(flights) ||
    flights.length === 0

  return (
    <SideCard
      icon="✈️"
      title="Flights"
      subtitle={
        unavailable
          ? "No flight data available"
          : "Available flight information"
      }
    >
      {unavailable ? (
        <EmptyText>
          Flight information is not available
          in the current travel data.
        </EmptyText>
      ) : (
        <div className="space-y-3">
          {flights.map(
            (flight, index) => (
              <FlightItem
                key={`${flight.flight_number || "flight"}-${index}`}
                flight={flight}
              />
            )
          )}
        </div>
      )}
    </SideCard>
  )
}


function FlightItem({
  flight,
}) {
  const status =
    flight.status || "unknown"

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-white">
            {flight.flight_number ||
              "Flight"}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {flight.airline ||
              "Airline unavailable"}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
            status.toLowerCase() ===
            "scheduled"
              ? "bg-emerald-400/10 text-emerald-300"
              : status.toLowerCase() ===
                  "active"
                ? "bg-blue-400/10 text-blue-300"
                : "bg-white/5 text-slate-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div>
          <p className="text-xl font-bold text-white">
            {flight.departure_iata ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatFlightTime(
              flight.departure_time
            )}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-slate-600">
            {flight.departure_airport ||
              ""}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg text-blue-400">
            →
          </span>

          <span className="mt-1 text-[10px] text-slate-600">
            flight
          </span>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-white">
            {flight.arrival_iata ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatFlightTime(
              flight.arrival_time
            )}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-slate-600">
            {flight.arrival_airport ||
              ""}
          </p>
        </div>
      </div>
    </div>
  )
}


function WeatherCard({
  weather,
}) {
  const unavailable =
    !weather ||
    typeof weather !== "object" ||
    Object.keys(weather).length === 0

  return (
    <SideCard
      icon="🌤️"
      title="Weather"
      subtitle={
        unavailable
          ? "No weather data available"
          : weather.city
            ? `Current conditions in ${weather.city}`
            : "Current weather"
      }
    >
      {unavailable ? (
        <EmptyText>
          Weather information is not available
          in the current travel data.
        </EmptyText>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <WeatherItem
            label="Temperature"
            value={
              weather.temperature_c !==
              undefined
                ? `${weather.temperature_c}°C`
                : "Unavailable"
            }
          />

          <WeatherItem
            label="Feels like"
            value={
              weather.feels_like_c !==
              undefined
                ? `${weather.feels_like_c}°C`
                : "Unavailable"
            }
          />

          <WeatherItem
            label="Condition"
            value={
              weather.condition ||
              "Unavailable"
            }
          />

          <WeatherItem
            label="Humidity"
            value={
              weather.humidity !==
              undefined
                ? `${weather.humidity}%`
                : "Unavailable"
            }
          />

          <WeatherItem
            label="Wind"
            value={
              weather.wind_kmph !==
              undefined
                ? `${weather.wind_kmph} km/h`
                : "Unavailable"
            }
          />
        </div>
      )}
    </SideCard>
  )
}


function BudgetCard({
  budget,
}) {
  const unavailable =
    !budget ||
    typeof budget !== "object" ||
    Object.keys(budget).length === 0

  if (unavailable) {
    return (
      <SideCard
        icon="💰"
        title="Budget"
        subtitle="No budget data available"
      >
        <EmptyText>
          Budget information is not available
          in the current travel data.
        </EmptyText>
      </SideCard>
    )
  }

  const currency =
    budget.currency || "USD"

  return (
    <SideCard
      icon="💰"
      title="Budget"
      subtitle="Estimated trip costs"
    >
      <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
        <p className="text-xs text-slate-500">
          Total estimated cost
        </p>

        <p className="mt-1 text-2xl font-bold text-white">
          {currency}{" "}
          {budget.total_estimated_cost ||
            0}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <MiniBudgetRow
          label="Flights"
          value={
            budget.flight_cost_estimate ||
            0
          }
          currency={currency}
        />

        <MiniBudgetRow
          label="Hotels"
          value={
            budget.hotel_cost_estimate ||
            0
          }
          currency={currency}
        />

        <MiniBudgetRow
          label="Food"
          value={
            budget.food_cost_estimate ||
            0
          }
          currency={currency}
        />

        <MiniBudgetRow
          label="Transport"
          value={
            budget.local_transport_estimate ||
            0
          }
          currency={currency}
        />

        <MiniBudgetRow
          label="Activities"
          value={
            budget.activities_cost_estimate ||
            0
          }
          currency={currency}
        />
      </div>

      {budget.explanation && (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          {budget.explanation}
        </p>
      )}
    </SideCard>
  )
}


function MiniBudgetRow({
  label,
  value,
  currency,
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-medium text-slate-300">
        {currency} {value}
      </span>
    </div>
  )
}


function HotelSection({
  hotels,
}) {
  if (
    !Array.isArray(hotels) ||
    hotels.length === 0
  ) {
    return (
      <SideCard
        icon="🏨"
        title="Hotels"
        subtitle="No hotel data available"
      >
        <EmptyText>
          Hotel information is not available
          in the current travel data.
        </EmptyText>
      </SideCard>
    )
  }

  return (
    <SideCard
      icon="🏨"
      title="Hotels"
      subtitle="Hotel search results"
    >
      <div className="space-y-3">
        {hotels.map(
          (hotel, index) => (
            <HotelItem
              key={`${hotel.title || "hotel"}-${index}`}
              hotel={hotel}
            />
          )
        )}
      </div>
    </SideCard>
  )
}


function ItinerarySection({
  itinerary,
}) {
  if (
    !Array.isArray(itinerary) ||
    itinerary.length === 0
  ) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-400/10 p-3">
            🗓️
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Day-wise Itinerary
            </h3>

            <p className="text-sm text-slate-500">
              Generated travel schedule
            </p>
          </div>
        </div>

        <EmptyText>
          Itinerary information is not available
          in the current travel data.
        </EmptyText>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-400/10 p-3">
          🗓️
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Day-wise Itinerary
          </h3>

          <p className="text-sm text-slate-500">
            Generated travel schedule
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.map(
          (day, index) => (
            <DayCard
              key={`${day.day || index}-${index}`}
              day={day}
            />
          )
        )}
      </div>
    </div>
  )
}


function DayCard({
  day,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-300">
          {day.day}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-white">
            {day.title ||
              `Day ${day.day}`}
          </h4>

          {Array.isArray(
            day.activities
          ) && (
            <ul className="mt-4 space-y-2">
              {day.activities.map(
                (
                  activity,
                  index
                ) => (
                  <li
                    key={`${index}-${activity}`}
                    className="flex gap-3 text-sm leading-6 text-slate-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />

                    <span>
                      {activity}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}

          {day.estimated_cost !==
            undefined && (
            <div className="mt-4 text-xs text-slate-600">
              Estimated activity cost:{" "}
              {day.estimated_cost}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function ImportantNotesFromResponse({
  response,
}) {
  const notes =
    extractImportantNotes(
      response
    )

  if (!notes) {
    return null
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-amber-400/10 p-3">
          📝
        </div>

        <div>
          <h3 className="font-semibold text-white">
            Important Notes
          </h3>

          <p className="text-sm text-slate-500">
            Additional travel information
          </p>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
        {notes}
      </div>
    </div>
  )
}


function SideCard({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-white/[0.05] p-3">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </div>
  )
}


function InfoBox({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-2xl">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  )
}


function EmptyText({
  children,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-sm leading-6 text-slate-500">
      {children}
    </div>
  )
}


function formatBudgetStatus(
  status
) {
  if (!status) {
    return "unknown"
  }

  return String(status).replace(
    /_/g,
    " "
  )
}


function formatDate(
  value
) {
  if (!value) {
    return "Not available"
  }

  const date =
    new Date(
      `${value}T00:00:00`
    )

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value)
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )
}


function formatFlightTime(
  value
) {
  if (!value) {
    return "Time unavailable"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value)
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  )
}


function extractImportantNotes(
  response
) {
  if (!response) {
    return ""
  }

  const marker =
    "7. Important Notes"

  const index =
    response.indexOf(marker)

  if (index === -1) {
    return ""
  }

  return response
    .slice(
      index + marker.length
    )
    .replace(
      /^[:\s]+/,
      ""
    )
    .trim()
}


export default App