import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Building2,
  Info,
  HelpCircle,
  BarChart3,
  Sliders,
  Check,
  X,
  Search,
  School,
  ExternalLink,
} from 'lucide-react';
import {
  SnbtChoice,
  DegreeLevel,
  PaletteTheme,
  TryoutRecord,
} from '../types';
import {
  POPULAR_PTN_PRESETS,
  evaluateSnbtStrategy,
  PtnPresetItem,
} from '../data/snbtPtnDatabase';

interface SnbtTargetPlannerProps {
  choices: SnbtChoice[];
  tryouts: TryoutRecord[];
  currentTheme: PaletteTheme;
  onUpdateChoices: (choices: SnbtChoice[]) => void;
  onNavigateToTryout?: () => void;
}

export const SnbtTargetPlanner: React.FC<SnbtTargetPlannerProps> = ({
  choices,
  tryouts,
  currentTheme,
  onUpdateChoices,
  onNavigateToTryout,
}) => {
  // Score source selection
  const snbtTryouts = tryouts.filter((t) => t.track === 'SNBT');
  const scores = snbtTryouts.map((t) => t.totalScore);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 710;
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 675;
  const latestScore =
    scores.length > 0 ? snbtTryouts[snbtTryouts.length - 1].totalScore : 690;

  const [scoreSource, setScoreSource] = useState<'highest' | 'avg' | 'latest' | 'custom'>('avg');
  const [customScore, setCustomScore] = useState<number>(avgScore);

  const activeReferenceScore =
    scoreSource === 'highest'
      ? highestScore
      : scoreSource === 'avg'
      ? avgScore
      : scoreSource === 'latest'
      ? latestScore
      : customScore;

  // Add/Edit Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('Semua');
  const [isCustomPresetMode, setIsCustomPresetMode] = useState<boolean>(false);

  // Custom Form fields
  const [customUniv, setCustomUniv] = useState<string>('');
  const [customMajor, setCustomMajor] = useState<string>('');
  const [customDegree, setCustomDegree] = useState<DegreeLevel>('S1 (Sarjana)');
  const [customThreshold, setCustomThreshold] = useState<number>(680);
  const [customQuota, setCustomQuota] = useState<number>(80);
  const [customApplicants, setCustomApplicants] = useState<number>(1800);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Strategy Evaluation
  const assessment = evaluateSnbtStrategy(choices, activeReferenceScore);

  // Sorting Handler: automatically optimize order
  const handleAutoOptimizeOrder = () => {
    // Sort descending by safeScoreThreshold
    const sorted = [...choices].sort((a, b) => b.safeScoreThreshold - a.safeScoreThreshold);
    const reordered: SnbtChoice[] = sorted.map((item, idx) => ({
      ...item,
      order: (idx + 1) as 1 | 2 | 3 | 4,
    }));
    onUpdateChoices(reordered);
  };

  // Move single choice up or down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === choices.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const newChoices = [...choices];
    const temp = newChoices[index];
    newChoices[index] = newChoices[targetIdx];
    newChoices[targetIdx] = temp;

    // re-assign order numbers
    const updated = newChoices.map((c, i) => ({
      ...c,
      order: (i + 1) as 1 | 2 | 3 | 4,
    }));
    onUpdateChoices(updated);
  };

  // Delete choice
  const handleDeleteChoice = (id: string) => {
    const filtered = choices.filter((c) => c.id !== id);
    const updated = filtered.map((c, i) => ({
      ...c,
      order: (i + 1) as 1 | 2 | 3 | 4,
    }));
    onUpdateChoices(updated);
  };

  // Add choice from preset
  const handleSelectPreset = (preset: PtnPresetItem) => {
    if (choices.length >= 4) return;
    const newChoice: SnbtChoice = {
      id: `snbt-ch-${Date.now()}`,
      order: (choices.length + 1) as 1 | 2 | 3 | 4,
      universityName: preset.universityName,
      majorName: preset.majorName,
      degreeLevel: preset.degreeLevel,
      safeScoreThreshold: preset.safeScoreThreshold,
      quota: preset.quota,
      applicantsLastYear: preset.applicantsLastYear,
      notes: `Preset resmi ${preset.cluster}`,
    };
    onUpdateChoices([...choices, newChoice]);
    setIsAddModalOpen(false);
  };

  // Add custom choice
  const handleAddCustomChoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUniv || !customMajor) return;
    if (choices.length >= 4) return;

    const newChoice: SnbtChoice = {
      id: `snbt-custom-${Date.now()}`,
      order: (choices.length + 1) as 1 | 2 | 3 | 4,
      universityName: customUniv.trim(),
      majorName: customMajor.trim(),
      degreeLevel: customDegree,
      safeScoreThreshold: Number(customThreshold) || 650,
      quota: Number(customQuota) || 60,
      applicantsLastYear: Number(customApplicants) || 1200,
      notes: customNotes.trim() || 'Prodi Kustom Pilihan Mandiri',
    };

    onUpdateChoices([...choices, newChoice]);
    setIsAddModalOpen(false);
    // Reset form
    setCustomUniv('');
    setCustomMajor('');
    setCustomNotes('');
  };

  // Filtered Presets
  const filteredPresets = POPULAR_PTN_PRESETS.filter((p) => {
    const matchesSearch =
      p.universityName.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.majorName.toLowerCase().includes(presetSearch.toLowerCase());
    const matchesCluster =
      selectedClusterFilter === 'Semua' || p.cluster === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: currentTheme.primary }}
              >
                SNPMB 2027
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Kalkulator Peluang &amp; Strategi Urutan Jurusan
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Pilihan Prodi PTN Impian (1–4 Pilihan)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Berdasarkan aturan seleksi nasional BPPP, siswa dapat memilih <strong>1 hingga 4 pilihan prodi</strong>. Sistem akan memeriksa kelulusanmu secara berurutan mulai dari Pilihan 1 hingga Pilihan 4. Hitung persentase peluang lolos dan optimalkan urutan agar tidak membuang peluang berharga!
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {choices.length > 1 && (
              <button
                type="button"
                onClick={handleAutoOptimizeOrder}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Urutkan otomatis pilihan dari passing score tertinggi ke terendah agar sesuai logika seleksi BPPP"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rekomendasikan Urutan Optimal</span>
              </button>
            )}

            {choices.length < 4 && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pilihan ({choices.length}/4)</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Reference Score Selector (Linked to Tryouts) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              Skor Acuan UTBK-SNBT:
            </span>
            <span className="text-base font-extrabold font-mono text-indigo-700 ml-1">
              {activeReferenceScore}
            </span>
            <span className="text-[11px] text-slate-500">poin</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Sumber Skor:</span>
            {snbtTryouts.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setScoreSource('avg')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    scoreSource === 'avg'
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Rata-rata ({avgScore})
                </button>
                <button
                  type="button"
                  onClick={() => setScoreSource('highest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    scoreSource === 'highest'
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Tertinggi ({highestScore})
                </button>
                <button
                  type="button"
                  onClick={() => setScoreSource('latest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    scoreSource === 'latest'
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Terbaru ({latestScore})
                </button>
              </>
            ) : (
              <span className="text-[11px] text-slate-500 italic mr-2">
                (Belum ada tryout tersimpan, gunakan simulasi)
              </span>
            )}

            <button
              type="button"
              onClick={() => setScoreSource('custom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                scoreSource === 'custom'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Simulasi Kustom
            </button>
          </div>
        </div>

        {/* Custom Simulation Slider (if scoreSource === 'custom') */}
        {scoreSource === 'custom' && (
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <span className="text-indigo-900 font-semibold shrink-0">
              Geser Skor Simulasi:
            </span>
            <input
              type="range"
              min="400"
              max="820"
              step="5"
              value={customScore}
              onChange={(e) => setCustomScore(Number(e.target.value))}
              className="flex-1 accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center gap-1 font-mono font-bold text-indigo-900 bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-xs">
              <span>{customScore}</span>
              <span className="text-[10px] text-slate-500 font-normal">poin</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Official Rule Compliance Banner & Order Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: BPPP Format Validation */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            assessment.isRuleCompliant
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          {assessment.isRuleCompliant ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Status Kombinasi {choices.length} Pilihan:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                  assessment.isRuleCompliant
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {assessment.isRuleCompliant ? 'Sah Sesuai Aturan' : 'Perlu Penyesuaian'}
              </span>
            </div>
            <p className="leading-relaxed opacity-90">{assessment.ruleFeedback}</p>
          </div>
        </div>

        {/* Card 2: Logical Sequence Check */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            assessment.isOrderLogicallySound
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          {assessment.isOrderLogicallySound ? (
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold flex items-center justify-between">
              <span>Evaluasi Urutan Pilihan:</span>
              {!assessment.isOrderLogicallySound && (
                <button
                  type="button"
                  onClick={handleAutoOptimizeOrder}
                  className="text-[11px] text-rose-700 underline font-semibold hover:text-rose-900 cursor-pointer"
                >
                  Perbaiki Urutan Sekarang
                </button>
              )}
            </div>
            <p className="leading-relaxed">
              {assessment.orderWarning || assessment.recommendationSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Choice Cards Grid (Pilihan 1 - 4) */}
      <div className="space-y-4">
        {assessment.evaluatedChoices.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <School className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Belum Ada Pilihan Prodi Tersimpan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tambahkan 1 hingga 4 program studi pilihanmu dari universitas impian seperti ITB, UI, UGM, ITS, atau masukkan prodi kustom pilihanmu.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: currentTheme.primary }}
            >
              + Tambah Pilihan Sekarang
            </button>
          </div>
        ) : (
          assessment.evaluatedChoices.map((evaluatedItem, index) => {
            const { choice, calculatedProbability, statusZone, deltaVsScore } =
              evaluatedItem;

            // Status Badge Styling
            const statusConfig = {
              'Sangat Aman': {
                bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                bar: 'bg-emerald-500',
                pill: 'bg-emerald-600 text-white',
              },
              'Kompetitif / Realistis': {
                bg: 'bg-blue-100 text-blue-800 border-blue-200',
                bar: 'bg-blue-500',
                pill: 'bg-blue-600 text-white',
              },
              'Cukup Ketat': {
                bg: 'bg-amber-100 text-amber-800 border-amber-200',
                bar: 'bg-amber-500',
                pill: 'bg-amber-600 text-white',
              },
              'Ambisius / Spekulatif': {
                bg: 'bg-rose-100 text-rose-800 border-rose-200',
                bar: 'bg-rose-500',
                pill: 'bg-rose-600 text-white',
              },
            }[statusZone];

            return (
              <div
                key={choice.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Order and University */}
                  <div className="flex items-start gap-3">
                    {/* Order Circle */}
                    <div
                      className="w-8 h-8 rounded-xl font-bold flex items-center justify-center text-white shrink-0 shadow-xs font-mono"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      #{choice.order}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Pilihan {choice.order}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            choice.degreeLevel === 'S1 (Sarjana)'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : choice.degreeLevel === 'D4 (Sarjana Terapan)'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}
                        >
                          {choice.degreeLevel}
                        </span>
                        {choice.notes && (
                          <span className="text-[11px] text-slate-400 italic">
                            · {choice.notes}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mt-0.5">
                        {choice.majorName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{choice.universityName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Move & Delete) */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Pindahkan ke pilihan di atasnya"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === choices.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Pindahkan ke pilihan di bawahnya"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteChoice(choice.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus prodi ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Passing Score Aman</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      ~{choice.safeScoreThreshold}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Selisih vs Skormu</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        deltaVsScore >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {deltaVsScore >= 0 ? `+${deltaVsScore}` : deltaVsScore} poin
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Daya Tampung (Kuota)</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {choice.quota} kursi
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Peminat Tahun Lalu</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {choice.applicantsLastYear.toLocaleString('id-ID')} orang
                    </span>
                  </div>
                </div>

                {/* Probability Meter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Peluang Lolos:</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusConfig.bg}`}>
                        {statusZone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Estimasi Probabilitas:</span>
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {calculatedProbability}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusConfig.bar}`}
                      style={{ width: `${calculatedProbability}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Educational Strategy Guide: How SNBT Order Works */}
      <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs text-slate-700">
        <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Rahasia &amp; Logika Urutan Pilihan SNBT yang Benar (Sesuai Aturan Resmi BPPP):
        </h4>
        <ul className="space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Sistem Seleksi Bertingkat:</strong> Komputer BPPP akan memproses pilihanmu mulai dari Pilihan 1. Jika skormu memenuhi syarat lolos di Pilihan 1, kamu langsung diterima dan <em>Pilihan 2, 3, dan 4 gugur otomatis (tidak akan pernah diperiksa)</em>.
          </li>
          <li>
            <strong>Passing Grade Tidak Boleh Terbalik:</strong> Jangan menaruh prodi dengan passing grade rendah di Pilihan 1 dan prodi dengan passing grade tinggi di Pilihan 2. Jika skormu cukup untuk Pilihan 2, kamu sudah terlanjur diterima di Pilihan 1 dan kuota pilihan impianmu sia-sia!
          </li>
          <li>
            <strong>Pilihan 3 &amp; 4 Sebagai Jaring Pengaman (Vokasi):</strong> Manfaatkan kuota 4 pilihan secara cerdas dengan menaruh D4 atau D3 vokasi bereputasi tinggi (seperti PENS, Polban, PNJ) di pilihan 3 dan 4 agar memiliki kepastian kuliah di PTN negeri tanpa harus mengulang tahun depan.
          </li>
        </ul>
      </div>

      {/* 6. Modal: Add / Choose Program Studi */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Pilih Program Studi PTN (Pilihan #{choices.length + 1})
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih dari database resmi PTN populer atau masukkan prodi kustom
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Mode: Database Presets vs Custom Entry */}
            <div className="px-5 pt-3 border-b border-slate-100 flex gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsCustomPresetMode(false)}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  !isCustomPresetMode
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Database Resmi PTN ({POPULAR_PTN_PRESETS.length} Prodi Tersedia)
              </button>
              <button
                type="button"
                onClick={() => setIsCustomPresetMode(true)}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  isCustomPresetMode
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Input Kustom Prodi Sendiri
              </button>
            </div>

            {/* Content Mode 1: Database Preset */}
            {!isCustomPresetMode ? (
              <div className="p-5 space-y-4">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari kampus (ITB, UI, UGM, dll.) atau nama jurusan..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <select
                    value={selectedClusterFilter}
                    onChange={(e) => setSelectedClusterFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Semua">Semua Rumpun</option>
                    <option value="Saintek / Teknik">Saintek / Teknik</option>
                    <option value="Kesehatan">Kedokteran &amp; Kesehatan</option>
                    <option value="Soshum / Bisnis">Soshum / Bisnis</option>
                    <option value="Vokasi Terapan">Vokasi Terapan (D4/D3)</option>
                  </select>
                </div>

                {/* Preset List */}
                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {filteredPresets.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Tidak ditemukan prodi dengan kata kunci tersebut. Kamu bisa beralih ke tab "Input Kustom Prodi Sendiri".
                    </div>
                  ) : (
                    filteredPresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {preset.majorName}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                preset.degreeLevel === 'S1 (Sarjana)'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : preset.degreeLevel === 'D4 (Sarjana Terapan)'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {preset.degreeLevel}
                            </span>
                          </div>
                          <p className="text-slate-500">{preset.universityName}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span>Passing Score Aman: ~{preset.safeScoreThreshold}</span>
                            <span>·</span>
                            <span>Kuota: {preset.quota}</span>
                            <span>·</span>
                            <span>Peminat: {preset.applicantsLastYear}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0"
                        >
                          Pilih
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Content Mode 2: Custom Form */
              <form onSubmit={handleAddCustomChoice} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Perguruan Tinggi Negeri (PTN)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Universitas Indonesia"
                      value={customUniv}
                      onChange={(e) => setCustomUniv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Program Studi / Jurusan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Teknik Biomedis"
                      value={customMajor}
                      onChange={(e) => setCustomMajor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenjang</label>
                    <select
                      value={customDegree}
                      onChange={(e) => setCustomDegree(e.target.value as DegreeLevel)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="S1 (Sarjana)">S1 (Sarjana)</option>
                      <option value="D4 (Sarjana Terapan)">D4 (Sarjana Terapan)</option>
                      <option value="D3 (Diploma)">D3 (Diploma)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Estimasi Passing Score
                    </label>
                    <input
                      type="number"
                      required
                      min="400"
                      max="850"
                      value={customThreshold}
                      onChange={(e) => setCustomThreshold(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Daya Tampung (Kuota)
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="500"
                      value={customQuota}
                      onChange={(e) => setCustomQuota(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Peminat Tahun Lalu
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="10000"
                      value={customApplicants}
                      onChange={(e) => setCustomApplicants(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Strategi Pribadi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pilihan impian sejak SMP / Pilihan pengaman vokasi"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white rounded-xl shadow-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Tambahkan ke Pilihan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
