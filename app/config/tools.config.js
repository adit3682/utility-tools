import { lazy } from 'react';
import { ImageDown, FileText, Images } from 'lucide-react';
import { Archive } from 'lucide-react';
import { Wand2 } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { Film } from 'lucide-react';

export const tools = [
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Kompres gambar tanpa upload ke server',
    category: 'Image',
    path: '/tools/compress-image',
    icon: ImageDown,
    component: lazy(() => import('../tools/compress-image/CompressImage')),
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Gabungkan gambar jadi satu file PDF',
    category: 'PDF',
    path: '/tools/image-to-pdf',
    icon: FileText,
    component: lazy(() => import('../tools/image-to-pdf/ImageToPdf')),
  },
  {
  id: 'pdf-to-image',
  name: 'PDF to Image',
  description: 'Ubah setiap halaman PDF jadi gambar PNG',
  category: 'PDF',
  path: '/tools/pdf-to-image',
  icon: Images,
  component: lazy(() => import('../tools/pdf-to-image/PdfToImage')),
},
{
  id: 'compress-pdf',
  name: 'Compress PDF',
  description: 'Perkecil ukuran file PDF',
  category: 'PDF',
  path: '/tools/compress-pdf',
  icon: Archive,
  component: lazy(() => import('../tools/compress-pdf/CompressPdf')),
},
{
  id: 'remove-background',
  name: 'Remove Background',
  description: 'Hapus background gambar otomatis pakai AI',
  category: 'Image',
  path: '/tools/remove-background',
  icon: Wand2,
  component: lazy(() => import('../tools/remove-background/RemoveBackground')),
},
{
  id: 'upscale-image',
  name: 'Upscale Image',
  description: 'Perbesar resolusi & pertajam gambar pakai AI',
  category: 'Image',
  path: '/tools/upscale-image',
  icon: Sparkles,
  component: lazy(() => import('../tools/upscale-image/UpscaleImage')),
},
{
  id: 'image-format-converter',
  name: 'Image Format Converter',
  description: 'Convert gambar antar PNG, JPG, WebP, AVIF',
  category: 'Image',
  path: '/tools/image-format-converter',
  icon: RefreshCw,
  component: lazy(() => import('../tools/image-format-converter/ImageFormatConverter')),
},
{
  id: 'compress-video',
  name: 'Compress Video',
  description: 'Perkecil ukuran video tanpa upload ke server',
  category: 'Video',
  path: '/tools/compress-video',
  icon: Film,
  component: lazy(() => import('../tools/compress-video/CompressVideo')),
},
];