export function Features() {
  const items = [
    {
      title: "Semantic Understanding",
      desc: "MTM-8 reads Excel like a human — regions, headers, measures, dimensions, filters, comparisons and intents."
    },
    {
      title: "Multi-Intent Pipeline",
      desc: "Ask for tables + KPIs + charts in one prompt. MTM-8 builds a unified calculation graph."
    },
    {
      title: "Self-Refining Engine",
      desc: "Use 'Refine' to nudge logic without losing context. Smart pivoting and plan updates."
    },
    {
      title: "Zero-Ambiguity IR",
      desc: "Every request compiles into a stable, deterministic intermediate representation. Patent-grade architecture."
    }
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold text-slate-900">
        Why MTM-8 changes everything
      </h2>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
