import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getPdfjsLib } from '../pdf-to-image/pdfWorker';

export function useCompressPdf() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [mode, setMode] = useState('light'); // 'light' | 'rasterize'
  const [quality, setQuality] = useState(0.7); // dipakai di mode rasterize
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
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const bytes = await pdfDoc.save({ useObjectStreams: true });
    return new Blob([bytes], { type: 'application/pdf' });
  };

  const compressRasterize = async (arrayBuffer) => {
    const pdfjsLib = await getPdfjsLib();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
      const jpegBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
      const jpegImage = await newPdf.embedJpg(jpegBytes);

      const newPage = newPdf.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpegImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    }

    const bytes = await newPdf.save();
    return new Blob([bytes], { type: 'application/pdf' });
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = mode === 'light'
        ? await compressLight(arrayBuffer)
        : await compressRasterize(arrayBuffer);

      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (error) {
      console.error('Gagal kompres PDF:', error);
      alert('Gagal mengompres PDF, pastikan file tidak rusak atau terkunci password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
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
    handleDownload,
  };
}