import { NavLink } from 'react-router';
import { LayoutGrid, X, Sun, Moon } from 'lucide-react';
import { tools } from '../../config/tools.config';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {/* Backdrop — cuma muncul di mobile saat sidebar terbuka */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            <aside
                className={`
    fixed lg:sticky top-0 left-0 h-screen w-64 z-50
    bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
    flex flex-col shrink-0
    transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0
  `}
            >
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Utility<span className="text-teal-500">Tools</span>
                    </h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <LayoutGrid size={18} />
                        Dashboard
                    </NavLink>

                    <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                        Tools
                    </p>

                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <NavLink
                                key={tool.id}
                                to={tool.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {tool.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </aside>
        </>
    );
}