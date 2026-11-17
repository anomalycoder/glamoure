import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Save, 
  Copy, 
  Check, 
  Sliders, 
  Maximize2, 
  Minimize2
} from 'lucide-react';
import type { 
  ServicesDesignConfig 
} from '../../types/services-design';

interface ServicesDesignStudioProps {
  config: ServicesDesignConfig;
  onChange: (newConfig: ServicesDesignConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
  onSave: () => void;
  onReset: () => void;
}

export const ServicesDesignStudio: React.FC<ServicesDesignStudioProps> = ({
  config,
  onChange,
  isOpen,
  onToggle,
  onSave,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'header' | 'hair' | 'skin' | 'nails' | 'spa' | 'stack'>('header');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    showToast('✓ Configuration copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const updateHeader = (updates: Partial<ServicesDesignConfig['header']>) => {
    onChange({
      ...config,
      header: { ...config.header, ...updates },
    });
  };

  const updateHair = (updates: Partial<ServicesDesignConfig['hair']>) => {
    onChange({
      ...config,
      hair: { ...config.hair, ...updates },
    });
  };

  const updateSkin = (updates: Partial<ServicesDesignConfig['skin']>) => {
    onChange({
      ...config,
      skin: { ...config.skin, ...updates },
    });
  };

  const updateNails = (updates: Partial<ServicesDesignConfig['nails']>) => {
    onChange({
      ...config,
      nails: { ...config.nails, ...updates },
    });
  };

  const updateSpa = (updates: Partial<ServicesDesignConfig['spa']>) => {
    onChange({
      ...config,
      spa: { ...config.spa, ...updates },
    });
  };

  const updateStack = (updates: Partial<ServicesDesignConfig['stack']>) => {
    onChange({
      ...config,
      stack: { ...config.stack, ...updates },
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="group flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#241812]/95 hover:bg-[#34241c] text-[#fbf7f2] border border-[#e7c19a]/40 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs uppercase tracking-wider font-medium"
        >
          <Sliders className="w-4 h-4 text-[#e7c19a] group-hover:rotate-45 transition-transform" />
          <span>Edit Section 2</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className="mb-2 px-4 py-2 bg-[#241812] text-[#e7c19a] border border-[#e7c19a]/50 text-xs rounded-lg shadow-xl animate-fade-in font-medium">
          {toast}
        </div>
      )}

      {/* Main Studio Window */}
      <div 
        className={`bg-[#1c1613]/95 backdrop-blur-xl border border-[#e7c19a]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-[#ded3c7] transition-all duration-300 flex flex-col overflow-hidden ${
          isMinimized ? 'w-[320px] h-[58px]' : 'w-[380px] sm:w-[420px] max-h-[85vh] h-[640px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#15100e] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#e7c19a]" />
            <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold tracking-wider uppercase text-white">
              Section 2 Design Studio
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center overflow-x-auto border-b border-white/10 bg-[#171210] px-2 py-1.5 gap-1 text-[11px] font-medium shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('header')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'header' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Header & Text
              </button>
              <button
                onClick={() => setActiveTab('hair')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'hair' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Hair Arch
              </button>
              <button
                onClick={() => setActiveTab('skin')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'skin' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Skin Card
              </button>
              <button
                onClick={() => setActiveTab('nails')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'nails' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Nails Card
              </button>
              <button
                onClick={() => setActiveTab('spa')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'spa' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Spa Card
              </button>
              <button
                onClick={() => setActiveTab('stack')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'stack' 
                    ? 'bg-[#e7c19a]/20 text-[#e7c19a] font-semibold' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Stack & Gap
              </button>
            </div>

            {/* Scrollable Controls Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* TAB 1: HEADER & TYPOGRAPHY */}
              {activeTab === 'header' && (
                <div className="space-y-4">
                  {/* Eyebrow */}
                  <div className="space-y-1.5">
                    <label className="text-white/70 uppercase tracking-wider text-[10px]">Eyebrow Text</label>
                    <input
                      type="text"
                      value={config.header.eyebrow}
                      onChange={(e) => updateHeader({ eyebrow: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#e7c19a] outline-none"
                    />
                  </div>

                  {/* Heading Line 1 */}
                  <div className="space-y-1.5">
                    <label className="text-white/70 uppercase tracking-wider text-[10px]">Heading Line 1 (wrap in {} for swash)</label>
                    <input
                      type="text"
                      value={config.header.line1}
                      onChange={(e) => updateHeader({ line1: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#e7c19a] outline-none"
                    />
                  </div>

                  {/* Heading Line 2 */}
                  <div className="space-y-1.5">
                    <label className="text-white/70 uppercase tracking-wider text-[10px]">Heading Line 2</label>
                    <input
                      type="text"
                      value={config.header.line2}
                      onChange={(e) => updateHeader({ line2: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#e7c19a] outline-none"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-white/70 text-[10px]">
                      <span>Heading Font Size</span>
                      <span className="text-[#e7c19a] font-mono">{config.header.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={72}
                      value={config.header.fontSize}
                      onChange={(e) => updateHeader({ fontSize: Number(e.target.value) })}
                      className="w-full accent-[#e7c19a] cursor-pointer"
                    />
                  </div>

                  {/* Flourish Scale Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-white/70 text-[10px]">
                      <span>Script Swash Scale</span>
                      <span className="text-[#e7c19a] font-mono">{config.header.flourishScale}x</span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={2.0}
                      step={0.05}
                      value={config.header.flourishScale}
                      onChange={(e) => updateHeader({ flourishScale: Number(e.target.value) })}
                      className="w-full accent-[#e7c19a] cursor-pointer"
                    />
                  </div>

                  {/* Subheader */}
                  <div className="space-y-1.5">
                    <label className="text-white/70 uppercase tracking-wider text-[10px]">Subheader Text</label>
                    <textarea
                      rows={2}
                      value={config.header.subheaderText}
                      onChange={(e) => updateHeader({ subheaderText: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#e7c19a] outline-none resize-none"
                    />
                  </div>

                  {/* Button Text */}
                  <div className="space-y-1.5">
                    <label className="text-white/70 uppercase tracking-wider text-[10px]">Button Text</label>
                    <input
                      type="text"
                      value={config.header.buttonText}
                      onChange={(e) => updateHeader({ buttonText: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#e7c19a] outline-none"
                    />
                  </div>

                  {/* Header X / Y Offsets */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Position X</span>
                        <span className="text-[#e7c19a] font-mono">{config.header.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-80}
                        max={80}
                        value={config.header.x}
                        onChange={(e) => updateHeader({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Position Y</span>
                        <span className="text-[#e7c19a] font-mono">{config.header.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={60}
                        value={config.header.y}
                        onChange={(e) => updateHeader({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HAIR ARCH COMPONENT */}
              {activeTab === 'hair' && (
                <div className="space-y-4">
                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Title</label>
                      <input
                        type="text"
                        value={config.hair.title}
                        onChange={(e) => updateHair({ title: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Subtitle</label>
                      <input
                        type="text"
                        value={config.hair.subtitle}
                        onChange={(e) => updateHair({ subtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Width & Height */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Width</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={180}
                        max={380}
                        value={config.hair.width}
                        onChange={(e) => updateHair({ width: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Height</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.height}px</span>
                      </div>
                      <input
                        type="range"
                        min={300}
                        max={620}
                        value={config.hair.height}
                        onChange={(e) => updateHair({ height: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>

                  {/* Placements */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Hair X Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={config.hair.x}
                        onChange={(e) => updateHair({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Hair Y Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-80}
                        max={80}
                        value={config.hair.y}
                        onChange={(e) => updateHair({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>

                  {/* Corner Rounding Controls */}
                  <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-3">
                    <span className="block text-white/80 font-medium text-[11px]">Rounding (Border Radius)</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Top Vault Arch</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.topRadius > 500 ? 'Full Arch' : `${config.hair.topRadius}px`}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={9999}
                        step={100}
                        value={config.hair.topRadius}
                        onChange={(e) => updateHair({ topRadius: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Bottom Corners</span>
                        <span className="text-[#e7c19a] font-mono">{config.hair.bottomRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        value={config.hair.bottomRadius}
                        onChange={(e) => updateHair({ bottomRadius: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SKIN COMPONENT (4 INDEPENDENT CORNER RADII) */}
              {activeTab === 'skin' && (
                <div className="space-y-4">
                  {/* Text */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Title</label>
                      <input
                        type="text"
                        value={config.skin.title}
                        onChange={(e) => updateSkin({ title: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Subtitle</label>
                      <input
                        type="text"
                        value={config.skin.subtitle}
                        onChange={(e) => updateSkin({ subtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Width & Height */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Width</span>
                        <span className="text-[#e7c19a] font-mono">{config.skin.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={140}
                        max={340}
                        value={config.skin.width}
                        onChange={(e) => updateSkin({ width: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Height</span>
                        <span className="text-[#e7c19a] font-mono">{config.skin.height}px</span>
                      </div>
                      <input
                        type="range"
                        min={90}
                        max={260}
                        value={config.skin.height}
                        onChange={(e) => updateSkin({ height: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>

                  {/* 4 INDEPENDENT CORNER RADII */}
                  <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-2.5">
                    <span className="block text-white/80 font-medium text-[11px]">Corner Rounding (Each Corner)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Left</span>
                          <span className="text-[#e7c19a] font-mono">{config.skin.radius.tl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.skin.radius.tl}
                          onChange={(e) => updateSkin({ radius: { ...config.skin.radius, tl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.skin.radius.tr}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={60}
                          value={config.skin.radius.tr}
                          onChange={(e) => updateSkin({ radius: { ...config.skin.radius, tr: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Left</span>
                          <span className="text-[#e7c19a] font-mono">{config.skin.radius.bl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.skin.radius.bl}
                          onChange={(e) => updateSkin({ radius: { ...config.skin.radius, bl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.skin.radius.br}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.skin.radius.br}
                          onChange={(e) => updateSkin({ radius: { ...config.skin.radius, br: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Offset X & Y */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Skin X Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.skin.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={config.skin.x}
                        onChange={(e) => updateSkin({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Skin Y Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.skin.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-80}
                        max={80}
                        value={config.skin.y}
                        onChange={(e) => updateSkin({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: NAILS COMPONENT */}
              {activeTab === 'nails' && (
                <div className="space-y-4">
                  {/* Text */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Title</label>
                      <input
                        type="text"
                        value={config.nails.title}
                        onChange={(e) => updateNails({ title: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Subtitle</label>
                      <input
                        type="text"
                        value={config.nails.subtitle}
                        onChange={(e) => updateNails({ subtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Width & Height */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Width</span>
                        <span className="text-[#e7c19a] font-mono">{config.nails.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={140}
                        max={340}
                        value={config.nails.width}
                        onChange={(e) => updateNails({ width: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Height</span>
                        <span className="text-[#e7c19a] font-mono">{config.nails.height}px</span>
                      </div>
                      <input
                        type="range"
                        min={90}
                        max={260}
                        value={config.nails.height}
                        onChange={(e) => updateNails({ height: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>

                  {/* 4 INDEPENDENT CORNER RADII */}
                  <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-2.5">
                    <span className="block text-white/80 font-medium text-[11px]">Corner Rounding (Each Corner)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Left</span>
                          <span className="text-[#e7c19a] font-mono">{config.nails.radius.tl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.nails.radius.tl}
                          onChange={(e) => updateNails({ radius: { ...config.nails.radius, tl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.nails.radius.tr}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={60}
                          value={config.nails.radius.tr}
                          onChange={(e) => updateNails({ radius: { ...config.nails.radius, tr: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Left</span>
                          <span className="text-[#e7c19a] font-mono">{config.nails.radius.bl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.nails.radius.bl}
                          onChange={(e) => updateNails({ radius: { ...config.nails.radius, bl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.nails.radius.br}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.nails.radius.br}
                          onChange={(e) => updateNails({ radius: { ...config.nails.radius, br: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Offset X & Y */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Nails X Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.nails.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={config.nails.x}
                        onChange={(e) => updateNails({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Nails Y Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.nails.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-80}
                        max={80}
                        value={config.nails.y}
                        onChange={(e) => updateNails({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SPA COMPONENT */}
              {activeTab === 'spa' && (
                <div className="space-y-4">
                  {/* Text */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Title</label>
                      <input
                        type="text"
                        value={config.spa.title}
                        onChange={(e) => updateSpa({ title: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/70 uppercase tracking-wider text-[10px]">Subtitle</label>
                      <input
                        type="text"
                        value={config.spa.subtitle}
                        onChange={(e) => updateSpa({ subtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Width & Height */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Width</span>
                        <span className="text-[#e7c19a] font-mono">{config.spa.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={120}
                        max={300}
                        value={config.spa.width}
                        onChange={(e) => updateSpa({ width: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Height</span>
                        <span className="text-[#e7c19a] font-mono">{config.spa.height}px</span>
                      </div>
                      <input
                        type="range"
                        min={150}
                        max={400}
                        value={config.spa.height}
                        onChange={(e) => updateSpa({ height: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>

                  {/* 4 INDEPENDENT CORNER RADII */}
                  <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-2.5">
                    <span className="block text-white/80 font-medium text-[11px]">Corner Rounding (Each Corner)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Left (Arch Curve)</span>
                          <span className="text-[#e7c19a] font-mono">{config.spa.radius.tl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={70}
                          value={config.spa.radius.tl}
                          onChange={(e) => updateSpa({ radius: { ...config.spa.radius, tl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Top-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.spa.radius.tr}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.spa.radius.tr}
                          onChange={(e) => updateSpa({ radius: { ...config.spa.radius, tr: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Left</span>
                          <span className="text-[#e7c19a] font-mono">{config.spa.radius.bl}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={60}
                          value={config.spa.radius.bl}
                          onChange={(e) => updateSpa({ radius: { ...config.spa.radius, bl: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/70 mb-1">
                          <span>Bottom-Right</span>
                          <span className="text-[#e7c19a] font-mono">{config.spa.radius.br}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={config.spa.radius.br}
                          onChange={(e) => updateSpa({ radius: { ...config.spa.radius, br: Number(e.target.value) } })}
                          className="w-full accent-[#e7c19a]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Offset X & Y */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Spa X Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.spa.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={config.spa.x}
                        onChange={(e) => updateSpa({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Spa Y Offset (Elevation)</span>
                        <span className="text-[#e7c19a] font-mono">{config.spa.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={40}
                        value={config.spa.y}
                        onChange={(e) => updateSpa({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RIGHT STACK & GLOBAL GAP */}
              {activeTab === 'stack' && (
                <div className="space-y-4">
                  <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-3">
                    <span className="block text-white/80 font-medium text-[11px]">Right Stack (Skin & Nails) Master Offsets</span>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Vertical Elevation (Align with Spa: -36px)</span>
                        <span className="text-[#e7c19a] font-mono">{config.stack.y}px</span>
                      </div>
                      <input
                        type="range"
                        min={-240}
                        max={40}
                        value={config.stack.y}
                        onChange={(e) => updateStack({ y: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Horizontal Offset</span>
                        <span className="text-[#e7c19a] font-mono">{config.stack.x}px</span>
                      </div>
                      <input
                        type="range"
                        min={-80}
                        max={80}
                        value={config.stack.x}
                        onChange={(e) => updateStack({ x: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-white/70 text-[10px]">
                        <span>Gap Between Skin & Nails</span>
                        <span className="text-[#e7c19a] font-mono">{config.stack.gap}px</span>
                      </div>
                      <input
                        type="range"
                        min={4}
                        max={36}
                        value={config.stack.gap}
                        onChange={(e) => updateStack({ gap: Number(e.target.value) })}
                        className="w-full accent-[#e7c19a]"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-3 bg-[#15100e] border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => {
                  onReset();
                  showToast('↺ Restored to perfect defaults');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-[11px] transition-colors"
                title="Reset to default layout"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-[11px] transition-colors"
                  title="Copy JSON configuration"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => {
                    onSave();
                    showToast('✓ Saved! Stored permanently in your browser');
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#e7c19a] hover:bg-[#d8b087] text-[#1c1613] font-semibold text-[11px] shadow-md transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
