import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, NavLink, Navigate, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Suspense, createContext, lazy, useContext, useEffect, useMemo, useState } from "react";
import { Archive, FileText, Film, ImageDown, Images, LayoutGrid, Menu, Moon, RefreshCw, Search, Shield, Sparkles, Sun, Wand2, WifiOff, X, Zap } from "lucide-react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/context/ThemeContext.jsx
var ThemeContext = createContext();
function ThemeProvider({ children }) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		const initial = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(initial);
		setMounted(true);
	}, []);
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
	}, [theme, mounted]);
	const toggleTheme = () => setTheme((t) => t === "dark" ? "light" : "dark");
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			theme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	return useContext(ThemeContext);
}
//#endregion
//#region app/config/tools.config.js
var tools = [
	{
		id: "compress-image",
		name: "Compress Image",
		description: "Kompres gambar tanpa upload ke server",
		category: "Image",
		path: "/tools/compress-image",
		icon: ImageDown,
		component: lazy(() => import("./assets/CompressImage-qjO01n6-.js"))
	},
	{
		id: "image-to-pdf",
		name: "Image to PDF",
		description: "Gabungkan gambar jadi satu file PDF",
		category: "PDF",
		path: "/tools/image-to-pdf",
		icon: FileText,
		component: lazy(() => import("./assets/ImageToPdf-C6A2jV4u.js"))
	},
	{
		id: "pdf-to-image",
		name: "PDF to Image",
		description: "Ubah setiap halaman PDF jadi gambar PNG",
		category: "PDF",
		path: "/tools/pdf-to-image",
		icon: Images,
		component: lazy(() => import("./assets/PdfToImage-BY9pdnLn.js"))
	},
	{
		id: "compress-pdf",
		name: "Compress PDF",
		description: "Perkecil ukuran file PDF",
		category: "PDF",
		path: "/tools/compress-pdf",
		icon: Archive,
		component: lazy(() => import("./assets/CompressPdf-BisbXQT0.js"))
	},
	{
		id: "remove-background",
		name: "Remove Background",
		description: "Hapus background gambar otomatis pakai AI",
		category: "Image",
		path: "/tools/remove-background",
		icon: Wand2,
		component: lazy(() => import("./assets/RemoveBackground-BStpZI_R.js"))
	},
	{
		id: "upscale-image",
		name: "Upscale Image",
		description: "Perbesar resolusi & pertajam gambar pakai AI",
		category: "Image",
		path: "/tools/upscale-image",
		icon: Sparkles,
		component: lazy(() => import("./assets/UpscaleImage-DQtAAz8V.js"))
	},
	{
		id: "image-format-converter",
		name: "Image Format Converter",
		description: "Convert gambar antar PNG, JPG, WebP, AVIF",
		category: "Image",
		path: "/tools/image-format-converter",
		icon: RefreshCw,
		component: lazy(() => import("./assets/ImageFormatConverter-DblFJFqB.js"))
	},
	{
		id: "compress-video",
		name: "Compress Video",
		description: "Perkecil ukuran video tanpa upload ke server",
		category: "Video",
		path: "/tools/compress-video",
		icon: Film,
		component: lazy(() => import("./assets/CompressVideo-Bfzyp7Be.js"))
	}
];
//#endregion
//#region app/components/layout/Sidebar.jsx
function Sidebar({ isOpen, onClose }) {
	const { theme, toggleTheme } = useTheme();
	return /* @__PURE__ */ jsxs(Fragment, { children: [isOpen && /* @__PURE__ */ jsx("div", {
		onClick: onClose,
		className: "fixed inset-0 bg-black/50 z-40 lg:hidden"
	}), /* @__PURE__ */ jsxs("aside", {
		className: `
    fixed lg:sticky top-0 left-0 h-screen w-64 z-50
    bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
    flex flex-col shrink-0
    transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("h1", {
					className: "text-lg font-black text-slate-900 dark:text-white tracking-tight",
					children: ["Utility", /* @__PURE__ */ jsx("span", {
						className: "text-teal-500",
						children: "Tools"
					})]
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition",
					children: /* @__PURE__ */ jsx(X, {
						size: 20,
						className: "text-slate-500"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("nav", {
				className: "flex-1 overflow-y-auto p-3 space-y-1",
				children: [
					/* @__PURE__ */ jsxs(NavLink, {
						to: "/",
						end: true,
						onClick: onClose,
						className: ({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"}`,
						children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 18 }), "Dashboard"]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider",
						children: "Tools"
					}),
					tools.map((tool) => {
						const Icon = tool.icon;
						return /* @__PURE__ */ jsxs(NavLink, {
							to: tool.path,
							onClick: onClose,
							className: ({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"}`,
							children: [/* @__PURE__ */ jsx(Icon, { size: 18 }), tool.name]
						}, tool.id);
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3 border-t border-slate-200 dark:border-slate-800",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: toggleTheme,
					className: "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
					children: [theme === "dark" ? /* @__PURE__ */ jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsx(Moon, { size: 18 }), theme === "dark" ? "Light Mode" : "Dark Mode"]
				})
			})
		]
	})] });
}
//#endregion
//#region app/components/layout/RootLayout.jsx
function RootLayout({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex bg-slate-50 dark:bg-slate-950 min-h-screen",
		children: [/* @__PURE__ */ jsx(Sidebar, {
			isOpen: isSidebarOpen,
			onClose: () => setIsSidebarOpen(false)
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ jsxs("header", {
				className: "lg:hidden flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setIsSidebarOpen(true),
					className: "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition",
					children: /* @__PURE__ */ jsx(Menu, {
						size: 22,
						className: "text-slate-700 dark:text-slate-200"
					})
				}), /* @__PURE__ */ jsxs("h1", {
					className: "font-black text-slate-900 dark:text-white",
					children: ["Utility", /* @__PURE__ */ jsx("span", {
						className: "text-teal-500",
						children: "Tools"
					})]
				})]
			}), /* @__PURE__ */ jsx("main", {
				className: "flex-1 overflow-y-auto",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})]
		})]
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	default: () => root_default,
	meta: () => meta$2
});
function meta$2() {
	return [{ title: "UtilityTools" }, {
		name: "description",
		content: "Tools online gratis, 100% diproses di browser."
	}];
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "id",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(RootLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) }) }),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
});
//#endregion
//#region app/components/ui/ToolCard.jsx
function ToolCard({ tool }) {
	const Icon = tool.icon;
	return /* @__PURE__ */ jsxs(Link, {
		to: tool.path,
		className: "group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-11 h-11 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition",
				children: /* @__PURE__ */ jsx(Icon, {
					size: 22,
					className: "text-teal-400"
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-bold text-white mb-1",
				children: tool.name
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-400",
				children: tool.description
			})
		]
	});
}
//#endregion
//#region app/pages/Dashboard.jsx
function Dashboard() {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("Semua");
	const categories = useMemo(() => {
		return ["Semua", ...[...new Set(tools.map((t) => t.category))]];
	}, []);
	const filteredTools = useMemo(() => {
		return tools.filter((tool) => {
			const matchCategory = activeCategory === "Semua" || tool.category === activeCategory;
			const matchQuery = tool.name.toLowerCase().includes(query.toLowerCase()) || tool.description.toLowerCase().includes(query.toLowerCase());
			return matchCategory && matchQuery;
		});
	}, [query, activeCategory]);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }), /* @__PURE__ */ jsxs("div", {
			className: "relative px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center max-w-3xl mx-auto",
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: "inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4",
					children: [tools.length, " Tools Tersedia"]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight",
					children: [
						"Semua Tools yang Kamu Butuhkan,",
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent",
							children: "Tanpa Upload ke Server"
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg",
					children: "Kompres gambar, convert PDF, hapus background, upscale foto — semua diproses langsung di browser kamu. Cepat, gratis, dan 100% privat."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3 sm:gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200",
							children: [/* @__PURE__ */ jsx(Shield, {
								size: 16,
								className: "text-teal-500"
							}), "100% Privat"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200",
							children: [/* @__PURE__ */ jsx(Zap, {
								size: 16,
								className: "text-teal-500"
							}), "Proses Instan"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200",
							children: [/* @__PURE__ */ jsx(WifiOff, {
								size: 16,
								className: "text-teal-500"
							}), "Tanpa Upload File"]
						})
					]
				})
			]
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-4 sm:p-6 lg:p-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative mb-5 max-w-xl mx-auto",
				children: [/* @__PURE__ */ jsx(Search, {
					size: 18,
					className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Cari tool... (misal: compress, pdf, gambar)",
					className: "w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition shadow-sm"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide",
				children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActiveCategory(cat),
					className: `shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? "bg-teal-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
					children: cat
				}, cat))
			}),
			filteredTools.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto",
				children: filteredTools.map((tool) => /* @__PURE__ */ jsx(ToolCard, { tool }, tool.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "text-center py-16 text-slate-400",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium",
					children: "Tool tidak ditemukan"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm",
					children: "Coba kata kunci atau kategori lain"
				})]
			})
		]
	})] });
}
//#endregion
//#region app/routes/dashboard.tsx
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => dashboard_default,
	meta: () => meta$1
});
function meta$1() {
	const title = "UtilityTools — Semua Tools Tanpa Upload ke Server";
	const description = `${tools.length} tools gratis untuk kompres gambar, convert PDF, hapus background, dan lainnya. 100% diproses di browser, tanpa upload file.`;
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		}
	];
}
var dashboard_default = UNSAFE_withComponentProps(Dashboard);
//#endregion
//#region app/pages/ToolPage.jsx
function ToolPage() {
	const { toolId } = useParams();
	const tool = tools.find((t) => t.id === toolId);
	if (!tool) return /* @__PURE__ */ jsx(Navigate, {
		to: "/",
		replace: true
	});
	const ToolComponent = tool.component;
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			className: "p-8 text-slate-400",
			children: "Memuat tool..."
		}),
		children: /* @__PURE__ */ jsx(ToolComponent, {})
	});
}
//#endregion
//#region app/routes/tool.tsx
var tool_exports = /* @__PURE__ */ __exportAll({
	default: () => tool_default,
	meta: () => meta
});
function meta({ params }) {
	const tool = tools.find((t) => t.id === params.toolId);
	if (!tool) return [{ title: "Tool Tidak Ditemukan — UtilityTools" }];
	const title = `${tool.name} — UtilityTools`;
	return [
		{ title },
		{
			name: "description",
			content: tool.description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: tool.description
		},
		{
			property: "og:type",
			content: "website"
		}
	];
}
var tool_default = UNSAFE_withComponentProps(ToolPage);
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-Dl7ey3Op.js",
		"imports": [
			"/assets/rolldown-runtime-aKtaBQYM.js",
			"/assets/jsx-runtime-_9epNd8-.js",
			"/assets/errorBoundaries-DfCwcUpk.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-8-GaA2BI.js",
			"imports": [
				"/assets/rolldown-runtime-aKtaBQYM.js",
				"/assets/jsx-runtime-_9epNd8-.js",
				"/assets/errorBoundaries-DfCwcUpk.js",
				"/assets/lib-BlDmPVjT.js",
				"/assets/createLucideIcon-BgznWC3g.js",
				"/assets/tools.config-Cj6Vngty.js",
				"/assets/x-BBPXAJaK.js"
			],
			"css": ["/assets/root-DHI-I1HU.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/dashboard": {
			"id": "routes/dashboard",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/dashboard-5PJXBHlK.js",
			"imports": [
				"/assets/rolldown-runtime-aKtaBQYM.js",
				"/assets/jsx-runtime-_9epNd8-.js",
				"/assets/lib-BlDmPVjT.js",
				"/assets/createLucideIcon-BgznWC3g.js",
				"/assets/tools.config-Cj6Vngty.js",
				"/assets/errorBoundaries-DfCwcUpk.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/tool": {
			"id": "routes/tool",
			"parentId": "root",
			"path": "tools/:toolId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/tool-BlvR1Rlz.js",
			"imports": [
				"/assets/rolldown-runtime-aKtaBQYM.js",
				"/assets/jsx-runtime-_9epNd8-.js",
				"/assets/tools.config-Cj6Vngty.js",
				"/assets/createLucideIcon-BgznWC3g.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-9401bfcd.js",
	"version": "9401bfcd",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = false;
var isSpaMode = false;
var prerender = [
	"/",
	"/tools/compress-image",
	"/tools/image-to-pdf",
	"/tools/pdf-to-image",
	"/tools/compress-pdf",
	"/tools/remove-background",
	"/tools/upscale-image",
	"/tools/image-format-converter",
	"/tools/compress-video"
];
var routeDiscovery = { "mode": "initial" };
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/dashboard": {
		id: "routes/dashboard",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: dashboard_exports
	},
	"routes/tool": {
		id: "routes/tool",
		parentId: "root",
		path: "tools/:toolId",
		index: void 0,
		caseSensitive: void 0,
		module: tool_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
