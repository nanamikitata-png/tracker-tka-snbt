import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Clock,
  Battery,
  Search,
  Check,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import { JournalEntry, PaletteTheme, ActiveTrackType } from '../types';

interface JournalEvaluationsProps {
  journal: JournalEntry[];
  activeTrack: ActiveTrackType;
  currentTheme: PaletteTheme;
  prefillSubject?: string;
  prefillTopic?: string;
  onAddEntry: (entry: JournalEntry) => void;
  onToggleResolved: (id: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalEvaluations: React.FC<JournalEvaluationsProps> = ({
  journal,
  activeTrack,
  currentTheme,
  prefillSubject,
  prefillTopic,
  onAddEntry,
  onToggleResolved,
  onDeleteEntry,
}) => {
  const [filterMode, setFilterMode] = useState<'track' | 'all'>('track');
  const [filterResolved, setFilterResolved] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Journal Form State
  const [track, setTrack] = useState<ActiveTrackType>(activeTrack);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState<string>(prefillSubject || (activeTrack === 'TKA' ? 'Matematika (Wajib)' : activeTrack === 'SNBT' ? 'Penalaran Matematika (PM)' : 'Matematika Akademik (YÖS Style)'));
  const [topic, setTopic] = useState<string>(prefillTopic || '');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [weaknesses, setWeaknesses] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');

  const filteredJournal = journal.filter((item) => {
    const matchTrack = filterMode === 'all' || item.track === activeTrack;
    const matchResolved =
      filterResolved === 'Semua' ||
      (filterResolved === 'resolved' && item.isResolved) ||
      (filterResolved === 'unresolved' && !item.isResolved);
    const matchSearch =
      searchQuery === '' ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.weaknesses.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actionPlan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTrack && matchResolved && matchSearch;
  });

  const unresolvedCount = filteredJournal.filter((j) => !j.isResolved).length;
  const resolvedCount = filteredJournal.filter((j) => j.isResolved).length;
  const totalStudyMinutes = filteredJournal.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !weaknesses.trim()) return;

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      track,
      date,
      subject: subject.trim(),
      topic: topic.trim(),
      durationMinutes: Number(durationMinutes),
      energyLevel,
      weaknesses: weaknesses.trim(),
      actionPlan: actionPlan.trim() || 'Lakukan re-evaluasi pada latihan berikutnya.',
      isResolved: false,
    };

    onAddEntry(newEntry);
    setTopic('');
    setWeaknesses('');
    setActionPlan('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Jalur Terpilih: {activeTrack}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mt-0.5">
            Jurnal Evaluasi &amp; Error Log ({activeTrack})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catat titik kekeliruan konsep agar tidak terulang lagi saat simulasi atau ujian asli.
          </p>
        </div>

        <button
          onClick={() => {
            setTrack(activeTrack);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Evaluasi Sesi</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Error Aktif (Perlu Dibenahi)
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
              {unresolvedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Konsep Sudah Dipahami
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mt-1">
              {resolvedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Waktu Sesi Terefleksi
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {Math.floor(totalStudyMinutes / 60)}j {totalStudyMinutes % 60}m
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kelemahan atau aksi perbaikan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filter Track & Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterMode('track')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterMode === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fokus Jalur {activeTrack}
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Jalur
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterResolved('Semua')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterResolved === 'Semua' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterResolved('unresolved')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterResolved === 'unresolved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Tuntas
            </button>
          </div>
        </div>
      </div>

      {/* 4. Journal Entries Feed */}
      <div className="space-y-4">
        {filteredJournal.map((entry) => (
          <div
            key={entry.id}
            className={`p-5 rounded-xl border transition-all ${
              entry.isResolved
                ? 'border-emerald-200/80 bg-emerald-50/20'
                : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-900">{entry.subject}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                  {entry.track}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-mono">{entry.date}</span>
                <span className="text-slate-400">·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {entry.durationMinutes} menit
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleResolved(entry.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    entry.isResolved
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{entry.isResolved ? 'Sudah Teratasi' : 'Tandai Selesai'}</span>
                </button>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Hapus catatan evaluasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">{entry.topic}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-xs space-y-1">
                <div className="font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Kelemahan &amp; Titik Error yang Terjadi
                </div>
                <p className="text-slate-700 leading-relaxed">{entry.weaknesses}</p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Poin Perbaikan &amp; Strategi Sesi Selanjutnya
                </div>
                <p className="text-slate-700 leading-relaxed">{entry.actionPlan}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredJournal.length === 0 && (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">Belum Ada Evaluasi Jurnal</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Progress kamu dimulai dari nol! Setiap kali kamu selesai mengerjakan soal atau merasa ada konsep yang membingungkan, catat di sini agar terpetakan.
            </p>
          </div>
        )}
      </div>

      {/* Write Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Catat Evaluasi &amp; Error Log Sesi Belajar
                </h3>
                <p className="text-xs text-slate-500">
                  Jalur: {track} · Refleksi 2 menit untuk mencegah kesalahan berulang.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jalur Belajar
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as ActiveTrackType)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="TKA">TKA SMA</option>
                    <option value="SNBT">UTBK-SNBT</option>
                    <option value="YTB">Türkiye Bursları</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Sesi
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
                  Mata Pelajaran / Subtes
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika (Wajib) / Fisika / Penalaran Matematika"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pokok Bahasan / Nomor Soal
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Titrasi Asam Basa & Penyangga / Soal Tangki Debit"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durasi Sesi (Menit)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Fokus (1 - 5)
                  </label>
                  <select
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value) as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Sangat Fokus)</option>
                    <option value={4}>⭐⭐⭐⭐ (Fokus Baik)</option>
                    <option value={3}>⭐⭐⭐ (Standar)</option>
                    <option value={2}>⭐⭐ (Agak Lelah)</option>
                    <option value={1}>⭐ (Kurang Fokus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-rose-700">
                  Kelemahan atau Error Log (Di mana letak salahnya?)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Kurang teliti saat mensubstitusi batas nilai mutlak ketika x < 0..."
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-indigo-700">
                  Poin Perbaikan &amp; Action Plan Sesi Selanjutnya
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Tulis selalu syarat x < 0 dengan spidol merah sebelum menghitung..."
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
