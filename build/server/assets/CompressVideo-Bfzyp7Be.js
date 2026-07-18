import { n as Dropzone, t as Button } from "./Button-DUDEKJhd.js";
import { t as ProgressBar } from "./ProgressBar-oNVYEkF0.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { AlertTriangle, Download, Film } from "lucide-react";
//#region app/tools/compress-video/useCompressVideo.js
var MAX_SAFE_SIZE = 150 * 1024 * 1024;
var MAX_HARD_SIZE = 500 * 1024 * 1024;
function useCompressVideo() {
	const ffmpegRef = useRef(null);
	const [file, setFile] = useState(null);
	const [originalSize, setOriginalSize] = useState(0);
	const [warning, setWarning] = useState(null);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [statusText, setStatusText] = useState("");
	const [resultUrl, setResultUrl] = useState(null);
	const [resultSize, setResultSize] = useState(0);
	const [crf, setCrf] = useState(28);
	const [resolution, setResolution] = useState("original");
	const handleFileUpload = (event) => {
		const videoFile = event.target.files[0];
		if (!videoFile) return;
		if (videoFile.size > MAX_HARD_SIZE) {
			alert("File terlalu besar (>500MB). Browser kemungkinan besar akan crash. Coba kompres pakai aplikasi desktop dulu untuk file sebesar ini.");
			return;
		}
		setWarning(videoFile.size > MAX_SAFE_SIZE ? "File cukup besar — proses bisa memakan waktu lama dan berat untuk device dengan RAM terbatas." : null);
		setFile(videoFile);
		setOriginalSize(videoFile.size);
		setResultUrl(null);
	};
	const loadFFmpeg = async () => {
		const { FFmpeg } = await import("@ffmpeg/ffmpeg");
		const { toBlobURL } = await import("@ffmpeg/util");
		if (!ffmpegRef.current) ffmpegRef.current = new FFmpeg();
		const ffmpeg = ffmpegRef.current;
		if (ffmpeg.loaded) return ffmpeg;
		setStatusText("Mengunduh engine video (hanya sekali)...");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
		ffmpeg.on("progress", ({ progress: p }) => {
			setProgress(Math.round(p * 100));
		});
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
		});
		return ffmpeg;
	};
	const handleCompress = async () => {
		if (!file) return;
		setLoading(true);
		setProgress(0);
		setResultUrl(null);
		try {
			await loadFFmpeg();
			const { fetchFile } = await import("@ffmpeg/util");
			setStatusText("Memproses video...");
		} catch (error) {
			console.error("Gagal kompres video:", error);
			alert("Gagal memproses video. Coba file lain atau refresh halaman kalau tab terasa berat.");
		} finally {
			setLoading(false);
			setStatusText("");
		}
	};
	const handleDownload = () => {
		if (!resultUrl) return;
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `compressed_${file.name.replace(/\.[^.]+$/, "")}.mp4`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return {
		file,
		originalSize,
		warning,
		loading,
		progress,
		statusText,
		resultUrl,
		resultSize,
		crf,
		setCrf,
		resolution,
		setResolution,
		handleFileUpload,
		handleCompress,
		handleDownload
	};
}
//#endregion
//#region app/tools/compress-video/CompressVideo.jsx
function formatSize(bytes) {
	if (!bytes) return "0 MB";
	const mb = bytes / 1024 / 1024;
	return mb < 1024 ? `${mb.toFixed(1)} MB` : `${(mb / 1024).toFixed(2)} GB`;
}
function CompressVideo() {
	const { file, originalSize, warning, loading, progress, statusText, resultUrl, resultSize, crf, setCrf, resolution, setResolution, handleFileUpload, handleCompress, handleDownload } = useCompressVideo();
	const savedPercent = resultSize > 0 ? Math.round((originalSize - resultSize) / originalSize * 100) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-black text-slate-900 dark:text-white",
					children: "Compress Video"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-slate-400 mt-1",
					children: "Perkecil ukuran video langsung di browser, tanpa upload ke server."
				})]
			}),
			/* @__PURE__ */ jsx(Dropzone, {
				onFilesSelected: (files) => handleFileUpload({ target: { files } }),
				accept: "video/*",
				label: "Pilih Video",
				hint: file ? `Ukuran asli: ${formatSize(originalSize)}` : "Disarankan di bawah 150MB untuk hasil terbaik",
				fileName: file?.name
			}),
			warning && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm",
				children: [/* @__PURE__ */ jsx(AlertTriangle, {
					size: 16,
					className: "mt-0.5 shrink-0"
				}), /* @__PURE__ */ jsx("span", { children: warning })]
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300",
									children: [/* @__PURE__ */ jsx("span", { children: "Tingkat Kompresi:" }), /* @__PURE__ */ jsx("span", {
										className: "text-teal-500 dark:text-teal-400 font-bold",
										children: crf <= 23 ? "Kualitas Tinggi" : crf <= 30 ? "Seimbang" : "Ukuran Kecil"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex-1 flex flex-col justify-center",
									children: /* @__PURE__ */ jsx("input", {
										type: "range",
										min: "18",
										max: "35",
										step: "1",
										value: crf,
										onChange: (e) => setCrf(Number(e.target.value)),
										disabled: loading,
										className: "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-xs text-slate-400 mt-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Kualitas lebih baik" }), /* @__PURE__ */ jsx("span", { children: "Ukuran lebih kecil" })]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block",
									children: "Resolusi Output:"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-4 gap-2 my-auto",
									children: [
										{
											value: "original",
											label: "Asli"
										},
										{
											value: "720",
											label: "720p"
										},
										{
											value: "480",
											label: "480p"
										},
										{
											value: "360",
											label: "360p"
										}
									].map((opt) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setResolution(opt.value),
										disabled: loading,
										className: `py-2 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${resolution === opt.value ? "bg-teal-500 text-white shadow-sm shadow-teal-500/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
										children: opt.label
									}, opt.value))
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-400 mt-2",
									children: "Turunkan resolusi untuk hasil paling cepat & ukuran paling kecil."
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						icon: Film,
						onClick: handleCompress,
						loading,
						fullWidth: true,
						children: loading ? statusText || "Memproses..." : " Kompres Video"
					}),
					loading && /* @__PURE__ */ jsx(ProgressBar, {
						progress,
						label: statusText || "Memproses"
					}),
					resultUrl && /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50",
						children: [/* @__PURE__ */ jsx("video", {
							src: resultUrl,
							controls: true,
							className: "w-full rounded-lg mb-3 max-h-80"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
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
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { CompressVideo as default };
