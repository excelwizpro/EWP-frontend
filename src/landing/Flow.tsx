export function Flow() {
  const steps = [
    "Upload workbook — MTM-8 detects regions + schemas",
    "Describe what you want — table, pivot, chart, KPI",
    "Engine builds semantic graph + IR plan",
    "Outputs formulas, report plans, and structure"
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900">How it works</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-dark font-bold">
                {i + 1}
              </div>
              <p className="mt-4 text-sm text-slate-700">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
