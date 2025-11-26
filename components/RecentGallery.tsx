import React from 'react';
import { GeneratedAsset } from '../types';
import { Download, Trash2, Maximize2 } from 'lucide-react';

interface RecentGalleryProps {
  assets: GeneratedAsset[];
  onSelect: (asset: GeneratedAsset) => void;
  onDelete: (id: string) => void;
}

const RecentGallery: React.FC<RecentGalleryProps> = ({ assets, onSelect, onDelete }) => {
  if (assets.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-800 rounded-xl p-8 text-center mt-6">
        <p className="text-gray-500">No generated assets yet. Start creating!</p>
      </div>
    );
  }

  const handleDownload = (e: React.MouseEvent, asset: GeneratedAsset) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = asset.imageUrl;
    link.download = `${asset.type.toLowerCase().replace(' ', '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="bg-blue-600 w-1.5 h-6 rounded-full mr-3"></span>
        Recent Creations
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelect(asset)}
            className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800 cursor-pointer hover:border-blue-500 transition-all duration-200"
          >
            <img
              src={asset.imageUrl}
              alt={asset.prompt}
              className="w-full h-full object-cover"
            />
            {/* Overlay: Always visible on mobile, hover on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/60 md:bg-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2 md:p-3">
              <p className="text-xs text-white line-clamp-2 mb-2 hidden md:block">
                {asset.title ? <span className="font-bold">"{asset.title}"</span> : asset.prompt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-300 md:text-gray-400 bg-black/40 md:bg-gray-800/80 px-1.5 py-0.5 rounded">{asset.type}</span>
                <div className="flex space-x-1.5 md:space-x-2">
                  <button
                    onClick={(e) => handleDownload(e, asset)}
                    className="p-1.5 bg-gray-800/80 md:bg-gray-700 hover:bg-blue-600 rounded-full text-white transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, asset.id)}
                    className="p-1.5 bg-gray-800/80 md:bg-gray-700 hover:bg-red-600 rounded-full text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGallery;