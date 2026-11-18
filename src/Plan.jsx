const isEmpty = (o) => !o || (Array.isArray(o) ? o.length === 0 : Object.keys(o).length === 0);
const money = (n) => `Rs ${Number(n).toLocaleString()}`;
const label = (k) => {
  const s = k.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const fmt = (v) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return v.toLocaleString();
  if (Array.isArray(v)) return v.every((x) => typeof x !== "object") ? v.join(", ") : JSON.stringify(v);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

function Card({ title, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-3 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

const Empty = () => <p className="text-slate-400">Nothing planned yet.</p>;

function KeyValues({ data }) {
  if (isEmpty(data)) return <Empty />;
  return (
    <dl className="divide-y divide-slate-100">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-1.5">
          <dt className="text-slate-500">{label(k)}</dt>
          <dd className="text-right font-medium">{fmt(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Plan({ plan }) {
  if (isEmpty(plan)) return <p className="py-20 text-center text-lg text-slate-500">No plan yet. Run the agent.</p>;
  const { venue, schedule, food, judging, budget } = plan;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Venue"><KeyValues data={venue} /></Card>

      <Card title="Food"><KeyValues data={food} /></Card>

      <Card title="Schedule" className="md:row-span-2">
        {isEmpty(schedule) ? <Empty /> : (
          <ol className="relative ml-2 border-l-2 border-blue-200">
            {schedule.map((s, i) => (
              <li key={i} className="mb-4 ml-5">
                <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-blue-600" />
                <div className="text-sm font-semibold text-blue-700">{s.start} - {s.end}</div>
                <div className="font-medium">{s.title}</div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card title="Judging"><KeyValues data={judging} /></Card>

      <Card title="Budget" className="md:col-span-2">
        {isEmpty(budget) ? <Empty /> : (
          <>
            <table className="w-full">
              <tbody className="divide-y divide-slate-100">
                {(budget.lines ?? []).map((l, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-slate-600">{l.item}</td>
                    <td className="py-1.5 text-right font-medium">{money(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg p-3 text-lg font-bold ${
              budget.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              <span>Total {money(budget.total)} / Limit {money(budget.limit)}</span>
              <span>
                {budget.ok ? "WITHIN BUDGET" : "OVER BUDGET"}
                {" "}({money(Math.abs(budget.limit - budget.total))} {budget.limit >= budget.total ? "left" : "over"})
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}