import { useState } from "react";

const AREA_COLORS = {
  reading: "bg-purple-100 text-purple-800",
  venue: "bg-blue-100 text-blue-800",
  schedule: "bg-indigo-100 text-indigo-800",
  food: "bg-orange-100 text-orange-800",
  judging: "bg-teal-100 text-teal-800",
  budget: "bg-emerald-100 text-emerald-800",
};

export function Checks({ checks }) {
  if (!checks || checks.length === 0) return <p className="py-20 text-center text-lg text-slate-500">No checks yet.</p>;
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {checks.map((c, i) => (
        <li key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-lg font-medium">{c.name}</span>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${c.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {c.ok ? "PASS" : "FAIL"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Rejected({ rejected = [], ignored = [] }) {
  if (rejected.length === 0 && ignored.length === 0)
    return <p className="py-20 text-center text-lg text-slate-500">No rejected or ignored messages.</p>;
  return (
    <div className="space-y-3">
      {rejected.map((r, i) => (
        <div key={`r${i}`} className="rounded-xl border border-red-300 bg-red-50 p-4">
          <div className="mb-1 text-sm font-bold text-red-700">REJECTED - Message #{r.messageId}</div>
          <p className="font-medium text-slate-900">"{r.text}"</p>
          <p className="mt-2 text-red-800"><b>Reason:</b> {r.reason}</p>
        </div>
      ))}
      {ignored.map((r, i) => (
        <div key={`i${i}`} className="rounded-xl border border-red-200 bg-white p-4">
          <div className="mb-1 text-sm font-bold text-red-600">IGNORED - Message #{r.messageId}</div>
          <p className="text-slate-700"><b>Reason:</b> {r.reason}</p>
        </div>
      ))}
    </div>
  );
}

export function Trace({ trace, totalTokens }) {
  const [open, setOpen] = useState(null);
  if (!trace || trace.length === 0) return <p className="py-20 text-center text-lg text-slate-500">No model calls yet.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-100 text-sm text-slate-600">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Area</th>
            <th className="px-4 py-2 text-right">Tokens in</th>
            <th className="px-4 py-2 text-right">Tokens out</th>
          </tr>
        </thead>
        <tbody>
          {trace.map((t) => (
            <FragmentRow key={t.n} t={t} isOpen={open === t.n} onToggle={() => setOpen(open === t.n ? null : t.n)} />
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-900 text-white">
            <td colSpan={3} className="px-4 py-3 font-bold">Total tokens</td>
            <td colSpan={2} className="px-4 py-3 text-right text-lg font-bold">{Number(totalTokens ?? 0).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function FragmentRow({ t, isOpen, onToggle }) {
  return (
    <>
      <tr onClick={onToggle} className="cursor-pointer border-t border-slate-100 hover:bg-blue-50">
        <td className="px-4 py-2 font-semibold">{isOpen ? "▾" : "▸"} {t.n}</td>
        <td className="px-4 py-2">{t.model}</td>
        <td className="px-4 py-2">
          <span className={`rounded px-2 py-0.5 text-sm font-semibold ${AREA_COLORS[t.area] ?? "bg-slate-100 text-slate-700"}`}>{t.area}</span>
        </td>
        <td className="px-4 py-2 text-right">{Number(t.tokensIn ?? 0).toLocaleString()}</td>
        <td className="px-4 py-2 text-right">{Number(t.tokensOut ?? 0).toLocaleString()}</td>
      </tr>
      {isOpen && (
        <tr className="bg-slate-50">
          <td colSpan={5} className="grid gap-4 px-4 py-3 md:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-bold text-slate-600">INPUT</div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded border bg-white p-3 text-sm">{t.input}</pre>
            </div>
            <div>
              <div className="mb-1 text-sm font-bold text-slate-600">OUTPUT</div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded border bg-white p-3 text-sm">{t.output}</pre>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}