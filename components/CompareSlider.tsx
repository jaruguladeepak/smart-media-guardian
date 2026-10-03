import { useState, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface CompareSliderProps {
 originalSrc: string;
 transformedSrc: string;
 isVideo?: boolean;
}

export default function CompareSlider({ originalSrc, transformedSrc, isVideo }: CompareSliderProps) {
 const [position, setPosition] = useState(50);
 const containerRef = useRef<HTMLDivElement>(null);

 const handleMove = (clientX: number) => {
 if (containerRef.current) {
 const rect = containerRef.current.getBoundingClientRect();
 const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
 const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));
 setPosition(percentage);
 }
 };

 const onMouseMove = (e: ReactMouseEvent) => {
 if (e.buttons === 1) handleMove(e.clientX);
 };

 const onTouchMove = (e: ReactTouchEvent) => {
 handleMove(e.touches[0].clientX);
 };

 return (
 <div 
 ref={containerRef}
 className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-xl bg-slate-50 select-none cursor-ew-resize group"
 onMouseMove={onMouseMove}
 onTouchMove={onTouchMove}
 onClick={(e) => handleMove(e.clientX)}
 >
 {/* Transformed Image (Background) */}
 <div className="absolute inset-0 w-full h-full">
 {isVideo ? (
 <video src={transformedSrc} autoPlay loop muted playsInline className="w-full h-full object-contain" />
 ) : (
 <img src={transformedSrc} alt="Transformed" className="w-full h-full object-contain pointer-events-none" draggable={false} />
 )}
 </div>

 {/* Original Image (Foreground, clipped) */}
 <div 
 className="absolute inset-0 w-full h-full overflow-hidden"
 style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
 >
 {isVideo ? (
 <video src={originalSrc} autoPlay loop muted playsInline className="w-full h-full object-contain" />
 ) : (
 <img src={originalSrc} alt="Original" className="w-full h-full object-contain pointer-events-none" draggable={false} />
 )}
 </div>

 {/* Slider Line */}
 <div 
 className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
 style={{ left: `${position}%` }}
 >
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
 <ArrowLeftRight className="w-4 h-4 text-slate-800" />
 </div>
 </div>

 {/* Labels */}
 <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-md text-slate-900 text-xs font-medium px-2 py-1 rounded shadow-sm z-20 pointer-events-none">
 Original
 </div>
 <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-md text-slate-900 text-xs font-medium px-2 py-1 rounded shadow-sm z-20 pointer-events-none">
 Optimized
 </div>
 </div>
 );
}
