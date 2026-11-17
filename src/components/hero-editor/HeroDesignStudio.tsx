import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Sliders, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Move, 
  Type, 
  Maximize2, 
  Minimize2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Layers,
  Image as ImageIcon,
  Save,
  BookmarkCheck,
} from 'lucide-react';
import { 
  type HeroDesignConfig, 
  FONT_OPTIONS, 
  SCRIPT_FONT_OPTIONS,
  COLOR_PALETTE,
  FONT_PAIRING_PRESETS,
  type FontPairingPreset
} from '../../types/hero-design';

interface HeroDesignStudioProps {
  config: HeroDesignConfig;
  onChange: (newConfig: HeroDesignConfig) => void;
  selectedElement: string | null;
  onSelectElement: (elementKey: string | null) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onReset: () => void;
  onSave: () => void;
}

export const HeroDesignStudio: React.FC<HeroDesignStudioProps> = ({
  config,
  onChange,
  selectedElement,
  onSelectElement,
  isEditMode,
  onToggleEditMode,
  onReset,
  onSave,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'element' | 'background' | 'container' | 'presets'>('element');
  const [notification, setNotification] = useState<string | null>(null);

  // Helper to update deeply nested config values cleanly
  const updateConfig = <T extends keyof HeroDesignConfig>(
    section: T,
    updates: Partial<HeroDesignConfig[T]>
  ) => {
    onChange({
      ...config,
      [section]: {
        ...config[section],
        ...updates,
      },
    });
  };

  const handleSaveClick = () => {
    onSave();
    setNotification('✓ Design Saved! Edits stored permanently in browser');
    setTimeout(() => setNotification(null), 3000);
  };

  const applyFontPairing = (preset: FontPairingPreset) => {
    onChange({
      ...config,
      headlineLine1: {
        ...config.headlineLine1,
        fontFamily: preset.headingFont,
        fontWeight: preset.headingWeight,
        letterSpacing: preset.headingLetterSpacing,
        ...(preset.sampleLine1 ? { text: preset.sampleLine1 } : {}),
      },
      headlineLine2: {
        ...config.headlineLine2,
        fontFamily: preset.headingFont,
        fontWeight: preset.headingWeight,
        letterSpacing: preset.headingLetterSpacing,
        ...(preset.sampleLine2Prefix ? { textPrefix: preset.sampleLine2Prefix } : {}),
        ...(preset.sampleLine2Highlight ? { textHighlight: preset.sampleLine2Highlight } : {}),
      },
      subheader: {
        ...config.subheader,
        fontFamily: preset.subheadingFont,
        fontWeight: preset.subheadingWeight,
        letterSpacing: preset.subheadingLetterSpacing,
      },
      flourish: {
        ...(config.flourish || { enabled: true, scale: 1.40, offsetY: 0, color: '' }),
        scriptFont: preset.flourishFont || config.flourish?.scriptFont || "'Alex Brush', cursive",
      },
    });
    setNotification(`Applied: ${preset.name}`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCopyCSS = () => {
    const cssCode = `/* Glamouré Hero Custom Design */
.hero-container {
  max-width: ${config.container.maxWidth}px;
  transform: translate(${config.container.x}px, ${config.container.y}px);
}
.hero-bg-image {
  transform: translateY(${config.bg.offsetY}px) translateX(${config.bg.offsetX}px) scale(${config.bg.scale / 100});
  object-position: ${config.bg.objectPosX}% ${config.bg.objectPosY}%;
}
.hero-headline-1 {
  font-family: ${config.headlineLine1.fontFamily};
  font-size: ${config.headlineLine1.fontSize}px;
  font-weight: ${config.headlineLine1.fontWeight};
  letter-spacing: ${config.headlineLine1.letterSpacing}px;
  color: ${config.headlineLine1.color};
  transform: translate(${config.headlineLine1.x}px, ${config.headlineLine1.y}px);
}
.hero-headline-2 {
  font-family: ${config.headlineLine2.fontFamily};
  font-size: ${config.headlineLine2.fontSize}px;
  font-weight: ${config.headlineLine2.fontWeight};
  color: ${config.headlineLine2.color};
  transform: translate(${config.headlineLine2.x}px, ${config.headlineLine2.y}px);
}
.hero-subheader {
  font-family: ${config.subheader.fontFamily};
  font-size: ${config.subheader.fontSize}px;
  font-weight: ${config.subheader.fontWeight};
  letter-spacing: ${config.subheader.letterSpacing}px;
  color: ${config.subheader.color};
  transform: translate(${config.subheader.x}px, ${config.subheader.y}px);
}
.hero-primary-btn {
  background-color: ${config.primaryBtn.bgColor};
  color: ${config.primaryBtn.color};
  font-size: ${config.primaryBtn.fontSize}px;
  font-weight: ${config.primaryBtn.fontWeight};
  border-radius: ${config.primaryBtn.borderRadius}px;
  transform: translate(${config.primaryBtn.x}px, ${config.primaryBtn.y}px);
}`;

    navigator.clipboard.writeText(cssCode);
    setNotification('CSS copied to clipboard!');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setNotification('Design JSON copied!');
    setTimeout(() => setNotification(null), 2500);
  };

  // Nudge selected element position
  const nudge = (dx: number, dy: number) => {
    if (!selectedElement) return;

    if (selectedElement === 'bg') {
      updateConfig('bg', {
        offsetX: config.bg.offsetX + dx,
        offsetY: config.bg.offsetY + dy,
      });
      return;
    }

    if (selectedElement === 'container') {
      updateConfig('container', {
        x: config.container.x + dx,
        y: config.container.y + dy,
      });
      return;
    }

    const key = selectedElement as keyof HeroDesignConfig;
    if (config[key] && typeof (config[key] as any).x === 'number') {
      const current = config[key] as any;
      updateConfig(key, {
        x: current.x + dx,
        y: current.y + dy,
      } as any);
    }
  };

  // If edit mode is off, do not render floating button
  if (!isEditMode) {
    return null;
  }

  return (
    <>
      {/* Floating Top Indicator Bar with Direct SAVE Button */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1b1714]/95 backdrop-blur-md border border-[#efc9a5]/40 text-[#f5eee6] flex items-center gap-3 shadow-2xl text-xs font-['DM_Sans'] pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#efc9a5] animate-ping" />
          <span className="font-semibold text-[#efc9a5] uppercase tracking-wider text-[11px]">Hero Design Mode</span>
        </div>
        <span className="text-white/40">|</span>
        <span className="text-white/80 hidden sm:inline text-[11.5px]">Click any text or element to drag &amp; style</span>
        <span className="text-white/40 hidden sm:inline">|</span>

        {/* Top Save Button */}
        <button
          onClick={handleSaveClick}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efc9a5] hover:bg-[#f6d7b8] text-[#241812] font-semibold text-[11.5px] transition-all duration-150 cursor-pointer shadow-[0_0_12px_rgba(239,201,165,0.3)] hover:scale-105"
        >
          <Save className="w-3 h-3 text-[#241812]" />
          <span>Save</span>
        </button>

        <button
          onClick={onToggleEditMode}
          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors cursor-pointer"
        >
          Preview
        </button>
      </div>

      {/* Main Floating Studio Panel */}
      <aside 
        className={`fixed top-18 right-4 sm:right-6 z-50 w-[350px] sm:w-[390px] max-h-[calc(100vh-90px)] flex flex-col bg-[#191512]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#fbf7f2] font-['DM_Sans'] transition-all duration-300 ${
          isCollapsed ? 'h-auto max-h-[64px]' : ''
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#efc9a5]/15 border border-[#efc9a5]/30 flex items-center justify-center text-[#efc9a5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-white">Hero Studio</h2>
              <p className="text-[10px] text-[#efc9a5]/80 font-normal">Full Live Control</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Header Save Button */}
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#efc9a5] hover:bg-[#f6d7b8] text-[#241812] font-semibold text-[11px] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Save changes permanently to browser storage"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onToggleEditMode}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close editor and preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* If collapsed, stop here */}
        {!isCollapsed && (
          <>
            {/* Tabs Navigation */}
            <div className="grid grid-cols-4 border-b border-white/10 text-[11px] font-medium bg-black/20">
              <button
                onClick={() => setActiveTab('element')}
                className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'element'
                    ? 'border-[#efc9a5] text-[#efc9a5] bg-white/[0.04]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Text / Style</span>
              </button>

              <button
                onClick={() => setActiveTab('background')}
                className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'background'
                    ? 'border-[#efc9a5] text-[#efc9a5] bg-white/[0.04]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Background</span>
              </button>

              <button
                onClick={() => setActiveTab('container')}
                className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'container'
                    ? 'border-[#efc9a5] text-[#efc9a5] bg-white/[0.04]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layout</span>
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2.5 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'presets'
                    ? 'border-[#efc9a5] text-[#efc9a5] bg-white/[0.04]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Presets / Save</span>
              </button>
            </div>

            {/* Notification toast */}
            {notification && (
              <div className="px-3 py-2 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 text-[11px] flex items-center justify-between animate-fadeIn">
                <span className="font-medium">{notification}</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}

            {/* Tab Contents: Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs max-h-[calc(100vh-270px)] custom-scrollbar">

              {/* ══════════════════════════════════════════════════════
                  TAB 1: ELEMENT (Typography, Colors, Position)
              ══════════════════════════════════════════════════════ */}
              {activeTab === 'element' && (
                <div className="space-y-4">

                  {/* Element Selector Dropdown */}
                  <div>
                    <label className="block text-[11px] text-white/60 uppercase tracking-wider font-semibold mb-1.5">
                      Select Screen Element To Edit:
                    </label>
                    <select
                      value={selectedElement || 'headlineLine1'}
                      onChange={(e) => onSelectElement(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-[#efc9a5]/40 rounded-lg text-white text-xs font-medium focus:outline-none focus:border-[#efc9a5]"
                    >
                      <option value="headlineLine1">Headline (Line 1): "{config.headlineLine1.text}"</option>
                      <option value="headlineLine2">Headline (Line 2): "{config.headlineLine2.textPrefix}{config.headlineLine2.textHighlight}"</option>
                      <option value="subheader">Subheader / Description</option>
                      <option value="primaryBtn">Primary Button: "{config.primaryBtn.text}"</option>
                      <option value="secondaryBtn">Secondary Button: "{config.secondaryBtn.text}"</option>
                      <option value="logo">Brand Logo & Subtitle: "{config.logo.text}"</option>
                      <option value="nav">Navigation Links (4 Links)</option>
                      <option value="headerBtn">Header Book Button: "{config.headerBtn.text}"</option>
                      <option value="servicesStrip">4 Services Strip (Hair, Skin, Nails, Spa)</option>
                      <option value="flourish">Flourish &amp; Swash Calligraphy Settings</option>
                    </select>
                  </div>

                  {/* Nudge / Direct Position Control */}
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#efc9a5] uppercase tracking-wider flex items-center gap-1.5">
                        <Move className="w-3.5 h-3.5" /> Position &amp; Placement (X / Y)
                      </span>
                      <span className="text-[10px] text-white/40">Drag directly or nudge</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => nudge(-5, 0)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer"
                        title="Nudge Left (-5px)"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => nudge(0, -5)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer"
                          title="Nudge Up (-5px)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => nudge(0, 5)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer"
                          title="Nudge Down (+5px)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => nudge(5, 0)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer"
                        title="Nudge Right (+5px)"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Numeric X & Y display & reset */}
                    {selectedElement && config[selectedElement as keyof HeroDesignConfig] && (
                      <div className="flex items-center justify-between text-[11px] text-white/60 pt-1">
                        <span>X: {(config[selectedElement as keyof HeroDesignConfig] as any).x || 0}px</span>
                        <span>Y: {(config[selectedElement as keyof HeroDesignConfig] as any).y || 0}px</span>
                        <button
                          onClick={() => {
                            const key = selectedElement as keyof HeroDesignConfig;
                            updateConfig(key, { x: 0, y: 0 } as any);
                          }}
                          className="text-[10px] text-[#efc9a5] hover:underline cursor-pointer"
                        >
                          Reset Pos
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ─────────────────── HEADLINE LINE 1 ─────────────────── */}
                  {(!selectedElement || selectedElement === 'headlineLine1') && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Headline Line 1</span>
                        <button
                          onClick={() => updateConfig('headlineLine1', { visible: !config.headlineLine1.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.headlineLine1.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Text Content (Use {'{W}'} for swashes):</label>
                        <input
                          type="text"
                          value={config.headlineLine1.text}
                          onChange={(e) => updateConfig('headlineLine1', { text: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.headlineLine1.fontFamily}
                          onChange={(e) => updateConfig('headlineLine1', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size & Weight */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.headlineLine1.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="24"
                            max="96"
                            step="1"
                            value={config.headlineLine1.fontSize}
                            onChange={(e) => updateConfig('headlineLine1', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Weight:</span>
                            <span className="text-white font-mono">{config.headlineLine1.fontWeight}</span>
                          </div>
                          <select
                            value={config.headlineLine1.fontWeight}
                            onChange={(e) => updateConfig('headlineLine1', { fontWeight: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          >
                            <option value="300">300 (Light)</option>
                            <option value="400">400 (Regular)</option>
                            <option value="500">500 (Medium)</option>
                            <option value="600">600 (Semi-Bold)</option>
                            <option value="700">700 (Bold)</option>
                            <option value="800">800 (Extra-Bold)</option>
                          </select>
                        </div>
                      </div>

                      {/* Letter Spacing & Color */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Spacing:</span>
                            <span className="text-white font-mono">{config.headlineLine1.letterSpacing}px</span>
                          </div>
                          <input
                            type="range"
                            min="-1"
                            max="15"
                            step="0.5"
                            value={config.headlineLine1.letterSpacing}
                            onChange={(e) => updateConfig('headlineLine1', { letterSpacing: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Color:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.headlineLine1.color.startsWith('#') ? config.headlineLine1.color : '#ffffff'}
                              onChange={(e) => updateConfig('headlineLine1', { color: e.target.value })}
                              className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white/70">{config.headlineLine1.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── HEADLINE LINE 2 ─────────────────── */}
                  {selectedElement === 'headlineLine2' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Headline Line 2</span>
                        <button
                          onClick={() => updateConfig('headlineLine2', { visible: !config.headlineLine2.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.headlineLine2.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Text Prefix:</label>
                          <input
                            type="text"
                            value={config.headlineLine2.textPrefix}
                            onChange={(e) => updateConfig('headlineLine2', { textPrefix: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#efc9a5] block mb-1">Highlight / Swash Word:</label>
                          <input
                            type="text"
                            value={config.headlineLine2.textHighlight}
                            onChange={(e) => updateConfig('headlineLine2', { textHighlight: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-[#efc9a5]/40 rounded text-[#efc9a5] text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.headlineLine2.fontFamily}
                          onChange={(e) => updateConfig('headlineLine2', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size & Weight */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.headlineLine2.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="24"
                            max="96"
                            step="1"
                            value={config.headlineLine2.fontSize}
                            onChange={(e) => updateConfig('headlineLine2', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Weight:</span>
                            <span className="text-white font-mono">{config.headlineLine2.fontWeight}</span>
                          </div>
                          <select
                            value={config.headlineLine2.fontWeight}
                            onChange={(e) => updateConfig('headlineLine2', { fontWeight: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          >
                            <option value="300">300 (Light)</option>
                            <option value="400">400 (Regular)</option>
                            <option value="500">500 (Medium)</option>
                            <option value="600">600 (Semi-Bold)</option>
                          </select>
                        </div>
                      </div>

                      {/* Highlight Color & Italic */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Highlight Color:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.headlineLine2.highlightColor.startsWith('#') ? config.headlineLine2.highlightColor : '#ffffff'}
                              onChange={(e) => updateConfig('headlineLine2', { highlightColor: e.target.value })}
                              className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-[#efc9a5]">{config.headlineLine2.highlightColor}</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-end">
                          <label className="flex items-center gap-2 text-white/80 cursor-pointer text-[11px]">
                            <input
                              type="checkbox"
                              checked={config.headlineLine2.highlightItalic}
                              onChange={(e) => updateConfig('headlineLine2', { highlightItalic: e.target.checked })}
                              className="rounded accent-[#efc9a5]"
                            />
                            <span>Italic Accent</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── SUBHEADER ─────────────────── */}
                  {selectedElement === 'subheader' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Subheader / Description</span>
                        <button
                          onClick={() => updateConfig('subheader', { visible: !config.subheader.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.subheader.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Text:</label>
                        <textarea
                          rows={2}
                          value={config.subheader.text}
                          onChange={(e) => updateConfig('subheader', { text: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.subheader.fontFamily}
                          onChange={(e) => updateConfig('subheader', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.subheader.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            step="0.5"
                            value={config.subheader.fontSize}
                            onChange={(e) => updateConfig('subheader', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Weight:</span>
                            <span className="text-white font-mono">{config.subheader.fontWeight}</span>
                          </div>
                          <select
                            value={config.subheader.fontWeight}
                            onChange={(e) => updateConfig('subheader', { fontWeight: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          >
                            <option value="300">300 (Light)</option>
                            <option value="400">400 (Regular)</option>
                            <option value="500">500 (Medium)</option>
                            <option value="600">600 (Semi-Bold)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Spacing:</span>
                            <span className="text-white font-mono">{config.subheader.letterSpacing}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="6"
                            step="0.2"
                            value={config.subheader.letterSpacing}
                            onChange={(e) => updateConfig('subheader', { letterSpacing: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Color:</label>
                          <input
                            type="color"
                            value="#ded3c7"
                            onChange={(e) => updateConfig('subheader', { color: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── PRIMARY CTA BUTTON ─────────────────── */}
                  {selectedElement === 'primaryBtn' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Primary Button</span>
                        <button
                          onClick={() => updateConfig('primaryBtn', { visible: !config.primaryBtn.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.primaryBtn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Button Text:</label>
                        <input
                          type="text"
                          value={config.primaryBtn.text}
                          onChange={(e) => updateConfig('primaryBtn', { text: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.primaryBtn.fontFamily}
                          onChange={(e) => updateConfig('primaryBtn', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Background:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.primaryBtn.bgColor.startsWith('#') ? config.primaryBtn.bgColor : '#efc9a5'}
                              onChange={(e) => updateConfig('primaryBtn', { bgColor: e.target.value })}
                              className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white/70">{config.primaryBtn.bgColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Text Color:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.primaryBtn.color.startsWith('#') ? config.primaryBtn.color : '#241812'}
                              onChange={(e) => updateConfig('primaryBtn', { color: e.target.value })}
                              className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-white/70">{config.primaryBtn.color}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.primaryBtn.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="11"
                            max="20"
                            step="0.5"
                            value={config.primaryBtn.fontSize}
                            onChange={(e) => updateConfig('primaryBtn', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Border Radius:</span>
                            <span className="text-white font-mono">{config.primaryBtn.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            step="2"
                            value={config.primaryBtn.borderRadius > 40 ? 40 : config.primaryBtn.borderRadius}
                            onChange={(e) => updateConfig('primaryBtn', { borderRadius: Number(e.target.value) >= 40 ? 9999 : Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── SECONDARY CTA BUTTON ─────────────────── */}
                  {selectedElement === 'secondaryBtn' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Secondary Button</span>
                        <button
                          onClick={() => updateConfig('secondaryBtn', { visible: !config.secondaryBtn.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.secondaryBtn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Button Text:</label>
                        <input
                          type="text"
                          value={config.secondaryBtn.text}
                          onChange={(e) => updateConfig('secondaryBtn', { text: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.secondaryBtn.fontFamily}
                          onChange={(e) => updateConfig('secondaryBtn', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Text Color:</label>
                          <input
                            type="color"
                            value={config.secondaryBtn.color.startsWith('#') ? config.secondaryBtn.color : '#ffffff'}
                            onChange={(e) => updateConfig('secondaryBtn', { color: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Border Color:</label>
                          <input
                            type="color"
                            value="#ffffff"
                            onChange={(e) => updateConfig('secondaryBtn', { borderColor: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── BRAND LOGO & SUBTITLE ─────────────────── */}
                  {selectedElement === 'logo' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Brand Logo &amp; Subtitle</span>
                        <button
                          onClick={() => updateConfig('logo', { visible: !config.logo.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.logo.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Logo Name:</label>
                          <input
                            type="text"
                            value={config.logo.text}
                            onChange={(e) => updateConfig('logo', { text: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Subtitle:</label>
                          <input
                            type="text"
                            value={config.logo.subtitle}
                            onChange={(e) => updateConfig('logo', { subtitle: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Logo Font Family:</label>
                        <select
                          value={config.logo.fontFamily}
                          onChange={(e) => updateConfig('logo', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Logo Size:</span>
                            <span className="text-white font-mono">{config.logo.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="18"
                            max="48"
                            step="1"
                            value={config.logo.fontSize}
                            onChange={(e) => updateConfig('logo', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Subtitle Size:</span>
                            <span className="text-white font-mono">{config.logo.subtitleSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="16"
                            step="0.5"
                            value={config.logo.subtitleSize}
                            onChange={(e) => updateConfig('logo', { subtitleSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Color:</label>
                          <input
                            type="color"
                            value={config.logo.color.startsWith('#') ? config.logo.color : '#ffffff'}
                            onChange={(e) => updateConfig('logo', { color: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Logo Weight:</label>
                          <select
                            value={config.logo.fontWeight}
                            onChange={(e) => updateConfig('logo', { fontWeight: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          >
                            <option value="300">300 (Light)</option>
                            <option value="400">400 (Regular)</option>
                            <option value="500">500 (Medium)</option>
                            <option value="600">600 (Semi-Bold)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── NAVIGATION LINKS ─────────────────── */}
                  {selectedElement === 'nav' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Header Navigation Links</span>
                        <button
                          onClick={() => updateConfig('nav', { visible: !config.nav.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.nav.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10.5px] text-white/50 block mb-0.5">Link 1:</label>
                          <input
                            type="text"
                            value={config.nav.link1}
                            onChange={(e) => updateConfig('nav', { link1: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10.5px] text-white/50 block mb-0.5">Link 2:</label>
                          <input
                            type="text"
                            value={config.nav.link2}
                            onChange={(e) => updateConfig('nav', { link2: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10.5px] text-white/50 block mb-0.5">Link 3:</label>
                          <input
                            type="text"
                            value={config.nav.link3}
                            onChange={(e) => updateConfig('nav', { link3: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10.5px] text-white/50 block mb-0.5">Link 4:</label>
                          <input
                            type="text"
                            value={config.nav.link4}
                            onChange={(e) => updateConfig('nav', { link4: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.nav.fontFamily}
                          onChange={(e) => updateConfig('nav', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.nav.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="11"
                            max="18"
                            step="0.5"
                            value={config.nav.fontSize}
                            onChange={(e) => updateConfig('nav', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Link Gap:</span>
                            <span className="text-white font-mono">{config.nav.gap}px</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="80"
                            step="4"
                            value={config.nav.gap}
                            onChange={(e) => updateConfig('nav', { gap: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── HEADER BOOK BUTTON ─────────────────── */}
                  {selectedElement === 'headerBtn' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Header Book Button</span>
                        <button
                          onClick={() => updateConfig('headerBtn', { visible: !config.headerBtn.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.headerBtn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Button Text:</label>
                        <input
                          type="text"
                          value={config.headerBtn.text}
                          onChange={(e) => updateConfig('headerBtn', { text: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Text Color:</label>
                          <input
                            type="color"
                            value={config.headerBtn.color.startsWith('#') ? config.headerBtn.color : '#ffffff'}
                            onChange={(e) => updateConfig('headerBtn', { color: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Border Color:</label>
                          <input
                            type="color"
                            value="#ffffff"
                            onChange={(e) => updateConfig('headerBtn', { borderColor: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── SERVICES STRIP ─────────────────── */}
                  {selectedElement === 'servicesStrip' && (
                    <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">4 Services Category Strip</span>
                        <button
                          onClick={() => updateConfig('servicesStrip', { visible: !config.servicesStrip.visible })}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {config.servicesStrip.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/50 block">Category 1:</label>
                          <input
                            type="text"
                            value={config.servicesStrip.item1Text}
                            onChange={(e) => updateConfig('servicesStrip', { item1Text: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 block">Category 2:</label>
                          <input
                            type="text"
                            value={config.servicesStrip.item2Text}
                            onChange={(e) => updateConfig('servicesStrip', { item2Text: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 block">Category 3:</label>
                          <input
                            type="text"
                            value={config.servicesStrip.item3Text}
                            onChange={(e) => updateConfig('servicesStrip', { item3Text: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 block">Category 4:</label>
                          <input
                            type="text"
                            value={config.servicesStrip.item4Text}
                            onChange={(e) => updateConfig('servicesStrip', { item4Text: e.target.value })}
                            className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-white/60 block mb-1">Font Family:</label>
                        <select
                          value={config.servicesStrip.fontFamily}
                          onChange={(e) => updateConfig('servicesStrip', { fontFamily: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/60 block mb-1">Icon Accent:</label>
                          <input
                            type="color"
                            value={config.servicesStrip.iconColor.startsWith('#') ? config.servicesStrip.iconColor : '#e7c19a'}
                            onChange={(e) => updateConfig('servicesStrip', { iconColor: e.target.value })}
                            className="w-7 h-7 rounded border border-white/30 cursor-pointer bg-transparent"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Font Size:</span>
                            <span className="text-white font-mono">{config.servicesStrip.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="16"
                            step="0.5"
                            value={config.servicesStrip.fontSize}
                            onChange={(e) => updateConfig('servicesStrip', { fontSize: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────── FLOURISH & SWASH CONTROLS ─────────────────── */}
                  {selectedElement === 'flourish' && (
                    <div className="p-3 bg-white/[0.03] border border-[#efc9a5]/30 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#efc9a5] uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Calligraphy Swash Settings
                        </span>
                        <label className="flex items-center gap-1 text-[11px] text-white/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.flourish?.enabled ?? true}
                            onChange={(e) => updateConfig('flourish', { enabled: e.target.checked })}
                            className="rounded accent-[#efc9a5]"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <p className="text-[10.5px] text-white/70 leading-relaxed">
                        Wrap any letter in curly braces like <code className="text-[#efc9a5] font-mono font-bold bg-black/40 px-1 py-0.5 rounded">{'{W}'}HERE BEAUTY MEETS TIMELESS {'{E}'}LEGANCE.</code> to render that letter with the extended calligraphy flourish!
                      </p>

                      <div>
                        <label className="text-[11px] text-white/70 block mb-1">Flourish Script Font:</label>
                        <select
                          value={config.flourish?.scriptFont || "'Alex Brush', cursive"}
                          onChange={(e) => updateConfig('flourish', { scriptFont: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/40 border border-white/20 rounded text-white text-xs focus:outline-none focus:border-[#efc9a5]"
                        >
                          {SCRIPT_FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Swash Scale:</span>
                            <span className="text-white font-mono">{Math.round((config.flourish?.scale || 1.40) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="1.8"
                            step="0.02"
                            value={config.flourish?.scale || 1.40}
                            onChange={(e) => updateConfig('flourish', { scale: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-white/60 mb-1">
                            <span>Swash Y-Offset:</span>
                            <span className="text-white font-mono">{config.flourish?.offsetY || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-20"
                            max="20"
                            step="1"
                            value={config.flourish?.offsetY || 0}
                            onChange={(e) => updateConfig('flourish', { offsetY: Number(e.target.value) })}
                            className="w-full accent-[#efc9a5]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══════ FONT PAIRING PRESET SUITE (TEST ALL 5) ══════ */}
                  <div className="p-3 bg-gradient-to-br from-[#efc9a5]/10 via-white/[0.03] to-transparent border border-[#efc9a5]/30 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#efc9a5] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> 5 Font Pairings To Test
                      </span>
                      <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#efc9a5]/20 text-[#efc9a5] font-medium">
                        1-Click Test
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      {FONT_PAIRING_PRESETS.map((preset) => {
                        const isActive = 
                          config.headlineLine1.fontFamily === preset.headingFont &&
                          config.subheader.fontFamily === preset.subheadingFont;

                        return (
                          <button
                            key={preset.id}
                            onClick={() => applyFontPairing(preset)}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                              isActive
                                ? 'bg-[#efc9a5]/20 border-[#efc9a5] shadow-[0_0_12px_rgba(239,201,165,0.2)]'
                                : 'bg-black/30 border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-[12px] font-semibold ${isActive ? 'text-[#efc9a5]' : 'text-white'}`}>
                                  {preset.headingFontName}
                                </span>
                                <span className="text-white/40 text-[10px]">+</span>
                                <span className="text-white/80 text-[11.5px]">
                                  {preset.subheadingFontName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9.5px] tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-[#ded3c7] font-medium">
                                  {preset.overallFeel}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {isActive ? (
                                <div className="w-5 h-5 rounded-full bg-[#efc9a5] text-[#241812] flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <span className="text-[10px] text-white/50 group-hover:text-white transition-colors">
                                  Test →
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Luxury Color Swatches */}
                  <div>
                    <label className="block text-[11px] text-white/60 uppercase tracking-wider font-semibold mb-1.5">
                      Quick Palette Swatches:
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            if (selectedElement === 'headlineLine1') updateConfig('headlineLine1', { color: c.value });
                            else if (selectedElement === 'headlineLine2') updateConfig('headlineLine2', { highlightColor: c.value });
                            else if (selectedElement === 'subheader') updateConfig('subheader', { color: c.value });
                            else if (selectedElement === 'primaryBtn') updateConfig('primaryBtn', { bgColor: c.value });
                            else if (selectedElement === 'logo') updateConfig('logo', { color: c.value });
                          }}
                          className="h-6 rounded border border-white/20 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: c.value === 'transparent' ? '#111' : c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════
                  TAB 2: BACKGROUND IMAGE (Position Up/Down, Scale, Darkness)
              ══════════════════════════════════════════════════════ */}
              {activeTab === 'background' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-[11.5px] leading-relaxed">
                    <strong>Background Image Controls:</strong> You can move the background photo up/down, scale it, or shift its anchor point.
                  </div>

                  {/* Vertical Position (Move Up / Down) */}
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-[#efc9a5] uppercase tracking-wider">Vertical Position (Y):</span>
                      <span className="font-mono text-white text-xs">{config.bg.offsetY}px {config.bg.offsetY < 0 ? '(Moved Up)' : '(Moved Down)'}</span>
                    </div>

                    <input
                      type="range"
                      min="-250"
                      max="150"
                      step="2"
                      value={config.bg.offsetY}
                      onChange={(e) => updateConfig('bg', { offsetY: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => updateConfig('bg', { offsetY: config.bg.offsetY - 20 })}
                        className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded text-[11px] text-white flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3 text-[#efc9a5]" /> Shift Up (-20px)
                      </button>
                      <button
                        onClick={() => updateConfig('bg', { offsetY: config.bg.offsetY + 20 })}
                        className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded text-[11px] text-white flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3 text-[#efc9a5]" /> Shift Down (+20px)
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Position (X Offset) */}
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-white/80">Horizontal Shift (X):</span>
                      <span className="font-mono text-white text-xs">{config.bg.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="2"
                      value={config.bg.offsetX}
                      onChange={(e) => updateConfig('bg', { offsetX: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />
                  </div>

                  {/* Image Zoom / Scale */}
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-white/80">Scale / Zoom:</span>
                      <span className="font-mono text-white text-xs">{config.bg.scale}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="160"
                      step="1"
                      value={config.bg.scale}
                      onChange={(e) => updateConfig('bg', { scale: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />
                  </div>

                  {/* Focal Point (Object Position Y) */}
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-white/80">Focal Point Y (%):</span>
                      <span className="font-mono text-white text-xs">{config.bg.objectPosY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={config.bg.objectPosY}
                      onChange={(e) => updateConfig('bg', { objectPosY: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />
                  </div>

                  {/* Vignette / Overlay Darkness */}
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-white/80">Darkness Overlay:</span>
                      <span className="font-mono text-white text-xs">{config.bg.darkness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="2"
                      value={config.bg.darkness}
                      onChange={(e) => updateConfig('bg', { darkness: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════
                  TAB 3: CONTAINER LAYOUT
              ══════════════════════════════════════════════════════ */}
              {activeTab === 'container' && (
                <div className="space-y-4">
                  <div className="space-y-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-white/80">Container Max Width:</span>
                      <span className="font-mono text-white text-xs">{config.container.maxWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="360"
                      max="850"
                      step="10"
                      value={config.container.maxWidth}
                      onChange={(e) => updateConfig('container', { maxWidth: Number(e.target.value) })}
                      className="w-full accent-[#efc9a5]"
                    />
                  </div>

                  {/* Horizontal Alignment */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                    <label className="text-[11px] font-semibold text-white/80 block">Screen Alignment:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateConfig('container', { align })}
                          className={`py-1.5 rounded text-xs capitalize transition-colors cursor-pointer ${
                            config.container.align === align
                              ? 'bg-[#efc9a5] text-[#241812] font-semibold'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Container Overall Offset */}
                  <div className="space-y-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <span className="text-[11px] font-semibold text-white/80 block">Container Offset (X &amp; Y):</span>
                    
                    <div>
                      <div className="flex justify-between text-[11px] text-white/60 mb-1">
                        <span>X Offset:</span>
                        <span className="text-white font-mono">{config.container.x}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="2"
                        value={config.container.x}
                        onChange={(e) => updateConfig('container', { x: Number(e.target.value) })}
                        className="w-full accent-[#efc9a5]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-white/60 mb-1">
                        <span>Y Offset:</span>
                        <span className="text-white font-mono">{config.container.y}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="2"
                        value={config.container.y}
                        onChange={(e) => updateConfig('container', { y: Number(e.target.value) })}
                        className="w-full accent-[#efc9a5]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════
                  TAB 4: PRESETS & ACTIONS
              ══════════════════════════════════════════════════════ */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  {/* Big Save Button */}
                  <div className="p-3 bg-[#efc9a5]/10 border border-[#efc9a5]/40 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-[#efc9a5] block uppercase tracking-wider">Permanent Storage</span>
                    <p className="text-[11px] text-white/70">
                      Click the button below to permanently save all your current hero modifications to local storage. Your changes will persist across browser refreshes!
                    </p>
                    <button
                      onClick={handleSaveClick}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#efc9a5] hover:bg-[#f6d7b8] text-[#241812] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
                    >
                      <BookmarkCheck className="w-4 h-4 text-[#241812]" />
                      <span>💾 Save Design To Browser</span>
                    </button>
                  </div>

                  {/* Copy & Export Actions */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <button
                      onClick={handleCopyCSS}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Generated CSS</span>
                    </button>

                    <button
                      onClick={handleCopyJSON}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Design JSON</span>
                    </button>

                    <button
                      onClick={onReset}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Original Defaults</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Footer Action */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-2">
              <button
                onClick={handleSaveClick}
                className="flex-1 py-2 px-3 rounded-lg bg-[#efc9a5] hover:bg-[#f6d7b8] text-[#241812] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Design</span>
              </button>

              <button
                onClick={onToggleEditMode}
                className="py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Preview Mode
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};