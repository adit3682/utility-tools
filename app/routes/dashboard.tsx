import Dashboard from '../pages/Dashboard';
import { tools } from '../config/tools.config';

export function meta() {
  const title = 'UtilityTools — Semua Tools Tanpa Upload ke Server';
  const description = `${tools.length} tools gratis untuk kompres gambar, convert PDF, hapus background, dan lainnya. 100% diproses di browser, tanpa upload file.`;

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ];
}

export default Dashboard;