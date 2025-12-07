export function Spinner({ size = 14 }: { size?: number }) {
  const px = `${size}px`;
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
      style={{ width: px, height: px }}
    />
  );
}
