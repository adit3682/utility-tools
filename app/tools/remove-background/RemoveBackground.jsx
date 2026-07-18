import { useRemoveBackground } from './useRemoveBackground';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import PreviewCard from '../../components/ui/PreviewCard';
import { Download, Wand2 } from 'lucide-react';

const checkerboardStyle = {
  backgroundImage:
    'linear-gradient(45deg, #94a3b8 25%, transparent 25%), linear-gradient(-45deg, #94a3b8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #94a3b8 75%), linear-gradient(-45deg, transparent 75%, #94a3b8 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
};

export default function RemoveBackground() {
  const {
    originalImage, originalUrl, resultUrl, loading, progressLabel,
    handleImageUpload, handleRemoveBackground, handleDownload,
  } = useRemoveBackground();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Remove Background</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Hapus background gambar otomatis pakai AI, langsung di browser.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleImageUpload({ target: { files } })}
        accept="image/*"
        label="Pilih Gambar"
        hint="Proses pertama butuh waktu lebih lama (download model)"
        fileName={originalImage?.name}
      />

      {originalImage && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewCard label="Sebelum">
              <img src={originalUrl} alt="Original" className="max-h-64 mx-auto rounded-lg object-contain" />
            </PreviewCard>

            <PreviewCard label="Sesudah" empty={!resultUrl} emptyText={loading ? (progressLabel || 'Memproses...') : 'Belum diproses'}>
              <div className="rounded-lg overflow-hidden mx-auto inline-block" style={checkerboardStyle}>
                <img src={resultUrl} alt="Result" className="max-h-64 mx-auto object-contain" />
              </div>
            </PreviewCard>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button icon={Wand2} onClick={handleRemoveBackground} loading={loading} fullWidth>
              {loading ? (progressLabel || 'Memproses...') : 'Hapus Background'}
            </Button>
            {resultUrl && (
              <Button variant="success" icon={Download} onClick={handleDownload} fullWidth>
                Unduh PNG (Transparan)
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}