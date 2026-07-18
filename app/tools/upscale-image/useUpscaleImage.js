import { useState, useRef } from 'react';

export function useUpscaleImage() {
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
        const { default: Upscaler } = await import('upscaler');
        upscalerRef.current = new Upscaler();
      }

      const result = await upscalerRef.current.upscale(originalUrl, {
        output: 'base64',
        patchSize: 64,
        padding: 2,
        progress: (p) => setProgress(Math.round(p * 100)),
      });
      setResultUrl(result);
    } catch (error) {
      console.error('Gagal upscale gambar:', error);
      alert('Gagal memproses gambar. Coba gambar dengan ukuran lebih kecil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
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
    handleDownload,
  };
}