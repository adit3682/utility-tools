import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import imageCompression from "browser-image-compression";
//#region app/lib/formatSize.js
function formatSizeMB(bytes) {
	return (bytes / 1024 / 1024).toFixed(2);
}
//#endregion
//#region app/tools/compress-image/useCompressImage.js
function useCompressImage() {
	const [originalImage, setOriginalImage] = useState(null);
	const [originalSize, setOriginalSize] = useState(0);
	const [compressedImage, setCompressedImage] = useState(null);
	const [compressedSize, setCompressedSize] = useState(0);
	const [loading, setLoading] = useState(false);
	const [quality, setQuality] = useState(.8);
	const handleImageUpload = (event) => {
		const imageFile = event.target.files[0];
		if (imageFile) {
			setOriginalImage(imageFile);
			setOriginalSize(formatSizeMB(imageFile.size));
			setCompressedImage(null);
			setCompressedSize(0);
		}
	};
	const handleCompression = async () => {
		if (!originalImage) return;
		setLoading(true);
		const options = {
			maxSizeMB: parseFloat((originalSize * quality).toFixed(2)) || 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true
		};
		try {
			const compressedFile = await imageCompression(originalImage, options);
			setCompressedImage(compressedFile);
			setCompressedSize(formatSizeMB(compressedFile.size));
		} catch (error) {
			console.error("Proses kompresi gagal:", error);
			alert("Waduh, gagal mengompres gambar. Coba gambar lain ya!");
		} finally {
			setLoading(false);
		}
	};
	const handleDownload = () => {
		if (!compressedImage) return;
		const downloadUrl = URL.createObjectURL(compressedImage);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `compressed_${originalImage.name}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		originalImage,
		originalSize,
		compressedImage,
		compressedSize,
		loading,
		quality,
		setQuality,
		handleImageUpload,
		handleCompression,
		handleDownload
	};
}
//#endregion
//#region app/tools/compress-image/CompressImage.jsx
function CompressImage() {
	const { originalImage, originalSize, compressedImage, compressedSize, loading, quality, setQuality, handleImageUpload, handleCompression, handleDownload } = useCompressImage();
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl w-full bg-slate-850 rounded-2xl shadow-2xl p-8 border border-slate-700/50",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight",
						children: "Instant Image Compressor ⚡"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-slate-400 mt-2 text-sm md:text-base",
						children: "Perkecil ukuran gambar instan tanpa upload ke server. Privasi Anda 100% aman!"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-8 hover:border-teal-500 hover:bg-slate-800/30 transition duration-300",
					children: [/* @__PURE__ */ jsx("input", {
						type: "file",
						accept: "image/*",
						onChange: handleImageUpload,
						className: "hidden",
						id: "upload-btn"
					}), /* @__PURE__ */ jsxs("label", {
						htmlFor: "upload-btn",
						className: "cursor-pointer flex flex-col items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								className: "h-12 w-12 text-teal-400",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 2,
									d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								})
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-lg text-slate-200",
								children: "Pilih Gambar Anda"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs text-slate-400",
								children: "Mendukung PNG, JPEG, WebP"
							})
						]
					})]
				}),
				originalImage && /* @__PURE__ */ jsxs("div", {
					className: "mt-8 space-y-6 animate-fade-in",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-slate-800/40 p-4 rounded-xl border border-slate-700/50",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "flex justify-between text-sm font-medium mb-2 text-slate-300",
								children: [/* @__PURE__ */ jsx("span", { children: "Target Kualitas Kompresi:" }), /* @__PURE__ */ jsxs("span", {
									className: "text-teal-400 font-bold",
									children: [Math.round(quality * 100), "%"]
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: "0.1",
								max: "0.9",
								step: "0.1",
								value: quality,
								onChange: (e) => setQuality(parseFloat(e.target.value)),
								className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 text-center",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
										children: "Sebelum"
									}),
									/* @__PURE__ */ jsx("img", {
										src: URL.createObjectURL(originalImage),
										alt: "Original",
										className: "max-h-64 mx-auto rounded-lg object-contain mb-3"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-sm font-medium text-slate-300",
										children: ["Ukuran: ", /* @__PURE__ */ jsxs("span", {
											className: "text-rose-400",
											children: [originalSize, " MB"]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 text-center flex flex-col justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
									children: "Sesudah"
								}), compressedImage ? /* @__PURE__ */ jsx("img", {
									src: URL.createObjectURL(compressedImage),
									alt: "Compressed",
									className: "max-h-64 mx-auto rounded-lg object-contain mb-3"
								}) : /* @__PURE__ */ jsx("div", {
									className: "h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-600 mb-3 text-sm",
									children: "Belum dikompresi"
								})] }), compressedSize > 0 && /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-medium text-slate-300 mb-3",
									children: [
										"Ukuran: ",
										/* @__PURE__ */ jsxs("span", {
											className: "text-emerald-400",
											children: [compressedSize, " MB"]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold",
											children: [
												"Hemat ",
												Math.round((originalSize - compressedSize) / originalSize * 100),
												"%!"
											]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-4",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: handleCompression,
								disabled: loading,
								className: "flex-1 py-3 px-6 rounded-xl font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-50 transition cursor-pointer",
								children: loading ? "Sedang Mengompres..." : "⚡ Kompres Gambar Sekarang"
							}), compressedImage && /* @__PURE__ */ jsx("button", {
								onClick: handleDownload,
								className: "flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition cursor-pointer",
								children: "Unduh Gambar Hasil Kompresi"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CompressImage as default };
