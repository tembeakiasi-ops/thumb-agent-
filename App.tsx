import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import GeneratorForm from './components/GeneratorForm';
import RecentGallery from './components/RecentGallery';
import { AssetType, GeneratedAsset, AspectRatio } from './types';
import { Download, X, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentType, setCurrentType] = useState<AssetType>(AssetType.LOGO);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Ref to scroll to results on mobile
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleImageGenerated = (imageUrl: string, prompt: string, aspectRatio: AspectRatio, title?: string) => {
    const newAsset: GeneratedAsset = {
      id: Date.now().toString(),
      type: currentType,
      prompt,
      title, // Store the title
      imageUrl,
      createdAt: Date.now(),
      aspectRatio,
    };
    setAssets((prev) => [newAsset, ...prev]);
    setSelectedAsset(newAsset);
    
    // On mobile, scroll to results after generation
    if (window.innerWidth < 1024 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }
  };

  const handleDownload = (imageUrl: string, filenamePrefix: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filenamePrefix}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Drawer & Desktop Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${
        mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
         <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-800">
              <span className="font-bold text-lg text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <Sidebar 
              currentType={currentType} 
              onSelectType={(type) => {
                setCurrentType(type);
                setMobileMenuOpen(false);
                setSelectedAsset(null);
              }} 
            />
         </div>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3 md:gap-4">
             <button 
               className="md:hidden text-gray-300 hover:text-white p-1"
               onClick={() => setMobileMenuOpen(true)}
               aria-label="Open menu"
             >
               <Menu size={24} />
             </button>
             <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <h2 className="text-base md:text-lg font-semibold text-gray-100">
                  {mobileMenuOpen ? 'DesignGenius' : <span className="hidden md:inline">Workspace / </span>}
                  <span className="text-blue-400 md:hidden block md:inline text-sm md:text-lg">{currentType}</span>
                  <span className="text-blue-400 hidden md:inline">{currentType}</span>
                </h2>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-blue-600/20 text-blue-400 text-[10px] md:text-xs px-2 py-1 rounded border border-blue-600/30 font-medium">
               Pro Model Active
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Generator Form */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              <GeneratorForm 
                currentType={currentType} 
                onImageGenerated={handleImageGenerated} 
              />
            </div>

            {/* Right Column: Preview & History */}
            <div ref={resultsRef} className="lg:col-span-7 space-y-6 md:space-y-8 scroll-mt-20">
              {selectedAsset ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl animate-fade-in">
                  <div className="p-3 md:p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/80">
                    <h3 className="font-medium text-white text-sm md:text-base">Result Preview</h3>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setSelectedAsset(null)}
                        className="text-gray-400 hover:text-white text-xs md:text-sm px-2 py-1"
                      >
                        Close
                      </button>
                      <button 
                        onClick={() => handleDownload(selectedAsset.imageUrl, selectedAsset.type)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="relative bg-gray-900/50 flex items-center justify-center p-4 min-h-[250px] md:min-h-[400px]">
                    <img 
                      src={selectedAsset.imageUrl} 
                      alt={selectedAsset.prompt} 
                      className="max-w-full max-h-[400px] md:max-h-[500px] rounded shadow-lg object-contain"
                    />
                  </div>
                  <div className="p-3 md:p-4 bg-gray-900/30 border-t border-gray-800">
                    {selectedAsset.title && (
                       <p className="text-white font-medium mb-1 text-sm md:text-base">"{selectedAsset.title}"</p>
                    )}
                    <p className="text-xs md:text-sm text-gray-400 italic line-clamp-2 md:line-clamp-none">
                      {selectedAsset.prompt || <span className="text-gray-600">No prompt provided (Title only)</span>}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-8 md:p-12 text-center h-[250px] md:h-[300px] flex flex-col items-center justify-center text-gray-500">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                     <span className="text-xl md:text-2xl">✨</span>
                  </div>
                  <p className="font-medium text-gray-300 text-sm md:text-base">Ready to create</p>
                  <p className="text-xs md:text-sm mt-1 px-4">Enter a title or description and click Generate.</p>
                </div>
              )}

              <RecentGallery 
                assets={assets} 
                onSelect={(asset) => {
                  setSelectedAsset(asset);
                  if (window.innerWidth < 1024 && resultsRef.current) {
                    setTimeout(() => {
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }} 
                onDelete={handleDeleteAsset} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;