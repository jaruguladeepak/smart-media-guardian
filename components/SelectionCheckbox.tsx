import { Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface SelectionCheckboxProps {
 publicId: string;
}

export default function SelectionCheckbox({ publicId }: SelectionCheckboxProps) {
 const { selectedItems, toggleSelection } = useAppStore();
 const isSelected = selectedItems.includes(publicId);

 return (
 <div 
 onClick={(e) => {
 e.stopPropagation();
 toggleSelection(publicId);
 }}
 className={`absolute top-3 left-3 z-20 w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
 isSelected 
 ? 'bg-indigo-600 border-indigo-600 text-slate-900' 
 : 'bg-white/20 border-white/70 text-transparent hover:bg-white/40 hover:border-white'
 }`}
 >
 <Check className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
 </div>
 );
}
