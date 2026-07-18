export default function ProgressBar({ progress = 0, label }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}