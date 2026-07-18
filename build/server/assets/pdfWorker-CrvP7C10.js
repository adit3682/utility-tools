//#region app/tools/pdf-to-image/pdfWorker.js
var pdfjsLibInstance = null;
async function getPdfjsLib() {
	if (pdfjsLibInstance) return pdfjsLibInstance;
	const pdfjsLib = await import("pdfjs-dist");
	const PdfWorker = await import("./pdf.worker.min-Be_rUMwQ.js");
	pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker.default;
	pdfjsLibInstance = pdfjsLib;
	return pdfjsLib;
}
//#endregion
export { getPdfjsLib as t };
