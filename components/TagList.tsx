import { Tag } from 'lucide-react';

interface TagListProps {
 tags: string[];
}

export default function TagList({ tags }: TagListProps) {
 if (!tags || tags.length === 0) {
 return <p className="text-sm text-slate-500 italic">No tags detected</p>;
 }

 return (
 <div className="flex flex-wrap gap-2">
 {tags.map((tag, idx) => (
 <span 
 key={idx} 
 className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 "
 >
 <Tag className="w-3.5 h-3.5 mr-1.5 opacity-70" />
 {tag}
 </span>
 ))}
 </div>
 );
}
