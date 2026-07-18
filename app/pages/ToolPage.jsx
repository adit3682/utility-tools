import { Suspense } from 'react';
import { useParams, Navigate } from 'react-router';
import { tools } from '../config/tools.config';

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return <Navigate to="/" replace />;

  const ToolComponent = tool.component;

  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Memuat tool...</div>}>
      <ToolComponent />
    </Suspense>
  );
}