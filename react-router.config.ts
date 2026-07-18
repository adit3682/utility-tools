import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite'; 

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
  presets: [vercelPreset()],
  async prerender() {
    return ['/', ...toolPaths];
  },
} satisfies Config;