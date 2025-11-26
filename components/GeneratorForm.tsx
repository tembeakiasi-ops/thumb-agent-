import React, { useState, useEffect } from 'react';
import { AssetType, AspectRatio } from '../types';
import { Wand2, Loader2, Type } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface GeneratorFormProps {
  currentType: AssetType;
  onImageGenerated: (imageUrl: string, prompt: string, ratio: AspectRatio, title?: string) => void;
}

const STYLE_PRESETS = [
  "Modern & Minimalist",
  "Cyberpunk & Neon",
  "Vintage & Retro",
  "Corporate & Professional",
  "3D Render & Glossy",
  "Hand Drawn & Artistic",
  "Abstract & Geometric",
  "Luxury & Elegant"
];

const GeneratorForm: React.FC<GeneratorFormProps> = ({ currentType, onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default aspect ratio based on type
  useEffect(() => {
    switch (currentType) {
      case AssetType.LOGO:
      case AssetType.SOCIAL_POST:
        setAspectRatio(AspectRatio.SQUARE);
        break;
      case AssetType.THUMBNAIL:
      case AssetType.BANNER:
        setAspectRatio(AspectRatio.LANDSCAPE);
        break;
      case AssetType.SOCIAL_STORY:
        setAspectRatio(AspectRatio.PORTRAIT);
        break;
    }
  }, [currentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !title.trim()) {
      setError("Please enter a title or a description.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, currentType, style, aspectRatio, title);
      // If prompt was empty, we can use a generated default for display or just keep empty
      // We pass the actual inputs back
      onImageGenerated(imageUrl, prompt, aspectRatio, title);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = prompt.trim().length > 0 || title.trim().length > 0;

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 shadow-xl">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{currentType} Generator</h2>
        <p className="text-gray-400 text-sm">Create {currentType.toLowerCase()}s with AI. Add a title to render text.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
            <Type size={16} className="text-blue-400" />
            Title / Text Overlay <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., "DesignGenius", "Summer Sale", "Episode 1"'
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-base md:text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Prompt {title && <span className="text-gray-500 font-normal">(Optional if title is set)</span>}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={title 
              ? `Add details about styles, colors, or icons...` 
              : `Describe your ${currentType.toLowerCase()}... (e.g., "A futuristic brand icon with a rocket")`}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-base md:text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Visual Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 md:p-2.5 text-base md:text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {STYLE_PRESETS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 md:p-2.5 text-base md:text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value={AspectRatio.SQUARE}>1:1 (Square)</option>
              <option value={AspectRatio.LANDSCAPE}>16:9 (Landscape)</option>
              <option value={AspectRatio.PORTRAIT}>9:16 (Portrait)</option>
              <option value={AspectRatio.STANDARD_PORTRAIT}>3:4 (Standard Portrait)</option>
              <option value={AspectRatio.STANDARD_LANDSCAPE}>4:3 (Standard Landscape)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-200 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating || !isFormValid}
          className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg font-semibold text-white transition-all duration-200 touch-manipulation
            ${isGenerating || !isFormValid
              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-900/20 active:scale-95'
            }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate {currentType}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GeneratorForm;