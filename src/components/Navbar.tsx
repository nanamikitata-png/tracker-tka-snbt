import React from 'react';
import { Palette, Flame, Sparkles, RotateCcw } from 'lucide-react';
import { PaletteTheme, DailyStreakState, ActiveTrackType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTrack: ActiveTrackType;
  setActiveTrack: (track: ActiveTrackType) => void;
  currentTheme: PaletteTheme;
  streakState: DailyStreakState;
  isYtbEnabled?: boolean;
  onOpenPaletteModal: () => void;
  onQuickCheckIn: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeTrack,
  setActiveTrack,
  currentTheme,
  streakState,
  isYtbEnabled = true,
  onOpenPaletteModal,
  onQuickCheckIn,
  onResetProgress,
}) => {
  const tracks: { id: ActiveTrackType; label: string; tag: string }[] = [
    { id: 'TKA', label: 'TKA SMA (26 Okt)', tag: '3 Wajib + 2 Pilihan' },
    { id: 'SNBT', label: 'UTBK-SNBT 2027', tag: '7 Subtes Resmi' },
    { id: 'YTB', label: 'Türkiye Bursları', tag: isYtbEnabled ? 'YÖS & Beasiswa' : 'Nonaktif' },
  ];

  const mainTabs = [
    { id: 'track-hub', label: activeTrack === 'YTB' ? 'Dashboard & Berkas YTB' : 'Dashboard Jalur' },
    ...(activeTrack === 'SNBT'
      ? [{ id: 'snbt-targets', label: 'Peluang 1–4 Prodi PTN' }]
      : []),
    { id: 'mastery', label: activeTrack === 'YTB' ? 'Materi YÖS & IQ' : 'Penguasaan Materi' },
    { id: 'quiz', label: activeTrack === 'TKA' ? 'Latihan Soal Per-Mapel' : 'Latihan Soal Asli / FR' },
    { id: 'tryout', label: 'Rekap Tryout' },
    { id: 'journal', label: 'Jurnal Evaluasi' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Track Switcher Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-slate-400 font-medium mr-1 shrink-0">Jalur Belajar:</span>
            {tracks.map((t) => {
              const isCurrent = activeTrack === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTrack(t.id);
                    if (activeTab === 'dashboard') setActiveTab('track-hub');
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    isCurrent ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto text-slate-300">
            <button
              onClick={onResetProgress}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Reset data penguasaan dan mulai fresh dari 0%"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Mulai dari Nol (0%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Zone 1, Zone 2, Zone 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('track-hub')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:opacity-85 transition-opacity font-['Outfit']">
            Studi<span style={{ color: currentTheme.primary }}>Kuasai</span>
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {mainTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1 transition-colors relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium"
            title="Streak belajar harian kamu"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {streakState.currentStreak}
            </span>
            <span className="hidden sm:inline">Hari</span>
          </div>

          {/* Color Palette Button */}
          <button
            onClick={onOpenPaletteModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            title="Ganti palet warna dari gambar kampus/planner"
          >
            <span
              className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10 shrink-0"
              style={{ backgroundColor: currentTheme.primary }}
            />
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Palet Warna</span>
          </button>

          {/* Quick Check-in Button */}
          <button
            onClick={onQuickCheckIn}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-95 transition-all whitespace-nowrap cursor-pointer active:scale-95"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check-in Hari Ini</span>
          </button>
        </div>
      </div>

      {/* Sub-nav for mobile */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-1.5 overflow-x-auto border-t border-slate-100 bg-slate-50/70 scrollbar-none text-xs">
        {mainTabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-white shadow-xs text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
