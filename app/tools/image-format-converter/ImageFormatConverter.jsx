import { useImageFormatConverter } from './useImageFormatConverter';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import PreviewCard from '../../components/ui/PreviewCard';
import { Download, RefreshCw } from 'lucide-react';

function formatSize(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export default function ImageFormatConverter() {
  const {
    file, previewUrl, targetFormat, setTargetFormat, quality, setQuality,
    loading, resultUrl, resultSize,
    handleFileUpload, handleConvert, handleDownload, FORMATS,
  } = useImageFormatConverter();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Image Format Converter
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Convert gambar antar format PNG, JPG, WebP, dan AVIF — langsung di browser.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleFileUpload({ target: { files } })}
        accept="image/*"
        label="Pilih Gambar"
        hint="Mendukung PNG, JPEG, WebP, AVIF sebagai input"
        fileName={file?.name}
      />

      {file && (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Convert ke:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(FORMATS).map(([key, fmt]) => (
                <button
                  key={key}
                  onClick={() => setTargetFormat(key)}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition ${
                    targetFormat === key
                      ? 'border-teal-500 bg-teal-500/5 text-teal-600 dark:text-teal-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {targetFormat !== 'png' && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <label className="flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
                <span>Kualitas:</span>
                <span className="text-teal-500 dark:text-teal-400 font-bold">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range" min="0.1" max="1" step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewCard label="Sebelum">
              <img src={previewUrl} alt="Original" className="max-h-64 mx-auto rounded-lg object-contain" />
            </PreviewCard>

            <PreviewCard label="Sesudah" empty={!resultUrl} emptyText={loading ? 'Mengonversi...' : 'Belum diproses'}>
              <img src={resultUrl} alt="Result" className="max-h-64 mx-auto rounded-lg object-contain mb-2" />
              {resultSize > 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ukuran: <span className="text-emerald-500 font-bold">{formatSize(resultSize)}</span>
                </p>
              )}
            </PreviewCard>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button icon={RefreshCw} onClick={handleConvert} loading={loading} fullWidth>
              {loading ? 'Sedang mengonversi...' : `Convert ke ${FORMATS[targetFormat].label}`}
            </Button>
            {resultUrl && (
              <Button variant="success" icon={Download} onClick={handleDownload} fullWidth>
                Unduh {FORMATS[targetFormat].label}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}