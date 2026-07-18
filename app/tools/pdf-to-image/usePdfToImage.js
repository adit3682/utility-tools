import { useState } from 'react';
import JSZip from 'jszip';
import { getPdfjsLib } from './pdfWorker';

export function usePdfToImage() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // [{ pageNum, dataUrl }]
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(2); // 2 = kualitas bagus (~144 DPI)

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

    const results = []; // baris yang kurang

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      await page.render({ canvasContext: context, viewport }).promise;
      results.push({ pageNum: i, dataUrl: canvas.toDataURL('image/png') });
    }

    setPages(results);
  } catch (error) {
    console.error('Gagal convert PDF:', error);
    alert('Gagal membaca PDF, pastikan file tidak rusak atau terkunci password.');
  } finally {
    setLoading(false);
  }
};

  const downloadSingle = (page) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `page-${page.pageNum}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    for (const page of pages) {
      const base64 = page.dataUrl.split(',')[1];
      zip.file(`page-${page.pageNum}.png`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${file.name.replace('.pdf', '')}-images.zip`;
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
    downloadAllAsZip,
  };
}