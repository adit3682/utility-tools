import { Link } from "react-router";

export default function ToolCard({ tool }) {
    const Icon = tool.icon;
    return (
        <Link
            to={tool.path}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200"
        >
            <div className="w-11 h-11 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition">
                <Icon size={22} className="text-teal-400" />
            </div>
            <h3 className="font-bold text-white mb-1">{tool.name}</h3>
            <p className="text-sm text-slate-400">{tool.description}</p>
        </Link>
    );
}