let pdfjsLibInstance = null;

export async function getPdfjsLib() {
  if (pdfjsLibInstance) return pdfjsLibInstance;

  const pdfjsLib = await import('pdfjs-dist');
  const PdfWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');

  pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker.default;
  pdfjsLibInstance = pdfjsLib;
  return pdfjsLib;
}