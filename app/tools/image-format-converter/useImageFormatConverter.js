import { useState } from 'react';
import { encode as encodeAvif } from '@jsquash/avif';

const FORMATS = {
  png: { mime: 'image/png', ext: 'png', label: 'PNG' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPG' },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' },
  avif: { mime: 'image/avif', ext: 'avif', label: 'AVIF' },
};

export function useImageFormatConverter() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [quality, setQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultSize, setResultSize] = useState(0);

  const handleFileUpload = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setFile(imageFile);
      setPreviewUrl(URL.createObjectURL(imageFile));
      setResultUrl(null);
    }
  };

  const loadImageToCanvas = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl(null);

    try {
      const canvas = await loadImageToCanvas(previewUrl);
      const format = FORMATS[targetFormat];

      let blob;
      if (targetFormat === 'avif') {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const avifBuffer = await encodeAvif(imageData, { quality: Math.round(quality * 100) });
        blob = new Blob([avifBuffer], { type: 'image/avif' });
      } else {
        blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, format.mime, format.mime === 'image/png' ? undefined : quality)
        );
      }

      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (error) {
      console.error('Gagal convert format gambar:', error);
      alert('Gagal mengonversi gambar. Coba format atau gambar lain.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const format = FORMATS[targetFormat];
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}.${format.ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    file,
    previewUrl,
    targetFormat,
    setTargetFormat,
    quality,
    setQuality,
    loading,
    resultUrl,
    resultSize,
    handleFileUpload,
    handleConvert,
    handleDownload,
    FORMATS,
  };
}