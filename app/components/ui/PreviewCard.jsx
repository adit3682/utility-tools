export default function PreviewCard({ label, children, empty, emptyText = 'Belum diproses' }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      {empty ? (
        <div className="h-64 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-600 text-sm">
          {emptyText}
        </div>
      ) : (
        children
      )}
    </div>
  );
}