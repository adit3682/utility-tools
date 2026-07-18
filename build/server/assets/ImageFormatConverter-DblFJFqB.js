import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { t as PreviewCard } from "./PreviewCard-DwH08fxB.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { encode } from "@jsquash/avif";
//#region app/tools/image-format-converter/useImageFormatConverter.js
var FORMATS = {
	png: {
		mime: "image/png",
		ext: "png",
		label: "PNG"
	},
	jpeg: {
		mime: "image/jpeg",
		ext: "jpg",
		label: "JPG"
	},
	webp: {
		mime: "image/webp",
		ext: "webp",
		label: "WebP"
	},
	avif: {
		mime: "image/avif",
		ext: "avif",
		label: "AVIF"
	}
};
function useImageFormatConverter() {
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [targetFormat, setTargetFormat] = useState("webp");
	const [quality, setQuality] = useState(.8);
	const [loading, setLoading] = useState(false);
	const [resultUrl, setResultUrl] = useState(null);
	const [resultSize, setResultSize] = useState(0);
	const handleFileUpload = (event) => {
		const imageFile = event.target.files[0];
		if (imageFile) {
			setFile(imageFile);
			setPreviewUrl(URL.createObjectURL(imageFile));
			setResultUrl(null);
		}
	};
	const loadImageToCanvas = (url) => new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			resolve(canvas);
		};
		img.onerror = reject;
		img.src = url;
	});
	const handleConvert = async () => {
		if (!file) return;
		setLoading(true);
		setResultUrl(null);
		try {
			const canvas = await loadImageToCanvas(previewUrl);
			const format = FORMATS[targetFormat];
			let blob;
			if (targetFormat === "avif") {
				const avifBuffer = await encode(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), { quality: Math.round(quality * 100) });
				blob = new Blob([avifBuffer], { type: "image/avif" });
			} else blob = await new Promise((resolve) => canvas.toBlob(resolve, format.mime, format.mime === "image/png" ? void 0 : quality));
			setResultUrl(URL.createObjectURL(blob));
			setResultSize(blob.size);
		} catch (error) {
			console.error("Gagal convert format gambar:", error);
			alert("Gagal mengonversi gambar. Coba format atau gambar lain.");
		} finally {
			setLoading(false);
		}
	};
	const handleDownload = () => {
		if (!resultUrl || !file) return;
		const format = FORMATS[targetFormat];
		const baseName = file.name.replace(/\.[^.]+$/, "");
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `${baseName}.${format.ext}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		file,
		previewUrl,
		targetFormat,
		setTargetFormat,
		quality,
		setQuality,
		loading,
		resultUrl,
		resultSize,
		handleFileUpload,
		handleConvert,
		handleDownload,
		FORMATS
	};
}
//#endregion
//#region app/tools/image-format-converter/ImageFormatConverter.jsx
function formatSize(bytes) {
	if (!bytes) return "0 KB";
	const kb = bytes / 1024;
	return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}
function ImageFormatConverter() {
	const { file, previewUrl, targetFormat, setTargetFormat, quality, setQuality, loading, resultUrl, resultSize, handleFileUpload, handleConvert, handleDownload, FORMATS } = useImageFormatConverter();
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Image Format Converter"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Convert gambar antar format PNG, JPG, WebP, dan AVIF — langsung di browser."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleFileUpload({ target: { files } }),
				accept: "image/*",
				label: "Pilih Gambar",
				hint: "Mendukung PNG, JPEG, WebP, AVIF sebagai input",
				fileName: file?.name
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-slate-600 dark:text-slate-300 mb-2",
						children: "Convert ke:"
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: Object.entries(FORMATS).map(([key, fmt]) => /* @__PURE__ */ jsx("button", {
							onClick: () => setTargetFormat(key),
							className: `py-3 rounded-xl border-2 font-bold text-sm transition ${targetFormat === key ? "border-teal-500 bg-teal-500/5 text-teal-600 dark:text-teal-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
							children: fmt.label
						}, key))
					})] }),
					targetFormat !== "png" && /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Kualitas:" }), /* @__PURE__ */ jsxs("span", {
								className: "text-teal-500 dark:text-teal-400 font-bold",
								children: [Math.round(quality * 100), "%"]
							})]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0.1",
							max: "1",
							step: "0.05",
							value: quality,
							onChange: (e) => setQuality(parseFloat(e.target.value)),
							className: "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ jsx(PreviewCard, {
							label: "Sebelum",
							children: /* @__PURE__ */ jsx("img", {
								src: previewUrl,
								alt: "Original",
								className: "max-h-64 mx-auto rounded-lg object-contain"
							})
						}), /* @__PURE__ */ jsxs(PreviewCard, {
							label: "Sesudah",
							empty: !resultUrl,
							emptyText: loading ? "Mengonversi..." : "Belum diproses",
							children: [/* @__PURE__ */ jsx("img", {
								src: resultUrl,
								alt: "Result",
								className: "max-h-64 mx-auto rounded-lg object-contain mb-2"
							}), resultSize > 0 && /* @__PURE__ */ jsxs("p", {
								className: "text-sm text-slate-600 dark:text-slate-300",
								children: ["Ukuran: ", /* @__PURE__ */ jsx("span", {
									className: "text-emerald-500 font-bold",
									children: formatSize(resultSize)
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row gap-4",
						children: [/* @__PURE__ */ jsx(Button, {
							icon: RefreshCw,
							onClick: handleConvert,
							loading,
							fullWidth: true,
							children: loading ? "Sedang mengonversi..." : `Convert ke ${FORMATS[targetFormat].label}`
						}), resultUrl && /* @__PURE__ */ jsxs(Button, {
							variant: "success",
							icon: Download,
							onClick: handleDownload,
							fullWidth: true,
							children: ["Unduh ", FORMATS[targetFormat].label]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ImageFormatConverter as default };
