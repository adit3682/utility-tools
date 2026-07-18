import { useImageToPdf } from './useImageToPdf';
import Dropzone from '../../components/ui/Dropzone';
import Button from '../../components/ui/Button';
import { X, FileDown } from 'lucide-react';

export default function ImageToPdf() {
  const {
    images, loading, pdfUrl,
    handleFilesUpload, removeImage, handleConvert, handleDownload,
  } = useImageToPdf();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Image to PDF</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gabungkan beberapa gambar jadi satu file PDF, langsung di browser.
        </p>
      </div>

      <Dropzone
        onFilesSelected={(files) => handleFilesUpload({ target: { files } })}
        accept="image/*"
        multiple
        label="Pilih Gambar (bisa lebih dari satu)"
        hint="PNG, JPEG, WebP"
      />

      {images.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
            {images.length} gambar dipilih — urutan ini akan jadi urutan halaman PDF
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.previewUrl} alt="" className="w-full h-28 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={handleConvert} loading={loading} fullWidth>
              {loading ? 'Sedang membuat PDF...' : ' Convert ke PDF'}
            </Button>
            {pdfUrl && (
              <Button variant="success" icon={FileDown} onClick={handleDownload} fullWidth>
                Unduh PDF
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}