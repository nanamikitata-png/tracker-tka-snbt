import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Trash2,
  X,
  Target,
} from 'lucide-react';
import { TryoutRecord, SubScore, PaletteTheme, ActiveTrackType, TkaConfig } from '../types';

interface TryoutTrackerProps {
  tryouts: TryoutRecord[];
  activeTrack: ActiveTrackType;
  tkaConfig: TkaConfig;
  currentTheme: PaletteTheme;
  onAddTryout: (record: TryoutRecord) => void;
  onDeleteTryout: (id: string) => void;
}

export const TryoutTracker: React.FC<TryoutTrackerProps> = ({
  tryouts,
  activeTrack,
  tkaConfig,
  currentTheme,
  onAddTryout,
  onDeleteTryout,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [track, setTrack] = useState<ActiveTrackType>(activeTrack);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalScore, setTotalScore] = useState<number>(680);
  const [targetScore, setTargetScore] = useState<number>(720);
  const [rank, setRank] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');

  const getDefaultSubScores = (selectedTrack: ActiveTrackType): SubScore[] => {
    if (selectedTrack === 'TKA') {
      return [
        { name: 'Matematika (Wajib)', score: 70, maxScore: 100 },
        { name: 'Bahasa Indonesia', score: 75, maxScore: 100 },
        { name: 'Bahasa Inggris', score: 70, maxScore: 100 },
        { name: tkaConfig.electiveSubjects[0] || 'Fisika', score: 65, maxScore: 100 },
        { name: tkaConfig.electiveSubjects[1] || 'Kimia', score: 68, maxScore: 100 },
      ];
    } else if (selectedTrack === 'SNBT') {
      return [
        { name: 'Penalaran Umum (PU)', score: 650, maxScore: 1000 },
        { name: 'Pengetahuan Kuantitatif (PK)', score: 640, maxScore: 1000 },
        { name: 'Penalaran Matematika (PM)', score: 620, maxScore: 1000 },
        { name: 'Literasi Bahasa Indonesia', score: 670, maxScore: 1000 },
        { name: 'Literasi Bahasa Inggris', score: 600, maxScore: 1000 },
      ];
    } else {
      return [
        { name: 'Matematika Akademik YÖS', score: 80, maxScore: 100 },
        { name: 'Pola IQ & Spasial 3D', score: 85, maxScore: 100 },
        { name: 'Penilaian Wacana Akademik', score: 75, maxScore: 100 },
      ];
    }
  };

  const [subScores, setSubScores] = useState<SubScore[]>(getDefaultSubScores(activeTrack));

  // Filter tryouts by current track
  const filteredTryouts = tryouts.filter((t) => t.track === activeTrack);

  const latestTryout = filteredTryouts[filteredTryouts.length - 1];
  const highestScore = filteredTryouts.reduce((max, t) => (t.totalScore > max ? t.totalScore : max), 0);
  const avgScore = filteredTryouts.length > 0
    ? Math.round(filteredTryouts.reduce((acc, t) => acc + t.totalScore, 0) / filteredTryouts.length)
    : 0;

  const scoreDelta = filteredTryouts.length >= 2
    ? filteredTryouts[filteredTryouts.length - 1].totalScore - filteredTryouts[filteredTryouts.length - 2].totalScore
    : 0;

  // Chart setup
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 30;

  const points = filteredTryouts.map((t, idx) => {
    const isHundredScale = t.targetScore <= 100;
    const minVal = isHundredScale ? 40 : 400;
    const maxVal = isHundredScale ? 100 : 1000;
    const x = paddingX + (idx / Math.max(1, filteredTryouts.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((t.totalScore - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, score: t.totalScore, title: t.title, date: t.date };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  const handleSubScoreChange = (index: number, key: 'name' | 'score' | 'maxScore', val: any) => {
    const updated = [...subScores];
    updated[index] = { ...updated[index], [key]: val };
    setSubScores(updated);

    if (key === 'score') {
      const sum = updated.reduce((acc, s) => acc + (Number(s.score) || 0), 0);
      const avg = Math.round(sum / updated.length);
      setTotalScore(avg);
    }
  };

  const handleAddSubScoreRow = () => {
    setSubScores([...subScores, { name: 'Subtes Baru', score: 65, maxScore: 100 }]);
  };

  const handleRemoveSubScoreRow = (idx: number) => {
    if (subScores.length <= 1) return;
    setSubScores(subScores.filter((_, i) => i !== idx));
  };

  const handleOpenModal = () => {
    setTrack(activeTrack);
    setSubScores(getDefaultSubScores(activeTrack));
    if (activeTrack === 'SNBT') {
      setTotalScore(680);
      setTargetScore(720);
    } else {
      setTotalScore(75);
      setTargetScore(85);
    }
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecord: TryoutRecord = {
      id: `to-${Date.now()}`,
      track,
      title: title.trim(),
      date,
      totalScore: Number(totalScore),
      targetScore: Number(targetScore),
      rank: rank.trim() || undefined,
      percentile: +(Math.min(99.5, 60 + (totalScore / (targetScore <= 100 ? 100 : 1000)) * 40)).toFixed(1),
      subScores,
      analysis: analysis.trim() || 'Evaluasi latihan terdata.',
    };

    onAddTryout(newRecord);
    setTitle('');
    setAnalysis('');
    setRank('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Jalur Terpilih: {activeTrack}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mt-0.5">
            Rekap Skor Tryout Jalur {activeTrack}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mulai dari awal (0 simulasi). Catat hasil tryout pertamamu untuk melihat grafik perkembangan.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="w-4 h-4" />
          <span>Input Skor Tryout Baru</span>
        </button>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Skor Tryout Terakhir
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {latestTryout ? latestTryout.totalScore : '-'}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1 font-medium">
            {filteredTryouts.length >= 2 ? (
              scoreDelta >= 0 ? (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{scoreDelta} poin
                </span>
              ) : (
                <span className="text-rose-600">{scoreDelta} poin</span>
              )
            ) : (
              <span className="text-slate-400">Belum ada pembanding</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Skor Tertinggi Dicapai
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {highestScore || '-'}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target: <strong className="text-slate-800 font-mono">{activeTrack === 'SNBT' ? '720+' : '85+'}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Rata-rata Skor
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {avgScore || '-'}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total {filteredTryouts.length} kali tryout
          </div>
        </div>

        <div 
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: currentTheme.bgTint,
            borderColor: `${currentTheme.primary}40`,
          }}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
            Status Kesiapan Jalur
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {filteredTryouts.length === 0 ? 'Mulai Simulasi 1' : avgScore >= 700 || avgScore >= 80 ? 'Sangat Aman' : 'Perlu Push'}
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            {activeTrack === 'TKA' ? 'Kurikulum SMA 3+2' : activeTrack === 'SNBT' ? 'Target PTN 2027' : 'YTB 2027'}
          </div>
        </div>
      </div>

      {/* 3. SVG Progression Curve */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Kurva Nilai Simulasi ({activeTrack})
            </h3>
            <p className="text-xs text-slate-500">
              Perkembangan nilai tryout dari awal menuju target.
            </p>
          </div>
        </div>

        {filteredTryouts.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full min-w-[500px] h-48 overflow-visible"
            >
              {points.length > 1 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`}
                  fill={currentTheme.primary}
                  fillOpacity="0.08"
                />
              )}

              {points.length > 0 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={currentTheme.primary}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#ffffff"
                    stroke={currentTheme.primary}
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#0f172a"
                    fontFamily="monospace"
                  >
                    {p.score}
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - paddingY + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                  >
                    {p.date.split('-').slice(1).join('/')}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">Belum Ada Rekap Nilai Tryout</div>
            <div className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Progress kamu dimulai dari nol! Klik tombol "Input Skor Tryout Baru" di atas untuk mencatat skor simulasi pertamamu.
            </div>
          </div>
        )}
      </div>

      {/* 4. Detailed History List */}
      <div className="space-y-4">
        {filteredTryouts.map((to) => (
          <div
            key={to.id}
            className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">{to.track}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {to.date}
                  </span>
                  {to.rank && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-indigo-700 font-medium">{to.rank}</span>
                    </>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900">{to.title}</h4>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 uppercase font-medium">Total Skor</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    {to.totalScore}{' '}
                    <span className="text-xs font-normal text-slate-400">/ {to.targetScore}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTryout(to.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Hapus rekaman tryout"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
              {to.subScores.map((sub, i) => {
                const subPercent = Math.min(100, Math.round((sub.score / sub.maxScore) * 100));
                return (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate font-medium text-[11px]">{sub.name}</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {sub.score}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${subPercent}%`,
                          backgroundColor: currentTheme.primary,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {to.analysis && (
              <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100 flex items-start gap-2">
                <span className="font-semibold text-slate-900 shrink-0">Evaluasi Sesi:</span>
                <span>{to.analysis}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Input Skor Tryout ({track})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jalur Ujian
                  </label>
                  <select
                    value={track}
                    onChange={(e) => {
                      const newT = e.target.value as ActiveTrackType;
                      setTrack(newT);
                      setSubScores(getDefaultSubScores(newT));
                    }}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="TKA">TKA SMA (3 Wajib + 2 Pilihan)</option>
                    <option value="SNBT">UTBK-SNBT (7 Subtes)</option>
                    <option value="YTB">Türkiye Bursları / YÖS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Tryout
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Tryout / Penyelenggara
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tryout TKA SMA Sekolah #1 / TO Akbar SNBT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Skor
                  </label>
                  <input
                    type="number"
                    required
                    value={totalScore}
                    onChange={(e) => setTotalScore(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Skor
                  </label>
                  <input
                    type="number"
                    required
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ranking (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Peringkat 12 / 180"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Breakdown Nilai Subtes
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSubScoreRow}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    + Tambah Subtes
                  </button>
                </div>

                <div className="space-y-2">
                  {subScores.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleSubScoreChange(idx, 'name', e.target.value)}
                        className="flex-1 text-xs border border-slate-300 rounded-lg p-1.5"
                        placeholder="Nama Subtes"
                      />
                      <input
                        type="number"
                        value={sub.score}
                        onChange={(e) => handleSubScoreChange(idx, 'score', Number(e.target.value))}
                        className="w-20 text-xs border border-slate-300 rounded-lg p-1.5 font-mono"
                        placeholder="Skor"
                      />
                      <span className="text-xs text-slate-400">/</span>
                      <input
                        type="number"
                        value={sub.maxScore}
                        onChange={(e) => handleSubScoreChange(idx, 'maxScore', Number(e.target.value))}
                        className="w-20 text-xs border border-slate-300 rounded-lg p-1.5 font-mono"
                        placeholder="Max"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSubScoreRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluasi &amp; Catatan Khusus
                </label>
                <textarea
                  rows={3}
                  placeholder="Catatan kelemahan subtes tertentu..."
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Simpan Tryout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
