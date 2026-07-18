import { usePdfToImage } from './usePdfToImage';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import { Download, FolderDown } from 'lucide-react';

export default function PdfToImage() {
  const {
    file, pages, loading, scale, setScale,
    handleFileUpload, handleConvert, downloadSingle, downloadAllAsZip,
  } = usePdfToImage();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">PDF to Image</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Ubah setiap halaman PDF jadi gambar PNG, langsung di browser.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleFileUpload({ target: { files } })}
        accept="application/pdf"
        label="Pilih File PDF"
        hint="Maks. kualitas terbaik, semua halaman"
        fileName={file?.name}
      />

      {file && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <label className="flex justify-between text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
              <span>Kualitas Gambar:</span>
              <span className="text-teal-500 dark:text-teal-400 font-bold">
                {scale === 1 ? 'Standar' : scale === 2 ? 'Tinggi' : 'Sangat Tinggi'}
              </span>
            </label>
            <input
              type="range" min="1" max="3" step="1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <Button onClick={handleConvert} loading={loading} fullWidth>
            {loading ? 'Sedang memproses halaman...' : ' Convert ke Gambar'}
          </Button>

          {pages.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {pages.length} halaman berhasil dikonversi
                </p>
                <button
                  onClick={downloadAllAsZip}
                  className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <FolderDown size={16} />
                  Unduh Semua (.zip)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div key={page.pageNum} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <span className="text-white text-xs font-bold">Hal. {page.pageNum}</span>
                      <button onClick={() => downloadSingle(page)} className="bg-teal-500 hover:bg-teal-400 text-white p-1.5 rounded-full">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}