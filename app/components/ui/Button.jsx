const variants = {
  primary: 'bg-teal-500 hover:bg-teal-400 text-white',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white',
  outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-rose-500 hover:bg-rose-400 text-white',
};

export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        py-3 px-6 rounded-xl font-bold transition
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && !loading && <Icon size={18} />}
      {children}
    </button>
  );
}