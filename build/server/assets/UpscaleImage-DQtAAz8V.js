import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { t as ProgressBar } from "./ProgressBar-oNVYEkF0.js";
import { t as PreviewCard } from "./PreviewCard-DwH08fxB.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Download, Sparkles } from "lucide-react";
//#region app/tools/upscale-image/useUpscaleImage.js
function useUpscaleImage() {
	const upscalerRef = useRef(null);
	const [originalImage, setOriginalImage] = useState(null);
	const [originalUrl, setOriginalUrl] = useState(null);
	const [resultUrl, setResultUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setOriginalImage(file);
			setOriginalUrl(URL.createObjectURL(file));
			setResultUrl(null);
		}
	};
	const handleUpscale = async () => {
		if (!originalUrl) return;
		setLoading(true);
		setProgress(0);
		try {
			if (!upscalerRef.current) {
				const { default: Upscaler } = await import("upscaler");
				upscalerRef.current = new Upscaler();
			}
			const result = await upscalerRef.current.upscale(originalUrl, {
				output: "base64",
				patchSize: 64,
				padding: 2,
				progress: (p) => setProgress(Math.round(p * 100))
			});
			setResultUrl(result);
		} catch (error) {
			console.error("Gagal upscale gambar:", error);
			alert("Gagal memproses gambar. Coba gambar dengan ukuran lebih kecil.");
		} finally {
			setLoading(false);
		}
	};
	const handleDownload = () => {
		if (!resultUrl) return;
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `upscaled_${originalImage.name}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		originalImage,
		originalUrl,
		resultUrl,
		loading,
		progress,
		handleImageUpload,
		handleUpscale,
		handleDownload
	};
}
//#endregion
//#region app/tools/upscale-image/UpscaleImage.jsx
function UpscaleImage() {
	const { originalImage, originalUrl, resultUrl, loading, progress, handleImageUpload, handleUpscale, handleDownload } = useUpscaleImage();
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Upscale Image"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Perbesar resolusi & pertajam detail gambar (4x) pakai AI, langsung di browser."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleImageUpload({ target: { files } }),
				accept: "image/*",
				label: "Pilih Gambar",
				hint: "Disarankan gambar berukuran sedang — file besar butuh waktu lebih lama",
				fileName: originalImage?.name
			}),
			originalImage && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ jsx(PreviewCard, {
							label: "Sebelum",
							children: /* @__PURE__ */ jsx("img", {
								src: originalUrl,
								alt: "Original",
								className: "max-h-64 mx-auto rounded-lg object-contain"
							})
						}), /* @__PURE__ */ jsx(PreviewCard, {
							label: "Sesudah (4x)",
							empty: !resultUrl,
							emptyText: loading ? "Memproses..." : "Belum diproses",
							children: loading ? /* @__PURE__ */ jsx("div", {
								className: "h-64 flex flex-col items-center justify-center gap-3 px-4",
								children: /* @__PURE__ */ jsx(ProgressBar, { progress })
							}) : /* @__PURE__ */ jsx("img", {
								src: resultUrl,
								alt: "Result",
								className: "max-h-64 mx-auto rounded-lg object-contain"
							})
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						icon: Sparkles,
						onClick: handleUpscale,
						loading,
						fullWidth: true,
						children: loading ? `Memproses... ${progress}%` : " Upscale 4x Sekarang"
					}),
					resultUrl && /* @__PURE__ */ jsx(Button, {
						variant: "success",
						icon: Download,
						onClick: handleDownload,
						fullWidth: true,
						children: "Unduh Hasil"
					})
				]
			})
		]
	});
}
//#endregion
export { UpscaleImage as default };
