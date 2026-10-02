import React from 'react';
import { Calendar, Compass, ArrowUpRight, Palette } from 'lucide-react';
import { PaletteTheme, UniversityTarget } from '../types';
import { getExamCountdowns } from '../utils/countdown';

interface HeaderBannerProps {
  currentTheme: PaletteTheme;
  activeTrack: string;
  activeTarget: UniversityTarget;
  isYtbEnabled?: boolean;
  onOpenPaletteModal: () => void;
  onGoToHub: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  currentTheme,
  activeTrack,
  activeTarget,
  isYtbEnabled = true,
  onOpenPaletteModal,
  onGoToHub,
}) => {
  const countdowns = getExamCountdowns();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Background Graphic with Subtle Theme Tint */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 100% 0%, ${currentTheme.primary} 0%, transparent 60%), radial-gradient(circle at 0% 100%, ${currentTheme.accent} 0%, transparent 50%)`,
        }}
      />

      <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Student Info & Vision */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">
            <span>Siswa SMA Kelas 12</span>
            <span>·</span>
            <span className="font-bold text-slate-900" style={{ color: currentTheme.primary }}>
              Jalur: {activeTrack === 'TKA' ? 'TKA SMA (26 Okt · 3 Wajib + 2 Pilihan)' : activeTrack === 'SNBT' ? 'UTBK-SNBT (22 Apr · 7 Subtes Resmi)' : 'Türkiye Bursları (YTB 2027)'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] text-balance">
            Mulai dari Nol, Kuasai Target{' '}
            <span style={{ color: currentTheme.primary }}>
              {activeTarget.name}
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
            {activeTrack === 'TKA'
              ? 'TKA SMA dilaksanakan tanggal 26 Oktober 2026. Lacak penguasaan 3 Mapel Wajib serta 2 Mapel Pilihan kurikulum SMA secara bertahap dari 0%.'
              : activeTrack === 'SNBT'
              ? 'UTBK-SNBT 2027 dilaksanakan 22 April 2027. Fokus tuntas 7 subtes resmi BPPP dengan latihan soal mirip bocoran asli.'
              : 'Pantau kelengkapan berkas beasiswa YTB, esai Letter of Intent, kalkulator rapor, dan tes akademik YÖS.'}
          </p>

          {/* Inspirational Quote */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 italic">
            <Compass className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
            <p>"{activeTarget.motivationQuote}"</p>
          </div>
        </div>

        {/* Right Side: Dream Campus Visual & Accurate Countdowns */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
          {/* Target Campus Badge with Image */}
          <div 
            onClick={onGoToHub}
            className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80 transition-all cursor-pointer shadow-xs max-w-xs"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 relative">
              <img
                src={activeTarget.imageUrl}
                alt={activeTarget.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Target Utama</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {activeTarget.name}
              </h2>
              <p className="text-[11px] text-slate-600 truncate">
                {activeTarget.major}
              </p>
            </div>
          </div>

          {/* Accurate Countdown Timeline Grid */}
          <div className="flex items-center gap-2">
            {/* 1. TKA SMA: 26 Oktober 2026 */}
            <div 
              className="px-3 py-2 rounded-lg border text-center min-w-[90px]"
              style={{
                backgroundColor: activeTrack === 'TKA' ? currentTheme.bgTint : '#f8fafc',
                borderColor: activeTrack === 'TKA' ? `${currentTheme.primary}60` : '#e2e8f0',
              }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                TKA SMA (26 Okt)
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {countdowns.tka.daysLeft}
                <span className="text-[10px] font-normal text-slate-500 ml-0.5">hr</span>
              </div>
            </div>

            {/* 2. UTBK-SNBT 2027 */}
            <div 
              className="px-3 py-2 rounded-lg border text-center min-w-[90px]"
              style={{
                backgroundColor: activeTrack === 'SNBT' ? currentTheme.bgTint : '#f8fafc',
                borderColor: activeTrack === 'SNBT' ? `${currentTheme.primary}60` : '#e2e8f0',
              }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                UTBK SNBT 2027
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {countdowns.snbt.daysLeft}
                <span className="text-[10px] font-normal text-slate-500 ml-0.5">hr</span>
              </div>
            </div>

            {/* 3. Tes YÖS / YTB Beasiswa */}
            <div 
              className="px-3 py-2 rounded-lg border text-center min-w-[90px]"
              style={{
                backgroundColor: activeTrack === 'YTB' ? currentTheme.bgTint : '#f8fafc',
                borderColor: activeTrack === 'YTB' ? `${currentTheme.primary}60` : '#e2e8f0',
                opacity: isYtbEnabled ? 1 : 0.6,
              }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                {isYtbEnabled ? 'Tes YÖS / YTB' : 'YTB (Nonaktif)'}
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {isYtbEnabled ? countdowns.ytbExam.daysLeft : '-'}
                {isYtbEnabled && <span className="text-[10px] font-normal text-slate-500 ml-0.5">hr</span>}
              </div>
            </div>

            {/* Change Theme Shortcut */}
            <button
              onClick={onOpenPaletteModal}
              title="Ganti tema warna / upload gambar"
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
