import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { formatSizeMB } from '../../lib/formatSize';

export function useCompressImage() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.8);

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setOriginalImage(imageFile);
      setOriginalSize(formatSizeMB(imageFile.size));
      setCompressedImage(null);
      setCompressedSize(0);
    }
  };

  const handleCompression = async () => {
    if (!originalImage) return;
    setLoading(true);

    const options = {
      maxSizeMB: parseFloat((originalSize * quality).toFixed(2)) || 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(originalImage, options);
      setCompressedImage(compressedFile);
      setCompressedSize(formatSizeMB(compressedFile.size));
    } catch (error) {
      console.error("Proses kompresi gagal:", error);
      alert("Waduh, gagal mengompres gambar. Coba gambar lain ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    const downloadUrl = URL.createObjectURL(compressedImage);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `compressed_${originalImage.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    originalImage,
    originalSize,
    compressedImage,
    compressedSize,
    loading,
    quality,
    setQuality,
    handleImageUpload,
    handleCompression,
    handleDownload,
  };
}