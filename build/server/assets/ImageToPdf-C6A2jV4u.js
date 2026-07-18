import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FileDown, X } from "lucide-react";
import { jsPDF } from "jspdf";
//#region app/tools/image-to-pdf/useImageToPdf.js
function useImageToPdf() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pdfUrl, setPdfUrl] = useState(null);
	const handleFilesUpload = (event) => {
		const files = Array.from(event.target.files);
		const generateId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const newImages = files.map((file) => ({
			id: generateId(),
			file,
			previewUrl: URL.createObjectURL(file)
		}));
		setImages((prev) => [...prev, ...newImages]);
		setPdfUrl(null);
	};
	const removeImage = (id) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
		setPdfUrl(null);
	};
	const moveImage = (fromIndex, toIndex) => {
		setImages((prev) => {
			const updated = [...prev];
			const [moved] = updated.splice(fromIndex, 1);
			updated.splice(toIndex, 0, moved);
			return updated;
		});
	};
	const loadImageDimensions = (url) => new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve({
			width: img.width,
			height: img.height
		});
		img.src = url;
	});
	const handleConvert = async () => {
		if (images.length === 0) return;
		setLoading(true);
		try {
			const pdf = new jsPDF({ unit: "px" });
			pdf.deletePage(1);
			for (const img of images) {
				const { width, height } = await loadImageDimensions(img.previewUrl);
				const orientation = width > height ? "landscape" : "portrait";
				pdf.addPage([width, height], orientation);
				pdf.addImage(img.previewUrl, "JPEG", 0, 0, width, height);
			}
			const blob = pdf.output("blob");
			setPdfUrl(URL.createObjectURL(blob));
		} catch (error) {
			console.error("Gagal convert ke PDF:", error);
			alert("Gagal membuat PDF, coba lagi ya!");
		} finally {
			setLoading(false);
		}
	};
	const handleDownload = () => {
		if (!pdfUrl) return;
		const link = document.createElement("a");
		link.href = pdfUrl;
		link.download = "converted.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		images,
		loading,
		pdfUrl,
		handleFilesUpload,
		removeImage,
		moveImage,
		handleConvert,
		handleDownload
	};
}
//#endregion
//#region app/tools/image-to-pdf/ImageToPdf.jsx
function ImageToPdf() {
	const { images, loading, pdfUrl, handleFilesUpload, removeImage, handleConvert, handleDownload } = useImageToPdf();
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Image to PDF"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Gabungkan beberapa gambar jadi satu file PDF, langsung di browser."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleFilesUpload({ target: { files } }),
				accept: "image/*",
				multiple: true,
				label: "Pilih Gambar (bisa lebih dari satu)",
				hint: "PNG, JPEG, WebP"
			}),
			images.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm font-medium text-slate-600 dark:text-slate-300 mb-3",
						children: [images.length, " gambar dipilih — urutan ini akan jadi urutan halaman PDF"]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: images.map((img) => /* @__PURE__ */ jsxs("div", {
							className: "relative group",
							children: [/* @__PURE__ */ jsx("img", {
								src: img.previewUrl,
								alt: "",
								className: "w-full h-28 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => removeImage(img.id),
								className: "absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition",
								children: /* @__PURE__ */ jsx(X, { size: 14 })
							})]
						}, img.id))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row gap-4 mt-6",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: handleConvert,
							loading,
							fullWidth: true,
							children: loading ? "Sedang membuat PDF..." : " Convert ke PDF"
						}), pdfUrl && /* @__PURE__ */ jsx(Button, {
							variant: "success",
							icon: FileDown,
							onClick: handleDownload,
							fullWidth: true,
							children: "Unduh PDF"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ImageToPdf as default };
