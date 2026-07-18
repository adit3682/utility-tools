import ToolPage from '../pages/ToolPage';
import { tools } from '../config/tools.config';

export function meta({ params }) {
  const tool = tools.find((t) => t.id === params.toolId);

  if (!tool) {
    return [{ title: 'Tool Tidak Ditemukan — UtilityTools' }];
  }

  const title = `${tool.name} — UtilityTools`;

  return [
    { title },
    { name: 'description', content: tool.description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: tool.description },
    { property: 'og:type', content: 'website' },
  ];
}

export default ToolPage;