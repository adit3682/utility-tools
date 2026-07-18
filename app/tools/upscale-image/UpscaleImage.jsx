import { useUpscaleImage } from './useUpscaleImage';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import PreviewCard from '../../components/ui/PreviewCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { Download, Sparkles } from 'lucide-react';

export default function UpscaleImage() {
  const {
    originalImage, originalUrl, resultUrl, loading, progress,
    handleImageUpload, handleUpscale, handleDownload,
  } = useUpscaleImage();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Upscale Image</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perbesar resolusi & pertajam detail gambar (4x) pakai AI, langsung di browser.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleImageUpload({ target: { files } })}
        accept="image/*"
        label="Pilih Gambar"
        hint="Disarankan gambar berukuran sedang — file besar butuh waktu lebih lama"
        fileName={originalImage?.name}
      />

      {originalImage && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewCard label="Sebelum">
              <img src={originalUrl} alt="Original" className="max-h-64 mx-auto rounded-lg object-contain" />
            </PreviewCard>

            <PreviewCard label="Sesudah (4x)" empty={!resultUrl} emptyText={loading ? 'Memproses...' : 'Belum diproses'}>
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 px-4">
                  <ProgressBar progress={progress} />
                </div>
              ) : (
                <img src={resultUrl} alt="Result" className="max-h-64 mx-auto rounded-lg object-contain" />
              )}
            </PreviewCard>
          </div>

          <Button icon={Sparkles} onClick={handleUpscale} loading={loading} fullWidth>
            {loading ? `Memproses... ${progress}%` : ' Upscale 4x Sekarang'}
          </Button>

          {resultUrl && (
            <Button variant="success" icon={Download} onClick={handleDownload} fullWidth>
              Unduh Hasil
            </Button>
          )}
        </div>
      )}
    </div>
  );
}