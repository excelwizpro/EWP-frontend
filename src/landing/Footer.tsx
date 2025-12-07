export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-6 flex justify-between text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} ExcelWizPro — MTM-8 Engine</p>
        <p>Built for the next generation of spreadsheet intelligence.</p>
      </div>
    </footer>
  );
}
