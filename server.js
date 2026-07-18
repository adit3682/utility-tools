import express from 'express';
import compression from 'compression';
import { createRequestHandler } from '@react-router/express';

const app = express();

app.use(compression());

// Header wajib untuk SharedArrayBuffer (dipakai ffmpeg.wasm & ort/onnxruntime)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(
  '/assets',
  express.static('build/client/assets', { immutable: true, maxAge: '1y' })
);
app.use(express.static('build/client', { maxAge: '1h' }));

app.all(
  '*splat',
  createRequestHandler({
    build: () => import('./build/server/index.js'),
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});