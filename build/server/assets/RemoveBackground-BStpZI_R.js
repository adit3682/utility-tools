import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { t as PreviewCard } from "./PreviewCard-DwH08fxB.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Download, Wand2 } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
//#region app/tools/remove-background/useRemoveBackground.js
function useRemoveBackground() {
	const [originalImage, setOriginalImage] = useState(null);
	const [originalUrl, setOriginalUrl] = useState(null);
	const [resultUrl, setResultUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [progressLabel, setProgressLabel] = useState("");
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setOriginalImage(file);
			setOriginalUrl(URL.createObjectURL(file));
			setResultUrl(null);
		}
	};
	const handleRemoveBackground = async () => {
		if (!originalImage) return;
		setLoading(true);
		setProgressLabel("Mengunduh model AI (hanya sekali)...");
		try {
			const blob = await removeBackground(originalImage, { progress: (key, current, total) => {
				if (key.startsWith("fetch")) setProgressLabel(`Mengunduh model... ${Math.round(current / total * 100)}%`);
				else setProgressLabel("Memproses gambar...");
			} });
			setResultUrl(URL.createObjectURL(blob));
		} catch (error) {
			console.error("Gagal menghapus background:", error);
			alert("Gagal memproses gambar. Coba gambar lain atau refresh halaman.");
		} finally {
			setLoading(false);
			setProgressLabel("");
		}
	};
	const handleDownload = () => {
		if (!resultUrl) return;
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `no-bg_${originalImage.name.replace(/\.[^.]+$/, "")}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		originalImage,
		originalUrl,
		resultUrl,
		loading,
		progressLabel,
		handleImageUpload,
		handleRemoveBackground,
		handleDownload
	};
}
//#endregion
//#region app/tools/remove-background/RemoveBackground.jsx
var checkerboardStyle = {
	backgroundImage: "linear-gradient(45deg, #94a3b8 25%, transparent 25%), linear-gradient(-45deg, #94a3b8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #94a3b8 75%), linear-gradient(-45deg, transparent 75%, #94a3b8 75%)",
	backgroundSize: "16px 16px",
	backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
};
function RemoveBackground() {
	const { originalImage, originalUrl, resultUrl, loading, progressLabel, handleImageUpload, handleRemoveBackground, handleDownload } = useRemoveBackground();
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Remove Background"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Hapus background gambar otomatis pakai AI, langsung di browser."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleImageUpload({ target: { files } }),
				accept: "image/*",
				label: "Pilih Gambar",
				hint: "Proses pertama butuh waktu lebih lama (download model)",
				fileName: originalImage?.name
			}),
			originalImage && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsx(PreviewCard, {
						label: "Sebelum",
						children: /* @__PURE__ */ jsx("img", {
							src: originalUrl,
							alt: "Original",
							className: "max-h-64 mx-auto rounded-lg object-contain"
						})
					}), /* @__PURE__ */ jsx(PreviewCard, {
						label: "Sesudah",
						empty: !resultUrl,
						emptyText: loading ? progressLabel || "Memproses..." : "Belum diproses",
						children: /* @__PURE__ */ jsx("div", {
							className: "rounded-lg overflow-hidden mx-auto inline-block",
							style: checkerboardStyle,
							children: /* @__PURE__ */ jsx("img", {
								src: resultUrl,
								alt: "Result",
								className: "max-h-64 mx-auto object-contain"
							})
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row gap-4",
					children: [/* @__PURE__ */ jsx(Button, {
						icon: Wand2,
						onClick: handleRemoveBackground,
						loading,
						fullWidth: true,
						children: loading ? progressLabel || "Memproses..." : "Hapus Background"
					}), resultUrl && /* @__PURE__ */ jsx(Button, {
						variant: "success",
						icon: Download,
						onClick: handleDownload,
						fullWidth: true,
						children: "Unduh PNG (Transparan)"
					})]
				})]
			})
		]
	});
}
//#endregion
export { RemoveBackground as default };
