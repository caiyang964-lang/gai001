import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-black/60 hover:text-[var(--color-accent)] transition-colors mb-8 group w-fit"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm tracking-widest font-medium">返回</span>
    </button>
  );
}
