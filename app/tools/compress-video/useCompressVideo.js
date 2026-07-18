import { useState, useRef } from 'react';

const MAX_SAFE_SIZE = 150 * 1024 * 1024; // 150MB — batas "aman"
const MAX_HARD_SIZE = 500 * 1024 * 1024; // 500MB — batas mutlak

const RESOLUTION_MAP = {
  original: null,
  '720': 720,
  '480': 480,
  '360': 360,
};

export function useCompressVideo() {
  const ffmpegRef = useRef(null);
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [crf, setCrf] = useState(28); 
  const [resolution, setResolution] = useState('original');

  const handleFileUpload = (event) => {
    const videoFile = event.target.files[0];
    if (!videoFile) return;

    if (videoFile.size > MAX_HARD_SIZE) {
      alert('File terlalu besar (>500MB). Browser kemungkinan besar akan crash. Coba kompres pakai aplikasi desktop dulu untuk file sebesar ini.');
      return;
    }

    setWarning(
      videoFile.size > MAX_SAFE_SIZE
        ? 'File cukup besar — proses bisa memakan waktu lama dan berat untuk device dengan RAM terbatas.'
        : null
    );

    setFile(videoFile);
    setOriginalSize(videoFile.size);
    setResultUrl(null);
  };

  const loadFFmpeg = async () => {
    // dynamic import — baru dieksekusi saat function ini dipanggil (di browser, saat user klik tombol)
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { toBlobURL } = await import('@ffmpeg/util');

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg();
    }

    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) return ffmpeg;

    setStatusText('Mengunduh engine video (hanya sekali)...');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    ffmpeg.on('progress', ({ progress: p }) => {
      setProgress(Math.round(p * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    return ffmpeg;
  };

  const handleCompress = async () => {
  console.log('handleCompress terpanggil, file:', file);
  if (!file) return;
  setLoading(true);
  setProgress(0);
  setResultUrl(null);

  try {
    const ffmpeg = await loadFFmpeg();
    const { fetchFile } = await import('@ffmpeg/util');
    setStatusText('Memproses video...');

    const inputName = 'input' + (file.name.match(/\.[^.]+$/)?.[0] || '.mp4');
    const outputName = 'output.mp4';

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const args = ['-i', inputName, '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', String(crf)];

    const targetHeight = RESOLUTION_MAP[resolution];
    if (targetHeight) {
      args.push('-vf', `scale=-2:${targetHeight}`);
    }

    args.push('-c:a', 'aac', '-b:a', '128k', outputName);

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    setResultUrl(url);
    setResultSize(blob.size);

    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch (error) {
    console.error('Gagal kompres video:', error);
    alert('Gagal memproses video. Coba file lain atau refresh halaman kalau tab terasa berat.');
  } finally {
    setLoading(false);
    setStatusText('');
  }
};

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `compressed_${file.name.replace(/\.[^.]+$/, '')}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    file, originalSize, warning, loading, progress, statusText,
    resultUrl, resultSize, crf, setCrf, resolution, setResolution,
    handleFileUpload, handleCompress, handleDownload,
  };
}