import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileEdit,
  X,
  Layers,
} from 'lucide-react';
import { TopicMastery, PaletteTheme, ActiveTrackType, TkaConfig } from '../types';
import { TkaSubjectSelector } from './TkaSubjectSelector';

interface MasteryTrackerProps {
  topics: TopicMastery[];
  activeTrack: ActiveTrackType;
  tkaConfig: TkaConfig;
  onUpdateTkaConfig: (config: TkaConfig) => void;
  currentTheme: PaletteTheme;
  onUpdateTopic: (updated: TopicMastery) => void;
  onAddTopic: (newTopic: TopicMastery) => void;
  onNavigateToJournal: (subject: string, topicName: string) => void;
}

export const MasteryTracker: React.FC<MasteryTrackerProps> = ({
  topics,
  activeTrack,
  tkaConfig,
  onUpdateTkaConfig,
  currentTheme,
  onUpdateTopic,
  onAddTopic,
  onNavigateToJournal,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New topic form state
  const [newSubject, setNewSubject] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newSubtopics, setNewSubtopics] = useState<string>('');
  const [newPercentage, setNewPercentage] = useState<number>(0);

  // Get active subjects for current track
  const getTrackSubjects = () => {
    if (activeTrack === 'TKA') {
      return [...tkaConfig.mandatorySubjects, ...tkaConfig.electiveSubjects];
    } else if (activeTrack === 'SNBT') {
      return [
        'Penalaran Umum (PU)',
        'Pengetahuan & Pemahaman Umum (PPU)',
        'Pemahaman Bacaan & Menulis (PBM)',
        'Pengetahuan Kuantitatif (PK)',
        'Literasi Bahasa Indonesia',
        'Literasi Bahasa Inggris',
        'Penalaran Matematika (PM)',
      ];
    } else {
      return [
        'Matematika Akademik (YÖS Style)',
        'Logika & Pola IQ (YTB Exam)',
        'Portofolio Dokumen & Rapor',
        'Letter of Intent (Niyet Mektubu)',
        'Persiapan Wawancara Resmi',
      ];
    }
  };

  const trackSubjects = getTrackSubjects();

  // Filter topics based on active track and TKA configuration
  const trackTopics = topics.filter((t) => {
    if (t.track !== activeTrack) return false;
    if (activeTrack === 'TKA') {
      return trackSubjects.includes(t.subject);
    }
    return true;
  });

  const filteredTopics = trackTopics.filter((t) => {
    const matchSubject = selectedSubject === 'Semua' || t.subject === selectedSubject;
    const matchStatus = selectedStatus === 'Semua' || t.status === selectedStatus;
    const matchSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtopics.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubject && matchStatus && matchSearch;
  });

  const handleAdjustHours = (topic: TopicMastery, delta: number) => {
    const newHours = Math.max(0, +(topic.hoursSpent + delta).toFixed(1));
    onUpdateTopic({
      ...topic,
      hoursSpent: newHours,
      lastStudied: new Date().toISOString().split('T')[0],
    });
  };

  const handleAdjustPercentage = (topic: TopicMastery, newPercentage: number) => {
    let status = topic.status;
    if (newPercentage >= 90) status = 'expert';
    else if (newPercentage >= 75) status = 'mastered';
    else if (newPercentage > 0) status = 'in_progress';
    else status = 'not_started';

    onUpdateTopic({
      ...topic,
      masteryPercentage: newPercentage,
      status,
      lastStudied: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSubject) return;

    let status: TopicMastery['status'] = 'not_started';
    if (newPercentage >= 90) status = 'expert';
    else if (newPercentage >= 75) status = 'mastered';
    else if (newPercentage > 0) status = 'in_progress';

    const subtopicsArr = newSubtopics
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created: TopicMastery = {
      id: `topic-${Date.now()}`,
      track: activeTrack,
      subject: newSubject,
      name: newName.trim(),
      subtopics: subtopicsArr.length > 0 ? subtopicsArr : ['Konsep Dasar', 'Latihan Soal'],
      masteryPercentage: newPercentage,
      status,
      hoursSpent: 0,
      lastStudied: new Date().toISOString().split('T')[0],
      confidence: 1,
    };

    onAddTopic(created);
    setNewName('');
    setNewSubtopics('');
    setNewPercentage(0);
    setIsAddModalOpen(false);
  };

  // Overall track stats
  const trackAvg = trackTopics.length > 0
    ? Math.round(trackTopics.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / trackTopics.length)
    : 0;
  const trackHours = +(trackTopics.reduce((acc, curr) => acc + curr.hoursSpent, 0)).toFixed(1);

  const trackTitles = {
    TKA: 'Penguasaan Materi TKA SMA (3 Wajib + 2 Pilihan)',
    SNBT: 'Penguasaan 7 Subtes Resmi UTBK-SNBT',
    YTB: 'Kurikulum Akademik & Berkas Türkiye Bursları (YÖS)',
  };

  return (
    <div className="space-y-6">
      {/* If TKA, show the 3 mandatory + 2 elective selector */}
      {activeTrack === 'TKA' && (
        <TkaSubjectSelector
          config={tkaConfig}
          currentTheme={currentTheme}
          onUpdateConfig={onUpdateTkaConfig}
        />
      )}

      {/* 1. Header Overview & Macro Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Jalur Terpilih: {activeTrack}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mt-0.5">
            {trackTitles[activeTrack]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Progres dimulai dari awal (0%). Mulai pelajari setiap bab langkah demi langkah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
              Rata-rata Penguasaan Jalur
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {trackAvg}%{' '}
              <span className="text-xs font-normal text-slate-400">({trackHours} jam)</span>
            </div>
          </div>

          <button
            onClick={() => {
              setNewSubject(trackSubjects[0]);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bab Materi</span>
          </button>
        </div>
      </div>

      {/* 2. Subject Cards Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {trackSubjects.map((subj) => {
          const subTopics = trackTopics.filter((t) => t.subject === subj);
          const avg = subTopics.length > 0
            ? Math.round(subTopics.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / subTopics.length)
            : 0;
          const isSelected = selectedSubject === subj;

          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(isSelected ? 'Semua' : subj)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate" title={subj}>
                    {subj}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {avg}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${avg}%`,
                      backgroundColor: currentTheme.primary,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>{subTopics.length} Bab</span>
                <span>{avg === 0 ? 'Belum Mulai' : `${avg}%`}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none max-w-[180px] truncate"
          >
            <option value="Semua">Semua Mapel ({trackSubjects.length})</option>
            {trackSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="not_started">Belum Mulai (0%)</option>
            <option value="in_progress">Sedang Dipelajari</option>
            <option value="mastered">Dikuasai (&gt;75%)</option>
            <option value="expert">Mahir (&gt;90%)</option>
          </select>
        </div>
      </div>

      {/* 4. Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const statusLabels = {
            not_started: { label: 'Belum Mulai (0%)', color: 'text-slate-500 bg-slate-100' },
            in_progress: { label: 'Sedang Dipelajari', color: 'text-blue-700 bg-blue-50 border border-blue-200' },
            mastered: { label: 'Dikuasai', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
            expert: { label: 'Mahir ⭐', color: 'text-amber-800 bg-amber-50 border border-amber-200' },
          };

          return (
            <div
              key={topic.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-semibold text-slate-800">{topic.subject}</span>
                    {topic.isMandatory && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        Mapel Wajib
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${statusLabels[topic.status].color}`}>
                    {statusLabels[topic.status].label}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {topic.name}
                </h3>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {topic.subtopics.map((st, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Tingkat Pemahaman:</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {topic.masteryPercentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={topic.masteryPercentage}
                    onChange={(e) => handleAdjustPercentage(topic, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600 font-mono tabular-nums">{topic.hoursSpent} jam</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <button
                        onClick={() => handleAdjustHours(topic, 0.5)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                        title="Tambah 30 menit"
                      >
                        +0.5j
                      </button>
                      <button
                        onClick={() => handleAdjustHours(topic, -0.5)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                        title="Kurang 30 menit"
                      >
                        -0.5j
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToJournal(topic.subject, topic.name)}
                    className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Catat Evaluasi</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada materi yang sesuai</h3>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan tombol "Tambah Bab Materi" di atas untuk menambahkan bab baru ke jalur ini.
          </p>
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Tambah Bab Materi ({activeTrack})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {trackSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bab / Pokok Bahasan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Barisan & Deret Aritmatika"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub-topik (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Suku ke-n, Deret geometri tak hingga"
                  value={newSubtopics}
                  onChange={(e) => setNewSubtopics(e.target.value)}
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
                  Simpan Bab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
