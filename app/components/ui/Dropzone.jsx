import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function Dropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = false,
  label = 'Pilih File',
  hint,
  fileName,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    if (files.length > 0) onFilesSelected(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
        ${isDragging
          ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10'
          : 'border-slate-300 dark:border-slate-700 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <Upload size={32} className="text-teal-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {fileName || label}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}