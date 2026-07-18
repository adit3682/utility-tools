import { useCompressPdf } from './useCompressPdf';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import { Download } from 'lucide-react';

function formatSize(bytes) {
  if (bytes === 0) return '0 KB';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export default function CompressPdf() {
  const {
    file, originalSize, mode, setMode, quality, setQuality,
    loading, resultUrl, resultSize,
    handleFileUpload, handleCompress, handleDownload,
  } = useCompressPdf();

  const savedPercent = resultSize > 0
    ? Math.round(((originalSize - resultSize) / originalSize) * 100)
    : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Compress PDF</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perkecil ukuran file PDF langsung di browser, tanpa upload.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleFileUpload({ target: { files } })}
        accept="application/pdf"
        label="Pilih File PDF"
        hint={file ? `Ukuran asli: ${formatSize(originalSize)}` : undefined}
        fileName={file?.name}
      />

      {file && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMode('light')}
              className={`text-left p-4 rounded-xl border-2 transition ${mode === 'light' ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <p className="font-bold text-slate-900 dark:text-white mb-1">Mode Ringan</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Teks tetap bisa di-select/copy. Pengurangan kecil-sedang.</p>
            </button>
            <button
              onClick={() => setMode('rasterize')}
              className={`text-left p-4 rounded-xl border-2 transition ${mode === 'rasterize' ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <p className="font-bold text-slate-900 dark:text-white mb-1">Mode Maksimal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ukuran berkurang signifikan, teks jadi gambar.</p>
            </button>
          </div>

          {mode === 'rasterize' && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <label className="flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
                <span>Kualitas Gambar:</span>
                <span className="text-teal-500 dark:text-teal-400 font-bold">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range" min="0.3" max="0.9" step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          )}

          <Button onClick={handleCompress} loading={loading} fullWidth>
            {loading ? 'Sedang mengompres...' : ' Kompres PDF'}
          </Button>

          {resultUrl && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ukuran baru: <span className="font-bold text-emerald-500">{formatSize(resultSize)}</span>
                </p>
                {savedPercent > 0 && <p className="text-xs text-emerald-500 font-bold">Hemat {savedPercent}%</p>}
              </div>
              <Button variant="success" icon={Download} onClick={handleDownload}>
                Unduh
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}