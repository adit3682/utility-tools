import { useState } from 'react';
import { jsPDF } from 'jspdf';

export function useImageToPdf() {
  const [images, setImages] = useState([]); // [{ id, file, previewUrl }]
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFilesUpload = (event) => {
    const files = Array.from(event.target.files);
   const generateId = () =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const newImages = files.map((file) => ({
  id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
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

  const loadImageDimensions = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = url;
    });

  const handleConvert = async () => {
    if (images.length === 0) return;
    setLoading(true);

    try {
      const pdf = new jsPDF({ unit: 'px' });
      pdf.deletePage(1); // buang page kosong default

      for (const img of images) {
        const { width, height } = await loadImageDimensions(img.previewUrl);
        const orientation = width > height ? 'landscape' : 'portrait';
        pdf.addPage([width, height], orientation);
        pdf.addImage(img.previewUrl, 'JPEG', 0, 0, width, height);
      }

      const blob = pdf.output('blob');
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Gagal convert ke PDF:', error);
      alert('Gagal membuat PDF, coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'converted.pdf';
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
    handleDownload,
  };
}