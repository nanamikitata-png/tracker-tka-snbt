import React from 'react';
import { Flame, Shield, Clock, CheckCircle2, Plus, Zap } from 'lucide-react';
import { DailyStreakState, PaletteTheme } from '../types';

interface StreakMotivationCardProps {
  streak: DailyStreakState;
  currentTheme: PaletteTheme;
  onAddStudyMinutes: (minutes: number) => void;
  onStartQuiz: () => void;
}

export const StreakMotivationCard: React.FC<StreakMotivationCardProps> = ({
  streak,
  currentTheme,
  onAddStudyMinutes,
  onStartQuiz,
}) => {
  const targetMinutes = streak.dailyTargetMinutes || 240;
  const currentMinutes = streak.minutesLoggedToday || 0;
  const progressPercent = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));

  // Compute past 7 days dates
  const today = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'narrow' });
    const isToday = i === 6;
    const isActive = streak.activeDates.includes(dateStr);
    return { dateStr, dayName, isToday, isActive };
  });

  const hoursLogged = Math.floor(currentMinutes / 60);
  const minutesLogged = currentMinutes % 60;
  const targetHours = Math.floor(targetMinutes / 60);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Streak Tracker */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-200">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Streak Belajar</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {streak.currentStreak} <span className="text-sm font-sans font-medium text-slate-600">Hari</span>
              </div>
            </div>
          </div>

          {/* Streak Shield */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600"
            title="Perisai Pembeku Streak: Melindungi streak kamu jika ada 1 hari darurat"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono tabular-nums">{streak.streakShieldCount}</span>
            <span className="text-[11px] text-slate-500">Shield</span>
          </div>
        </div>

        {/* 7-Day Dots */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 mb-2 flex items-center justify-between">
            <span>Aktivitas 7 Hari Terakhir</span>
            <span className="font-mono tabular-nums text-slate-700">Rekor: {streak.bestStreak} hari</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {past7Days.map((day) => (
              <div key={day.dateStr} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                    day.isActive
                      ? 'text-white shadow-xs'
                      : day.isToday
                      ? 'border border-dashed border-slate-300 text-slate-400 bg-slate-50'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  style={{
                    backgroundColor: day.isActive ? currentTheme.primary : undefined,
                  }}
                >
                  {day.isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px]">{day.dayName}</span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-mono">
                  {day.dateStr.split('-')[2]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Target Jam Belajar Harian */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-sky-50 text-sky-600 border border-sky-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Target Belajar Hari Ini</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {hoursLogged}j {minutesLogged}m{' '}
                  <span className="text-xs font-normal text-slate-400">/ {targetHours} jam</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold font-mono tabular-nums" style={{ color: currentTheme.primary }}>
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mt-3">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: currentTheme.primary,
              }}
            />
          </div>
        </div>

        {/* Quick Log Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Catat Belajar:</span>
          <button
            onClick={() => onAddStudyMinutes(30)}
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> 30m
          </button>
          <button
            onClick={() => onAddStudyMinutes(60)}
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> 60m
          </button>
          <button
            onClick={() => onAddStudyMinutes(90)}
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> 90m
          </button>
        </div>
      </div>

      {/* 3. Kuis Kilat Seimbang Status & Anti-Burnout */}
      <div 
        className="p-5 rounded-xl border shadow-xs flex flex-col justify-between"
        style={{
          backgroundColor: currentTheme.bgTint,
          borderColor: `${currentTheme.primary}30`,
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Tes Harian Anti-Burnout</div>
                <div className="text-sm font-bold text-slate-900">
                  {streak.quizzesCompletedToday > 0 ? 'Sudah Selesai Hari Ini 🎉' : 'Porsi Ringan 5-10 Soal'}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Distribusi seimbang: Matematika, Fisika, Kimia, Biologi, dan TPS SNBT. Cukup 10 menit untuk menjaga ketajaman konsep.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Selesai hari ini:{' '}
            <strong className="font-mono tabular-nums">{streak.quizzesCompletedToday} sesi</strong>
          </span>
          <button
            onClick={onStartQuiz}
            className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Mulai Kuis Kilat
          </button>
        </div>
      </div>
    </div>
  );
};
