import { jsx, jsxs } from "react/jsx-runtime";
//#region app/components/ui/PreviewCard.jsx
function PreviewCard({ label, children, empty, emptyText = "Belum diproses" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
			children: label
		}), empty ? /* @__PURE__ */ jsx("div", {
			className: "h-64 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-600 text-sm",
			children: emptyText
		}) : children]
	});
}
//#endregion
export { PreviewCard as t };
