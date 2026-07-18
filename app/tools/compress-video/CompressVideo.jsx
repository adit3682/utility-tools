import { useCompressVideo } from './useCompressVideo';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { Download, Film, AlertTriangle } from 'lucide-react';

function formatSize(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / 1024 / 1024;
  return mb < 1024 ? `${mb.toFixed(1)} MB` : `${(mb / 1024).toFixed(2)} GB`;
}

export default function CompressVideo() {
  const {
    file, originalSize, warning, loading, progress, statusText,
    resultUrl, resultSize, crf, setCrf, resolution, setResolution,
    handleFileUpload, handleCompress, handleDownload,
  } = useCompressVideo();

  const savedPercent = resultSize > 0
    ? Math.round(((originalSize - resultSize) / originalSize) * 100)
    : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Compress Video</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perkecil ukuran video langsung di browser, tanpa upload ke server.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleFileUpload({ target: { files } })}
        accept="video/*"
        label="Pilih Video"
        hint={file ? `Ukuran asli: ${formatSize(originalSize)}` : 'Disarankan di bawah 150MB untuk hasil terbaik'}
        fileName={file?.name}
      />

      {warning && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {file && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
              <label className="flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
                <span>Tingkat Kompresi:</span>
                <span className="text-teal-500 dark:text-teal-400 font-bold">
                  {crf <= 23 ? 'Kualitas Tinggi' : crf <= 30 ? 'Seimbang' : 'Ukuran Kecil'}
                </span>
              </label>
              <div className="flex-1 flex flex-col justify-center">
                <input
                  type="range" min="18" max="35" step="1"
                  value={crf}
                  onChange={(e) => setCrf(Number(e.target.value))}
                  disabled={loading}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Kualitas lebih baik</span>
                <span>Ukuran lebih kecil</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">
                Resolusi Output:
              </label>
              <div className="grid grid-cols-4 gap-2 my-auto">
                {[
                  { value: 'original', label: 'Asli' },
                  { value: '720', label: '720p' },
                  { value: '480', label: '480p' },
                  { value: '360', label: '360p' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setResolution(opt.value)}
                    disabled={loading}
                    className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      resolution === opt.value
                        ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Turunkan resolusi untuk hasil paling cepat & ukuran paling kecil.
              </p>
            </div>

          </div>

          <Button icon={Film} onClick={handleCompress} loading={loading} fullWidth>
            {loading ? (statusText || 'Memproses...') : ' Kompres Video'}
          </Button>

          {loading && (
            <ProgressBar progress={progress} label={statusText || 'Memproses'} />
          )}

          {resultUrl && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <video src={resultUrl} controls className="w-full rounded-lg mb-3 max-h-80" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ukuran baru: <span className="font-bold text-emerald-500">{formatSize(resultSize)}</span>
                  </p>
                  {savedPercent > 0 && (
                    <p className="text-xs text-emerald-500 font-bold">Hemat {savedPercent}%</p>
                  )}
                </div>
                <Button variant="success" icon={Download} onClick={handleDownload}>
                  Unduh
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}