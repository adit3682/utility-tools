import { jsx, jsxs } from "react/jsx-runtime";
//#region app/components/ui/ProgressBar.jsx
function ProgressBar({ progress = 0, label }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full",
		children: [label && /* @__PURE__ */ jsxs("div", {
			className: "flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1",
			children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsxs("span", { children: [progress, "%"] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden",
			children: /* @__PURE__ */ jsx("div", {
				className: "h-full bg-teal-500 transition-all duration-200",
				style: { width: `${progress}%` }
			})
		})]
	});
}
//#endregion
export { ProgressBar as t };
