import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, RefreshCw, Sparkles, Image as ImageIcon, Sliders, Palette, Trash2, Plus, Bookmark } from 'lucide-react';
import { PaletteTheme } from '../types';
import { extractPaletteFromImage, adjustLightness, applyThemeToCss } from '../utils/colorExtractor';
import { PRESET_THEMES } from '../data/seedData';
import { loadCustomThemes, saveCustomTheme } from '../utils/storage';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: PaletteTheme;
  onApplyTheme: (theme: PaletteTheme, updateCampusImage?: boolean) => void;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'custom-studio' | 'presets'>('custom-studio');
  const [selectedImage, setSelectedImage] = useState<string>(currentTheme.imageUrl || PRESET_THEMES[0].imageUrl!);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedTheme, setExtractedTheme] = useState<PaletteTheme>(currentTheme);
  const [customThemesList, setCustomThemesList] = useState<PaletteTheme[]>([]);
  const [customName, setCustomName] = useState<string>('Tema Kreatifku');
  const [applyAsCampusTarget, setApplyAsCampusTarget] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setExtractedTheme(currentTheme);
      setCustomThemesList(loadCustomThemes());
    }
  }, [isOpen, currentTheme]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      setIsExtracting(true);
      try {
        const theme = await extractPaletteFromImage(dataUrl, `Palet dari ${file.name.slice(0, 16)}`);
        setExtractedTheme(theme);
        setCustomName(`Palet ${file.name.slice(0, 12)}`);
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: PaletteTheme) => {
    setExtractedTheme({ ...preset });
    if (preset.imageUrl) {
      setSelectedImage(preset.imageUrl);
    }
    setCustomName(preset.name);
  };

  const handleColorChange = (key: keyof PaletteTheme, value: string) => {
    setExtractedTheme((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'primary') {
        updated.primaryLight = adjustLightness(value, 35);
        updated.primaryDark = adjustLightness(value, -25);
        updated.bgTint = adjustLightness(value, 85);
      } else if (key === 'accent') {
        updated.accentLight = adjustLightness(value, 30);
      }
      return updated;
    });
  };

  const handleSaveToPersonalList = () => {
    const toSave: PaletteTheme = {
      ...extractedTheme,
      id: `theme-user-${Date.now()}`,
      name: customName.trim() || 'Palet Kreatif',
      isCustom: true,
    };
    saveCustomTheme(toSave);
    setCustomThemesList(loadCustomThemes());
  };

  const handleSaveAndApply = () => {
    const finalTheme = {
      ...extractedTheme,
      name: customName.trim() || extractedTheme.name,
    };
    onApplyTheme(finalTheme, applyAsCampusTarget);
    onClose();
  };

  // Additional creative inspiration themes
  const extendedPresets: PaletteTheme[] = [
    ...PRESET_THEMES,
    {
      id: 'theme-sakura',
      name: 'Sakura Tokyo Study',
      sourceName: 'Pastel Floral Mood',
      primary: '#be185d', // Pink-700
      primaryLight: '#f472b6',
      primaryDark: '#831843',
      accent: '#0284c7', // Sky
      accentLight: '#bae6fd',
      bgTint: '#fdf2f8',
      surface: '#ffffff',
      isCustom: false,
    },
    {
      id: 'theme-nordic',
      name: 'Nordic Midnight',
      sourceName: 'Deep Focus Slate',
      primary: '#0f172a', // Slate-900
      primaryLight: '#475569',
      primaryDark: '#020617',
      accent: '#10b981', // Emerald
      accentLight: '#a7f3d0',
      bgTint: '#f8fafc',
      surface: '#ffffff',
      isCustom: false,
    },
    {
      id: 'theme-autumn',
      name: 'Autumn Istanbul Sunset',
      sourceName: 'Warm Amber & Terracotta',
      primary: '#c2410c', // Orange-700
      primaryLight: '#fb923c',
      primaryDark: '#7c2d12',
      accent: '#4338ca', // Indigo
      accentLight: '#c7d2fe',
      bgTint: '#fff7ed',
      surface: '#ffffff',
      isCustom: false,
    },
    {
      id: 'theme-emerald',
      name: 'Emerald Scholar',
      sourceName: 'Focus Botanica',
      primary: '#047857', // Emerald-700
      primaryLight: '#34d399',
      primaryDark: '#064e3b',
      accent: '#b45309', // Amber-700
      accentLight: '#fde68a',
      bgTint: '#ecfdf5',
      surface: '#ffffff',
      isCustom: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              Studio Palet Warna Kustom &amp; Ekstraksi Gambar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bebas berkreasi menentukan nuansa warna agar sesi belajar terasa nyaman dan personal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Sub-Nav */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('custom-studio')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'custom-studio'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kustom Warna Bebas (Color Studio)
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ekstrak dari Gambar / Planner
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Koleksi Preset &amp; Tema Tersimpan
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: CUSTOM COLOR STUDIO */}
          {activeTab === 'custom-studio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Palet Pribadi:
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: Midnight Study Room / Sakura Mood"
                  className="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 4 Core Color Adjusters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Primary */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Warna Utama</span>
                    <input
                      type="color"
                      value={extractedTheme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div
                    className="h-10 rounded-lg shadow-inner flex items-center justify-center text-white text-xs font-mono font-bold"
                    style={{ backgroundColor: extractedTheme.primary }}
                  >
                    {extractedTheme.primary}
                  </div>
                  <input
                    type="text"
                    value={extractedTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-full text-[11px] text-center font-mono p-1 border border-slate-200 rounded bg-white"
                  />
                </div>

                {/* 2. Accent */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Warna Aksen</span>
                    <input
                      type="color"
                      value={extractedTheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div
                    className="h-10 rounded-lg shadow-inner flex items-center justify-center text-white text-xs font-mono font-bold"
                    style={{ backgroundColor: extractedTheme.accent }}
                  >
                    {extractedTheme.accent}
                  </div>
                  <input
                    type="text"
                    value={extractedTheme.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-full text-[11px] text-center font-mono p-1 border border-slate-200 rounded bg-white"
                  />
                </div>

                {/* 3. Primary Dark */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Tinta Header</span>
                    <input
                      type="color"
                      value={extractedTheme.primaryDark}
                      onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div
                    className="h-10 rounded-lg shadow-inner flex items-center justify-center text-white text-xs font-mono font-bold"
                    style={{ backgroundColor: extractedTheme.primaryDark }}
                  >
                    {extractedTheme.primaryDark}
                  </div>
                  <input
                    type="text"
                    value={extractedTheme.primaryDark}
                    onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                    className="w-full text-[11px] text-center font-mono p-1 border border-slate-200 rounded bg-white"
                  />
                </div>

                {/* 4. Background Tint */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Latar Lembut</span>
                    <input
                      type="color"
                      value={extractedTheme.bgTint}
                      onChange={(e) => handleColorChange('bgTint', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div
                    className="h-10 rounded-lg shadow-inner border border-slate-200 flex items-center justify-center text-slate-800 text-xs font-mono font-bold"
                    style={{ backgroundColor: extractedTheme.bgTint }}
                  >
                    {extractedTheme.bgTint}
                  </div>
                  <input
                    type="text"
                    value={extractedTheme.bgTint}
                    onChange={(e) => handleColorChange('bgTint', e.target.value)}
                    className="w-full text-[11px] text-center font-mono p-1 border border-slate-200 rounded bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveToPersonalList}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Simpan ke Daftar Tema Pribadi</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE / PLANNER PHOTO */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-slate-50 group min-h-[140px]"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Pilih / Upload Foto Pribadi
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Foto Study Planner, Wallpaper Aesthetic, atau Logo Kampus
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[140px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover max-h-[140px]"
                    />
                  ) : (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Belum ada gambar
                    </div>
                  )}
                  {isExtracting && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                      Mengekstrak palet warna dari gambar...
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Hasil Warna Terdeteksi:</span>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: extractedTheme.primary }} />
                  <span className="w-5 h-5 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: extractedTheme.accent }} />
                  <span className="w-5 h-5 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: extractedTheme.primaryDark }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESETS & USER SAVED PALETTES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Preset Nuansa Populer:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {extendedPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        extractedTheme.primary === preset.primary
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.sourceName}</div>
                    </button>
                  ))}
                </div>
              </div>

              {customThemesList.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2">Palet Pribadi yang Pernah Kamu Simpan:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {customThemesList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectPreset(c)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-left text-xs cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: c.primary }} />
                          <span className="font-semibold text-slate-900 truncate">{c.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE SIMULATION PLAYGROUND */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Simulasi Tampilan Komponen Real-Time:
            </div>

            <div 
              className="p-4 rounded-xl border space-y-3 transition-colors"
              style={{
                backgroundColor: extractedTheme.bgTint,
                borderColor: `${extractedTheme.primary}40`,
              }}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm"
                  style={{ backgroundColor: extractedTheme.primary }}
                >
                  Tombol Utama
                </button>

                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm"
                  style={{ backgroundColor: extractedTheme.accent }}
                >
                  Aksen Target
                </button>

                <span className="text-xs font-bold font-mono" style={{ color: extractedTheme.primaryDark }}>
                  Pratinjau Teks &amp; Header
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Target Belajar Harian</span>
                  <span className="font-mono font-bold" style={{ color: extractedTheme.primary }}>85%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: extractedTheme.primary }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="setCampusBanner"
              checked={applyAsCampusTarget}
              onChange={(e) => setApplyAsCampusTarget(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300"
            />
            <label htmlFor="setCampusBanner" className="text-xs text-slate-700 cursor-pointer">
              Gunakan foto ini sebagai latar visual kampus impian di banner atas
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: extractedTheme.primary }}
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Nuansa Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
