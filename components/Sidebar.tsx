import React from 'react';
import { AssetType } from '../types';
import { Layout, Image, Crop, Smartphone, Monitor } from 'lucide-react';

interface SidebarProps {
  currentType: AssetType;
  onSelectType: (type: AssetType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentType, onSelectType }) => {
  const menuItems = [
    { type: AssetType.LOGO, icon: <Crop size={20} />, label: 'Logo Generator' },
    { type: AssetType.THUMBNAIL, icon: <Image size={20} />, label: 'Thumbnail Creator' },
    { type: AssetType.BANNER, icon: <Layout size={20} />, label: 'Web Banners' },
    { type: AssetType.SOCIAL_POST, icon: <Monitor size={20} />, label: 'Social Posts' },
    { type: AssetType.SOCIAL_STORY, icon: <Smartphone size={20} />, label: 'Stories & Reels' },
  ];

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          DesignGenius AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Powered by Gemini</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.type}>
              <button
                onClick={() => onSelectType(item.type)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  currentType === item.type
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500">
          <p>Create unlimited assets for your brand identity.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;