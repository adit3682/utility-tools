import { t as getPdfjsLib } from "./pdfWorker-CrvP7C10.js";
import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Download, FolderDown } from "lucide-react";
import JSZip from "jszip";
//#region app/tools/pdf-to-image/usePdfToImage.js
function usePdfToImage() {
	const [file, setFile] = useState(null);
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [scale, setScale] = useState(2);
	const handleFileUpload = (event) => {
		const pdfFile = event.target.files[0];
		if (pdfFile) {
			setFile(pdfFile);
			setPages([]);
		}
	};
	const handleConvert = async () => {
		if (!file) return;
		setLoading(true);
		setPages([]);
		try {
			const pdfjsLib = await getPdfjsLib();
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const viewport = page.getViewport({ scale });
				const canvas = document.createElement("canvas");
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				const context = canvas.getContext("2d");
				await page.render({
					canvasContext: context,
					viewport
				}).promise;
				results.push({
					pageNum: i,
					dataUrl: canvas.toDataURL("image/png")
				});
			}
			setPages(results);
		} catch (error) {
			console.error("Gagal convert PDF:", error);
			alert("Gagal membaca PDF, pastikan file tidak rusak atau terkunci password.");
		} finally {
			setLoading(false);
		}
	};
	const downloadSingle = (page) => {
		const link = document.createElement("a");
		link.href = page.dataUrl;
		link.download = `page-${page.pageNum}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const downloadAllAsZip = async () => {
		const zip = new JSZip();
		for (const page of pages) {
			const base64 = page.dataUrl.split(",")[1];
			zip.file(`page-${page.pageNum}.png`, base64, { base64: true });
		}
		const blob = await zip.generateAsync({ type: "blob" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${file.name.replace(".pdf", "")}-images.zip`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		file,
		pages,
		loading,
		scale,
		setScale,
		handleFileUpload,
		handleConvert,
		downloadSingle,
		downloadAllAsZip
	};
}
//#endregion
//#region app/tools/pdf-to-image/PdfToImage.jsx
function PdfToImage() {
	const { file, pages, loading, scale, setScale, handleFileUpload, handleConvert, downloadSingle, downloadAllAsZip } = usePdfToImage();
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "PDF to Image"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Ubah setiap halaman PDF jadi gambar PNG, langsung di browser."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleFileUpload({ target: { files } }),
				accept: "application/pdf",
				label: "Pilih File PDF",
				hint: "Maks. kualitas terbaik, semua halaman",
				fileName: file?.name
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Kualitas Gambar:" }), /* @__PURE__ */ jsx("span", {
								className: "text-teal-500 dark:text-teal-400 font-bold",
								children: scale === 1 ? "Standar" : scale === 2 ? "Tinggi" : "Sangat Tinggi"
							})]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: "1",
							max: "3",
							step: "1",
							value: scale,
							onChange: (e) => setScale(Number(e.target.value)),
							className: "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						onClick: handleConvert,
						loading,
						fullWidth: true,
						children: loading ? "Sedang memproses halaman..." : " Convert ke Gambar"
					}),
					pages.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-medium text-slate-600 dark:text-slate-300",
							children: [pages.length, " halaman berhasil dikonversi"]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: downloadAllAsZip,
							className: "flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline",
							children: [/* @__PURE__ */ jsx(FolderDown, { size: 16 }), "Unduh Semua (.zip)"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
						children: pages.map((page) => /* @__PURE__ */ jsxs("div", {
							className: "group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden",
							children: [/* @__PURE__ */ jsx("img", {
								src: page.dataUrl,
								alt: `Page ${page.pageNum}`,
								className: "w-full h-auto"
							}), /* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-white text-xs font-bold",
									children: ["Hal. ", page.pageNum]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => downloadSingle(page),
									className: "bg-teal-500 hover:bg-teal-400 text-white p-1.5 rounded-full",
									children: /* @__PURE__ */ jsx(Download, { size: 14 })
								})]
							})]
						}, page.pageNum))
					})] })
				]
			})
		]
	});
}
//#endregion
export { PdfToImage as default };
