import { Brain } from 'lucide-react'
import { useState } from 'react';


const backgroundImages = [
  'https://images.unsplash.com/photo-1643106036140-06f32ef8fa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1551778742-5f6acf67d4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1755617804192-d905ba648ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1606516397986-1eeb79e8c052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
];
export default function Navbar() {


    const [currentBgIndex] = useState(Math.floor(Math.random() * backgroundImages.length));

  return (
 <div className="fixed top-0 z-50 w-full bg-slate-900/95 border-b border-slate-800">
    <nav className="container mx-auto flex items-center justify-between p-4">
      
<div className="flex gap-2 items-center">
     <div className="size-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Brain className="size-6 text-white" />
              </div>

    <div className=" items-center gap-2">
      <div className="font-bold text-white">Lingua Hub </div>
      <div className="text-xs text-white/60 text-white">Aprenda. Pratique. Domine.</div>
    </div>
</div>


      <div className="flex gap-4 list-none">
        <li><a href="#" className="text-gray-300 hover:text-white">Inicio</a></li>
        <li><a href="#" className="text-gray-300 hover:text-white">FlashCards</a></li>
        <li><a href="#" className="text-gray-300 hover:text-white">Transcrição</a></li>
        <li><a href="#" className="text-gray-300 hover:text-white">Dicas</a></li>
        <li><a href="#" className="text-gray-300 hover:text-white">Inspiracação</a></li>
      </div>
    </nav>



 </div>
  );
}
//fixed top-0 left-0 right-0 z-50 bg-slate-900/95  border-b border-slate-800