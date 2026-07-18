import type { Config } from '@react-router/dev/config';

// Daftar manual path tool — tambahkan baris baru di sini setiap kali nambah tool baru
const toolPaths = [
  '/tools/compress-image',
  '/tools/image-to-pdf',
  '/tools/pdf-to-image',
  '/tools/compress-pdf',
  '/tools/remove-background',
  '/tools/upscale-image',
  '/tools/image-format-converter',
  '/tools/compress-video',
];

export default {
  ssr: false,
  async prerender() {
    return ['/', ...toolPaths];
  },
} satisfies Config;