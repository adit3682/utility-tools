import { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';

export function useRemoveBackground() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginalImage(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;
    setLoading(true);
    setProgressLabel('Mengunduh model AI (hanya sekali)...');

    try {
      const blob = await removeBackground(originalImage, {
        progress: (key, current, total) => {
          if (key.startsWith('fetch')) {
            setProgressLabel(`Mengunduh model... ${Math.round((current / total) * 100)}%`);
          } else {
            setProgressLabel('Memproses gambar...');
          }
        },
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Gagal menghapus background:', error);
      alert('Gagal memproses gambar. Coba gambar lain atau refresh halaman.');
    } finally {
      setLoading(false);
      setProgressLabel('');
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `no-bg_${originalImage.name.replace(/\.[^.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    originalImage,
    originalUrl,
    resultUrl,
    loading,
    progressLabel,
    handleImageUpload,
    handleRemoveBackground,
    handleDownload,
  };
}