import { t as getPdfjsLib } from "./pdfWorker-CrvP7C10.js";
import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
//#region app/tools/compress-pdf/useCompressPdf.js
function useCompressPdf() {
	const [file, setFile] = useState(null);
	const [originalSize, setOriginalSize] = useState(0);
	const [mode, setMode] = useState("light");
	const [quality, setQuality] = useState(.7);
	const [loading, setLoading] = useState(false);
	const [resultUrl, setResultUrl] = useState(null);
	const [resultSize, setResultSize] = useState(0);
	const handleFileUpload = (event) => {
		const pdfFile = event.target.files[0];
		if (pdfFile) {
			setFile(pdfFile);
			setOriginalSize(pdfFile.size);
			setResultUrl(null);
			setResultSize(0);
		}
	};
	const compressLight = async (arrayBuffer) => {
		const bytes = await (await PDFDocument.load(arrayBuffer)).save({ useObjectStreams: true });
		return new Blob([bytes], { type: "application/pdf" });
	};
	const compressRasterize = async (arrayBuffer) => {
		(await getPdfjsLib()).getDocument({ data: arrayBuffer });
		const newPdf = await PDFDocument.create();
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const viewport = page.getViewport({ scale: 1.5 });
			const canvas = document.createElement("canvas");
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			const context = canvas.getContext("2d");
			await page.render({
				canvasContext: context,
				viewport
			}).promise;
			const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
			const jpegBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
			const jpegImage = await newPdf.embedJpg(jpegBytes);
			newPdf.addPage([viewport.width, viewport.height]).drawImage(jpegImage, {
				x: 0,
				y: 0,
				width: viewport.width,
				height: viewport.height
			});
		}
		const bytes = await newPdf.save();
		return new Blob([bytes], { type: "application/pdf" });
	};
	const handleCompress = async () => {
		if (!file) return;
		setLoading(true);
		setResultUrl(null);
		try {
			const arrayBuffer = await file.arrayBuffer();
			const blob = mode === "light" ? await compressLight(arrayBuffer) : await compressRasterize(arrayBuffer);
			setResultUrl(URL.createObjectURL(blob));
			setResultSize(blob.size);
		} catch (error) {
			console.error("Gagal kompres PDF:", error);
			alert("Gagal mengompres PDF, pastikan file tidak rusak atau terkunci password.");
		} finally {
			setLoading(false);
		}
	};
	const handleDownload = () => {
		if (!resultUrl) return;
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `compressed_${file.name}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		file,
		originalSize,
		mode,
		setMode,
		quality,
		setQuality,
		loading,
		resultUrl,
		resultSize,
		handleFileUpload,
		handleCompress,
		handleDownload
	};
}
//#endregion
//#region app/tools/compress-pdf/CompressPdf.jsx
function formatSize(bytes) {
	if (bytes === 0) return "0 KB";
	const kb = bytes / 1024;
	return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}
function CompressPdf() {
	const { file, originalSize, mode, setMode, quality, setQuality, loading, resultUrl, resultSize, handleFileUpload, handleCompress, handleDownload } = useCompressPdf();
	const savedPercent = resultSize > 0 ? Math.round((originalSize - resultSize) / originalSize * 100) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Compress PDF"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Perkecil ukuran file PDF langsung di browser, tanpa upload."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleFileUpload({ target: { files } }),
				accept: "application/pdf",
				label: "Pilih File PDF",
				hint: file ? `Ukuran asli: ${formatSize(originalSize)}` : void 0,
				fileName: file?.name
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setMode("light"),
							className: `text-left p-4 rounded-xl border-2 transition ${mode === "light" ? "border-teal-500 bg-teal-500/5" : "border-slate-200 dark:border-slate-700"}`,
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-bold text-slate-900 dark:text-white mb-1",
								children: "Mode Ringan"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: "Teks tetap bisa di-select/copy. Pengurangan kecil-sedang."
							})]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => setMode("rasterize"),
							className: `text-left p-4 rounded-xl border-2 transition ${mode === "rasterize" ? "border-teal-500 bg-teal-500/5" : "border-slate-200 dark:border-slate-700"}`,
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-bold text-slate-900 dark:text-white mb-1",
								children: "Mode Maksimal"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: "Ukuran berkurang signifikan, teks jadi gambar."
							})]
						})]
					}),
					mode === "rasterize" && /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Kualitas Gambar:" }), /* @__PURE__ */ jsxs("span", {
								className: "text-teal-500 dark:text-teal-400 font-bold",
								children: [Math.round(quality * 100), "%"]
							})]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0.3",
							max: "0.9",
							step: "0.1",
							value: quality,
							onChange: (e) => setQuality(parseFloat(e.target.value)),
							className: "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						onClick: handleCompress,
						loading,
						fullWidth: true,
						children: loading ? "Sedang mengompres..." : " Kompres PDF"
					}),
					resultUrl && /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm text-slate-600 dark:text-slate-300",
							children: ["Ukuran baru: ", /* @__PURE__ */ jsx("span", {
								className: "font-bold text-emerald-500",
								children: formatSize(resultSize)
							})]
						}), savedPercent > 0 && /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-emerald-500 font-bold",
							children: [
								"Hemat ",
								savedPercent,
								"%"
							]
						})] }), /* @__PURE__ */ jsx(Button, {
							variant: "success",
							icon: Download,
							onClick: handleDownload,
							children: "Unduh"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { CompressPdf as default };
