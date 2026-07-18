import { useCompressImage } from './useCompressImage';

export default function CompressImage() {
  const {
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
  } = useCompressImage();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-slate-850 rounded-2xl shadow-2xl p-8 border border-slate-700/50">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            Instant Image Compressor ⚡
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Perkecil ukuran gambar instan tanpa upload ke server. Privasi Anda 100% aman!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-8 hover:border-teal-500 hover:bg-slate-800/30 transition duration-300">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="upload-btn"
          />
          <label htmlFor="upload-btn" className="cursor-pointer flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-lg text-slate-200">Pilih Gambar Anda</span>
            <span className="text-xs text-slate-400">Mendukung PNG, JPEG, WebP</span>
          </label>
        </div>

        {originalImage && (
          <div className="mt-8 space-y-6 animate-fade-in">

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <label className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                <span>Target Kualitas Kompresi:</span>
                <span className="text-teal-400 font-bold">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 text-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sebelum</p>
                <img
                  src={URL.createObjectURL(originalImage)}
                  alt="Original"
                  className="max-h-64 mx-auto rounded-lg object-contain mb-3"
                />
                <p className="text-sm font-medium text-slate-300">Ukuran: <span className="text-rose-400">{originalSize} MB</span></p>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 text-center flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sesudah</p>
                  {compressedImage ? (
                    <img
                      src={URL.createObjectURL(compressedImage)}
                      alt="Compressed"
                      className="max-h-64 mx-auto rounded-lg object-contain mb-3"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-600 mb-3 text-sm">
                      Belum dikompresi
                    </div>
                  )}
                </div>
                {compressedSize > 0 && (
                  <p className="text-sm font-medium text-slate-300 mb-3">
                    Ukuran: <span className="text-emerald-400">{compressedSize} MB</span>
                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      Hemat {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%!
                    </span>
                  </p>
                )}
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCompression}
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-xl font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? "Sedang Mengompres..." : "⚡ Kompres Gambar Sekarang"}
              </button>

              {compressedImage && (
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition cursor-pointer"
                >
                   Unduh Gambar Hasil Kompresi
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}