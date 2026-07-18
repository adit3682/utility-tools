import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
//#region app/components/ui/Dropzone.jsx
function Dropzone({ onFilesSelected, accept = "image/*", multiple = false, label = "Pilih File", hint, fileName }) {
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef(null);
	const handleFiles = (fileList) => {
		const files = Array.from(fileList);
		if (files.length > 0) onFilesSelected(files);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		handleFiles(e.dataTransfer.files);
	};
	return /* @__PURE__ */ jsxs("div", {
		onDragOver: (e) => {
			e.preventDefault();
			setIsDragging(true);
		},
		onDragLeave: () => setIsDragging(false),
		onDrop: handleDrop,
		onClick: () => inputRef.current?.click(),
		className: `
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
        ${isDragging ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10" : "border-slate-300 dark:border-slate-700 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800/30"}
      `,
		children: [/* @__PURE__ */ jsx("input", {
			ref: inputRef,
			type: "file",
			accept,
			multiple,
			onChange: (e) => handleFiles(e.target.files),
			className: "hidden"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-2 pointer-events-none",
			children: [
				/* @__PURE__ */ jsx(Upload, {
					size: 32,
					className: "text-teal-500"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "font-semibold text-slate-700 dark:text-slate-200",
					children: fileName || label
				}),
				hint && /* @__PURE__ */ jsx("span", {
					className: "text-xs text-slate-400",
					children: hint
				})
			]
		})]
	});
}
//#endregion
//#region app/components/ui/Button.jsx
var variants = {
	primary: "bg-teal-500 hover:bg-teal-400 text-white",
	success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white",
	outline: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
	danger: "bg-rose-500 hover:bg-rose-400 text-white"
};
function Button({ children, variant = "primary", icon: Icon, loading = false, disabled = false, fullWidth = false, onClick, type = "button", className = "" }) {
	return /* @__PURE__ */ jsxs("button", {
		type,
		onClick,
		disabled: disabled || loading,
		className: `
        py-3 px-6 rounded-xl font-bold transition
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `,
		children: [Icon && !loading && /* @__PURE__ */ jsx(Icon, { size: 18 }), children]
	});
}
//#endregion
export { Dropzone as n, Button as t };
