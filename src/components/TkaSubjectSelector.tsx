import React from 'react';
import { Check, BookOpen, Layers, Sparkles } from 'lucide-react';
import { TkaConfig, TkaElectiveSubject, PaletteTheme } from '../types';

interface TkaSubjectSelectorProps {
  config: TkaConfig;
  currentTheme: PaletteTheme;
  onUpdateConfig: (newConfig: TkaConfig) => void;
  onNavigateToQuiz?: () => void;
}

export const TkaSubjectSelector: React.FC<TkaSubjectSelectorProps> = ({
  config,
  currentTheme,
  onUpdateConfig,
  onNavigateToQuiz,
}) => {
  const allElectives: { id: TkaElectiveSubject; label: string; group: 'Saintek' | 'Soshum' | 'Lanjutan' }[] = [
    { id: 'Fisika', label: 'Fisika', group: 'Saintek' },
    { id: 'Kimia', label: 'Kimia', group: 'Saintek' },
    { id: 'Biologi', label: 'Biologi', group: 'Saintek' },
    { id: 'Matematika Tingkat Lanjut', label: 'Matematika Tingkat Lanjut', group: 'Saintek' },
    { id: 'Informatika', label: 'Informatika', group: 'Lanjutan' },
    { id: 'Ekonomi', label: 'Ekonomi', group: 'Soshum' },
    { id: 'Sosiologi', label: 'Sosiologi', group: 'Soshum' },
    { id: 'Geografi', label: 'Geografi', group: 'Soshum' },
  ];

  const handleToggleElective = (subject: TkaElectiveSubject) => {
    const isAlreadySelected = config.electiveSubjects.includes(subject);

    if (isAlreadySelected) {
      // Must have at least 1 while toggling, but user wants exactly 2
      if (config.electiveSubjects.length > 1) {
        const remaining = config.electiveSubjects.filter((s) => s !== subject);
        onUpdateConfig({
          ...config,
          electiveSubjects: [remaining[0], remaining[0]], // temporary until 2nd selected
        });
      }
    } else {
      // Replace the oldest or 2nd item so exactly 2 are selected
      const newPair: [TkaElectiveSubject, TkaElectiveSubject] = [
        config.electiveSubjects[1] || config.electiveSubjects[0],
        subject,
      ];
      onUpdateConfig({
        ...config,
        electiveSubjects: newPair,
      });
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Konfigurasi Mata Pelajaran TKA SMA
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mt-0.5">
            3 Mapel Wajib + 2 Mapel Pilihan (Bukan Mandiri)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Mapel Terpilih:</span>
            <span className="font-bold text-slate-900">
              {config.mandatorySubjects.length} Wajib + {config.electiveSubjects.length} Pilihan
            </span>
          </div>

          {onNavigateToQuiz && (
            <button
              type="button"
              onClick={onNavigateToQuiz}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <span>Latihan Soal Per-Mapel →</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
        {/* 3 Mapel Wajib */}
        <div className="lg:col-span-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>3 Mata Pelajaran Wajib (Standar Nasional)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              Harus / Wajib
            </span>
          </div>

          <div className="space-y-1.5">
            {config.mandatorySubjects.map((sub) => (
              <div
                key={sub}
                className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
                  {sub}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">Terkunci</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Mapel Pilihan Picker */}
        <div className="lg:col-span-7 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Pilih 2 Mata Pelajaran Peminatan Kamu:
            </span>
            <span className="font-mono text-[11px] text-indigo-700 font-semibold">
              Terpilih: {config.electiveSubjects.join(' & ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {allElectives.map((el) => {
              const isSelected = config.electiveSubjects.includes(el.id);

              return (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => handleToggleElective(el.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 text-indigo-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{el.label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {el.group}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
