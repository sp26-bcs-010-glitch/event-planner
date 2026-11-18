import { useEffect, useRef, useState } from "react";
import { MOCK_STATE } from "./mock";
import Plan from "./Plan";
import { Checks, Rejected, Trace } from "./Panels";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_URL = import.meta.env.VITE_API_URL || "/api/state";
const REFRESH_MS = 3000;

async function loadState(signal) {
  if (USE_MOCK) return MOCK_STATE;
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(null);
  const [tab, setTab] = useState("plan");
  const busy = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    async function tick() {
      if (busy.current) return;
      busy.current = true;
      try {
        const json = await loadState(controller.signal);
        setData(json);
        setError(null);
        setUpdated(new Date());
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Could not reach backend");
      } finally {
        busy.current = false;
        setLoading(false);
      }
    }
    tick();
    const id = setInterval(tick, REFRESH_MS);
    return () => {
      clearInterval(id);
      controller.abort();
    };
  }, []);

  const checks = data?.checks ?? [];
  const passed = checks.filter((c) => c.ok).length;
  const rejectedCount = (data?.rejected?.length ?? 0) + (data?.ignored?.length ?? 0);

  const tabs = [
    { id: "plan", label: "Plan" },
    { id: "checks", label: "Checks", badge: checks.length ? `${passed}/${checks.length}` : null, bad: passed < checks.length },
    { id: "rejected", label: "Rejected & Ignored", badge: rejectedCount || null, bad: rejectedCount > 0 },
    { id: "trace", label: "Trace", badge: data?.trace?.length || null },
  ];

  return (
    <div className="min-h-screen text-slate-800">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Event Planner Agent</h1>
          <div className="text-right text-sm text-slate-300">
            {USE_MOCK && <span className="mr-3 rounded bg-amber-400 px-2 py-0.5 font-semibold text-slate-900">MOCK DATA</span>}
            {updated ? `Updated ${updated.toLocaleTimeString()}` : "Not updated yet"}
          </div>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-4 px-4 py-3 text-base font-medium ${
                tab === t.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
              {t.badge != null && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${t.bad ? "bg-red-500" : "bg-slate-500"}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-800">
            <b>Backend error:</b> {error}. {data ? "Showing last data received. Retrying every 3 seconds." : "Retrying every 3 seconds."}
          </div>
        )}

        {loading && !data ? (
          <p className="py-20 text-center text-lg text-slate-500">Loading...</p>
        ) : !data ? (
          <p className="py-20 text-center text-lg text-slate-500">
            No data yet. Start the backend on port 3000 and run the agent.
          </p>
        ) : (
          <>
            {tab === "plan" && <Plan plan={data.plan} />}
            {tab === "checks" && <Checks checks={data.checks} />}
            {tab === "rejected" && <Rejected rejected={data.rejected} ignored={data.ignored} />}
            {tab === "trace" && <Trace trace={data.trace} totalTokens={data.totalTokens} />}
          </>
        )}
      </main>
    </div>
  );
}