import React, { useState, useEffect } from 'react';
import {
  loadTopics,
  saveTopics,
  loadTryouts,
  saveTryouts,
  loadJournal,
  saveJournal,
  loadStreak,
  saveStreak,
  loadTheme,
  saveTheme,
  loadUniversityTargets,
  saveUniversityTargets,
  loadQuizQuestions,
  loadTkaConfig,
  saveTkaConfig,
  loadYtbPreferences,
  saveYtbPreferences,
  loadSnbtChoices,
  saveSnbtChoices,
  resetAllProgressToZero,
  logDailyStudyActivity,
  exportAllData,
  importAllData,
} from './utils/storage';
import {
  TopicMastery,
  TryoutRecord,
  JournalEntry,
  PaletteTheme,
  DailyStreakState,
  UniversityTarget,
  QuizQuestion,
  ActiveTrackType,
  TkaConfig,
  YtbPreferences,
  SnbtChoice,
} from './types';
import { Navbar } from './components/Navbar';
import { HeaderBanner } from './components/HeaderBanner';
import { StreakMotivationCard } from './components/StreakMotivationCard';
import { ColorPaletteModal } from './components/ColorPaletteModal';
import { MasteryTracker } from './components/MasteryTracker';
import { TryoutTracker } from './components/TryoutTracker';
import { JournalEvaluations } from './components/JournalEvaluations';
import { DailyMicroQuiz } from './components/DailyMicroQuiz';
import { TurkeyBurslariHub } from './components/TurkeyBurslariHub';
import { TkaSubjectSelector } from './components/TkaSubjectSelector';
import { SnbtTargetPlanner } from './components/SnbtTargetPlanner';
import {
  BookOpen,
  TrendingUp,
  FileText,
  Zap,
  GraduationCap,
  Sparkles,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Check,
  Layers,
  Tag,
  Target,
  X,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('track-hub');
  const [activeTrack, setActiveTrack] = useState<ActiveTrackType>('TKA');
  const [tkaConfig, setTkaConfig] = useState<TkaConfig>(loadTkaConfig());
  const [ytbPreferences, setYtbPreferences] = useState<YtbPreferences>(loadYtbPreferences());
  const [snbtChoices, setSnbtChoices] = useState<SnbtChoice[]>(loadSnbtChoices());

  const [topics, setTopics] = useState<TopicMastery[]>([]);
  const [tryouts, setTryouts] = useState<TryoutRecord[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState<DailyStreakState | null>(null);
  const [currentTheme, setCurrentTheme] = useState<PaletteTheme | null>(null);
  const [universityTargets, setUniversityTargets] = useState<UniversityTarget[]>([]);
  const [activeTarget, setActiveTarget] = useState<UniversityTarget | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Modals & Navigation
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [journalPrefill, setJournalPrefill] = useState<{ subject: string; topic: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    setTopics(loadTopics());
    setTryouts(loadTryouts());
    setJournal(loadJournal());
    setStreak(loadStreak());
    setCurrentTheme(loadTheme());
    const targets = loadUniversityTargets();
    setUniversityTargets(targets);
    setActiveTarget(targets[0]);
    setQuizQuestions(loadQuizQuestions());
    setTkaConfig(loadTkaConfig());
    setYtbPreferences(loadYtbPreferences());
    setSnbtChoices(loadSnbtChoices());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateYtbPreferences = (prefs: YtbPreferences) => {
    setYtbPreferences(prefs);
    saveYtbPreferences(prefs);
    showToast(prefs.isEnabled ? 'Jalur beasiswa Türkiye Bursları diaktifkan!' : 'Jalur beasiswa Türkiye Bursları dinonaktifkan.');
  };

  const handleUpdateSnbtChoices = (newChoices: SnbtChoice[]) => {
    setSnbtChoices(newChoices);
    saveSnbtChoices(newChoices);
    showToast(`Pilihan prodi SNBT diperbarui (${newChoices.length} prodi) 🎯`);
  };

  // TKA Configuration handler
  const handleUpdateTkaConfig = (newConfig: TkaConfig) => {
    setTkaConfig(newConfig);
    saveTkaConfig(newConfig);
    showToast(`Mata pelajaran pilihan TKA diset ke: ${newConfig.electiveSubjects.join(' & ')}! 📚`);
  };

  // Streak & Activity
  const handleAddStudyMinutes = (mins: number) => {
    const updated = logDailyStudyActivity(mins, false);
    setStreak({ ...updated });
    showToast(`Berhasil menambah ${mins} menit ke progres belajar hari ini! ⏱️`);
  };

  const handleQuickCheckIn = () => {
    const updated = logDailyStudyActivity(15, false);
    setStreak({ ...updated });
    showToast(`Check-in harian sukses! Streak kamu: ${updated.currentStreak} hari berturut-turut 🔥`);
  };

  const handleQuizCompleted = (earnedMinutes: number) => {
    const updated = logDailyStudyActivity(earnedMinutes, true);
    setStreak({ ...updated });
    showToast(`Latihan soal tuntas! +${earnedMinutes} menit belajar & streak tersimpan 🎉`);
  };

  // Topic Mastery
  const handleUpdateTopic = (updated: TopicMastery) => {
    const newTopics = topics.map((t) => (t.id === updated.id ? updated : t));
    setTopics(newTopics);
    saveTopics(newTopics);
  };

  const handleAddTopic = (newTopic: TopicMastery) => {
    const newTopics = [newTopic, ...topics];
    setTopics(newTopics);
    saveTopics(newTopics);
    showToast(`Materi "${newTopic.name}" berhasil ditambahkan! 📚`);
  };

  // Tryouts
  const handleAddTryout = (newRecord: TryoutRecord) => {
    const newTryouts = [...tryouts, newRecord];
    setTryouts(newTryouts);
    saveTryouts(newTryouts);
    showToast(`Skor Tryout "${newRecord.title}" berhasil direkap! 📈`);
  };

  const handleDeleteTryout = (id: string) => {
    const newTryouts = tryouts.filter((t) => t.id !== id);
    setTryouts(newTryouts);
    saveTryouts(newTryouts);
    showToast('Data tryout berhasil dihapus.');
  };

  // Journal
  const handleAddJournalEntry = (entry: JournalEntry) => {
    const newJournal = [entry, ...journal];
    setJournal(newJournal);
    saveJournal(newJournal);
    if (entry.durationMinutes > 0) {
      const updatedStreak = logDailyStudyActivity(entry.durationMinutes, false);
      setStreak({ ...updatedStreak });
    }
    showToast('Catatan evaluasi belajar & error log berhasil disimpan! ✍️');
  };

  const handleToggleResolvedJournal = (id: string) => {
    const newJournal = journal.map((j) =>
      j.id === id ? { ...j, isResolved: !j.isResolved } : j
    );
    setJournal(newJournal);
    saveJournal(newJournal);
    showToast('Status evaluasi diperbarui.');
  };

  const handleDeleteJournal = (id: string) => {
    const newJournal = journal.filter((j) => j.id !== id);
    setJournal(newJournal);
    saveJournal(newJournal);
    showToast('Catatan jurnal dihapus.');
  };

  const handleSendQuizErrorToJournal = (
    subject: string,
    topic: string,
    weakness: string
  ) => {
    const newEntry: JournalEntry = {
      id: `j-quiz-${Date.now()}`,
      track: activeTrack,
      date: new Date().toISOString().split('T')[0],
      subject,
      topic,
      durationMinutes: 10,
      energyLevel: 3,
      weaknesses: weakness,
      actionPlan: 'Review konsep kunci dan kerjakan ulang variasi soal serupa.',
      isResolved: false,
    };
    handleAddJournalEntry(newEntry);
  };

  const handleNavigateToJournalWithPrefill = (subject: string, topicName: string) => {
    setJournalPrefill({ subject, topic: topicName });
    setActiveTab('journal');
  };

  // Theme application
  const handleApplyTheme = (newTheme: PaletteTheme, updateCampusImage?: boolean) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);

    if (updateCampusImage && newTheme.imageUrl && activeTarget) {
      const updatedTarget: UniversityTarget = {
        ...activeTarget,
        imageUrl: newTheme.imageUrl,
      };
      setActiveTarget(updatedTarget);
      const newTargets = universityTargets.map((u) =>
        u.name === activeTarget.name ? updatedTarget : u
      );
      setUniversityTargets(newTargets);
      saveUniversityTargets(newTargets);
    }

    showToast(`Palet "${newTheme.name}" aktif diterapkan ke seluruh website! 🎨`);
  };

  // Reset all progress to 0% from scratch
  const handleExecuteResetToZero = () => {
    const resetResult = resetAllProgressToZero();
    setTopics(resetResult.topics);
    setTryouts(resetResult.tryouts);
    setJournal(resetResult.journal);
    setStreak(resetResult.streak);
    setIsResetModalOpen(false);
    showToast('Progress berhasil di-reset ke 0%! Selamat memulai dari awal 🚀');
  };

  // Campus Target
  const handleToggleChecklistItem = (univName: string, checklistId: string) => {
    const newTargets = universityTargets.map((u) => {
      if (u.name === univName) {
        return {
          ...u,
          scholarshipChecklist: u.scholarshipChecklist.map((c) =>
            c.id === checklistId ? { ...c, done: !c.done } : c
          ),
        };
      }
      return u;
    });
    setUniversityTargets(newTargets);
    saveUniversityTargets(newTargets);

    if (activeTarget && activeTarget.name === univName) {
      const updatedActive = newTargets.find((u) => u.name === univName) || activeTarget;
      setActiveTarget(updatedActive);
    }
  };

  const handleSelectActiveTarget = (target: UniversityTarget) => {
    setActiveTarget(target);
    showToast(`Target utama diset ke "${target.name}" 🎯`);
  };

  // Data Export/Import
  const handleExportData = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studikuasai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cadangan data berhasil diekspor!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) {
        setTopics(loadTopics());
        setTryouts(loadTryouts());
        setJournal(loadJournal());
        setStreak(loadStreak());
        setCurrentTheme(loadTheme());
        setUniversityTargets(loadUniversityTargets());
        showToast('Data berhasil dipulihkan dari cadangan!');
      } else {
        showToast('Gagal memulihkan data: Format file tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  if (!currentTheme || !streak || !activeTarget) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Memuat StudiKuasai Tracker...</span>
        </div>
      </div>
    );
  }

  // Active track specific topics
  const trackSubjects = activeTrack === 'TKA'
    ? [...tkaConfig.mandatorySubjects, ...tkaConfig.electiveSubjects]
    : activeTrack === 'SNBT'
    ? ['Penalaran Umum (PU)', 'Pengetahuan & Pemahaman Umum (PPU)', 'Pemahaman Bacaan & Menulis (PBM)', 'Pengetahuan Kuantitatif (PK)', 'Literasi Bahasa Indonesia', 'Literasi Bahasa Inggris', 'Penalaran Matematika (PM)']
    : ['Matematika Akademik (YÖS Style)', 'Logika & Pola IQ (YTB Exam)', 'Portofolio Dokumen & Rapor', 'Letter of Intent (Niyet Mektubu)', 'Persiapan Wawancara Resmi'];

  const trackTopics = topics.filter((t) => t.track === activeTrack && trackSubjects.includes(t.subject));
  const trackAvgMastery = trackTopics.length > 0
    ? Math.round(trackTopics.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / trackTopics.length)
    : 0;

  const trackTryouts = tryouts.filter((t) => t.track === activeTrack);
  const trackJournal = journal.filter((j) => j.track === activeTrack);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Global Navigation Bar with Top Track Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTrack={activeTrack}
        setActiveTrack={(tr) => {
          setActiveTrack(tr);
          setActiveTab('track-hub');
        }}
        currentTheme={currentTheme}
        streakState={streak}
        isYtbEnabled={ytbPreferences.isEnabled}
        onOpenPaletteModal={() => setIsPaletteModalOpen(true)}
        onQuickCheckIn={handleQuickCheckIn}
        onResetProgress={() => setIsResetModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Persistent Top Header Banner */}
        <HeaderBanner
          currentTheme={currentTheme}
          activeTrack={activeTrack}
          activeTarget={activeTarget}
          onOpenPaletteModal={() => setIsPaletteModalOpen(true)}
          onGoToHub={() => setActiveTab('turkey-hub')}
        />

        {/* Motivational Streak & Daily Target Bar */}
        <StreakMotivationCard
          streak={streak}
          currentTheme={currentTheme}
          onAddStudyMinutes={handleAddStudyMinutes}
          onStartQuiz={() => setActiveTab('quiz')}
        />

        {/* TAB 1: TRACK HUB (DEDICATED DASHBOARD PER TRACK) */}
        {activeTab === 'track-hub' && (
          <div className="space-y-6">
            {/* If TKA, show configuration for 3 mandatory + 2 electives */}
            {activeTrack === 'TKA' && (
              <TkaSubjectSelector
                config={tkaConfig}
                currentTheme={currentTheme}
                onUpdateConfig={handleUpdateTkaConfig}
                onNavigateToQuiz={() => setActiveTab('quiz')}
              />
            )}

            {/* If YTB, render the comprehensive Turkey Burslari Hub directly */}
            {activeTrack === 'YTB' && (
              <TurkeyBurslariHub
                targets={universityTargets}
                activeTarget={activeTarget}
                currentTheme={currentTheme}
                ytbPreferences={ytbPreferences}
                onUpdateYtbPreferences={handleUpdateYtbPreferences}
                onSelectActiveTarget={handleSelectActiveTarget}
                onToggleChecklistItem={handleToggleChecklistItem}
              />
            )}

            {/* Split View for TKA and SNBT Tracks */}
            {activeTrack !== 'YTB' && (
              <div className="space-y-6">
                {/* For SNBT: Highlight 1-4 Choice Strategy & Probability */}
                {activeTrack === 'SNBT' && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                            Pilihan Prodi PTN Impian &amp; Peluang Masuk (1–4 Prodi)
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {snbtChoices.length}/4 Prodi Terpilih
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                          Sistem seleksi BPPP memproses kelulusan secara berurutan. Hitung persentase peluang diterima berdasarkan skor tryoutmu, evaluasi kesesuaian aturan akademik/vokasi, dan dapatkan rekomendasi urutan pilihan 1, 2, 3, dan 4 yang paling aman.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('snbt-targets')}
                      className="px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <span>Buka Peluang &amp; Urutan Prodi</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Penguasaan Materi Jalur Ini */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Penguasaan Materi {activeTrack === 'TKA' ? 'TKA SMA (3 Wajib + 2 Pilihan)' : '7 Subtes UTBK-SNBT'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Rata-rata saat ini: <strong className="font-mono text-slate-800">{trackAvgMastery}%</strong> (Mulai dari 0%)
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('mastery')}
                        className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        style={{ color: currentTheme.primary }}
                      >
                        <span>Detail Bab</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {trackSubjects.slice(0, 5).map((subj) => {
                        const subTopics = trackTopics.filter((t) => t.subject === subj);
                        const avg = subTopics.length > 0
                          ? Math.round(subTopics.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / subTopics.length)
                          : 0;

                        return (
                          <div key={subj} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-slate-900">{subj}</span>
                              <span className="font-mono font-bold text-slate-800">{avg}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${avg}%`,
                                  backgroundColor: currentTheme.primary,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Error Log Jalur Ini */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          Error Log &amp; Evaluasi ({activeTrack})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Catatan kelemahan untuk jalur belajar aktif.
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('journal')}
                        className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        style={{ color: currentTheme.primary }}
                      >
                        <span>Buka Jurnal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {trackJournal.length > 0 ? (
                      <div className="space-y-3">
                        {trackJournal.slice(0, 2).map((j) => (
                          <div
                            key={j.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{j.subject} · {j.topic}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                j.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {j.isResolved ? 'Selesai' : 'Perlu Perbaikan'}
                              </span>
                            </div>
                            <p className="text-slate-700"><strong>Kelemahan:</strong> {j.weaknesses}</p>
                            <p className="text-slate-500 italic"><strong>Solusi:</strong> {j.actionPlan}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500">
                        Belum ada catatan kelemahan di jalur {activeTrack}. Catat evaluasi setelah latihan soal!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Latihan Soal Asli / FR & Rekap Tryout Preview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Latihan Soal Asli / FR Callout */}
                  <div 
                    className="p-6 rounded-2xl border shadow-xs space-y-4"
                    style={{
                      backgroundColor: currentTheme.bgTint,
                      borderColor: `${currentTheme.primary}40`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Latihan Soal Bocoran &amp; Asli (FR)
                        </h4>
                        <div className="text-[11px] font-mono text-indigo-700 font-semibold mt-0.5">
                          Fokus Jalur: {activeTrack}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Kumpulan soal-soal autentik yang sangat mirip dengan Field Report (FR) dan arsip soal asli ujian tahun 2024–2026.
                    </p>

                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <span>Mulai Latihan Soal Asli ({activeTrack})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tryout Preview */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          Rekap Tryout {activeTrack}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {trackTryouts.length} kali tryout terdata
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('tryout')}
                        className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        style={{ color: currentTheme.primary }}
                      >
                        <span>Buka Rekap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {trackTryouts.length > 0 ? (
                      <div className="space-y-2">
                        {trackTryouts.slice(-3).reverse().map((to) => (
                          <div
                            key={to.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{to.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{to.date}</div>
                            </div>
                            <div className="text-right font-mono font-bold text-slate-900">
                              {to.totalScore} <span className="text-[10px] text-slate-400">/ {to.targetScore}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500">
                        Mulai dari nol! Belum ada rekaman tryout jalur {activeTrack}.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* TAB: TARGET PRODI & PELUANG SNBT */}
        {activeTab === 'snbt-targets' && (
          <SnbtTargetPlanner
            choices={snbtChoices}
            tryouts={tryouts}
            currentTheme={currentTheme}
            onUpdateChoices={handleUpdateSnbtChoices}
            onNavigateToTryout={() => setActiveTab('tryout')}
          />
        )}

        {/* TAB 2: PENGUASAAN MATERI */}
        {activeTab === 'mastery' && (
          <MasteryTracker
            topics={topics}
            activeTrack={activeTrack}
            tkaConfig={tkaConfig}
            onUpdateTkaConfig={handleUpdateTkaConfig}
            currentTheme={currentTheme}
            onUpdateTopic={handleUpdateTopic}
            onAddTopic={handleAddTopic}
            onNavigateToJournal={handleNavigateToJournalWithPrefill}
          />
        )}

        {/* TAB 3: LATIHAN SOAL ASLI / FR */}
        {activeTab === 'quiz' && (
          <DailyMicroQuiz
            questions={quizQuestions}
            activeTrack={activeTrack}
            tkaConfig={tkaConfig}
            currentTheme={currentTheme}
            onQuizCompleted={handleQuizCompleted}
            onSendToJournal={handleSendQuizErrorToJournal}
          />
        )}

        {/* TAB 4: REKAP TRYOUT */}
        {activeTab === 'tryout' && (
          <TryoutTracker
            tryouts={tryouts}
            activeTrack={activeTrack}
            tkaConfig={tkaConfig}
            currentTheme={currentTheme}
            onAddTryout={handleAddTryout}
            onDeleteTryout={handleDeleteTryout}
          />
        )}

        {/* TAB 5: JURNAL EVALUASI */}
        {activeTab === 'journal' && (
          <JournalEvaluations
            journal={journal}
            activeTrack={activeTrack}
            currentTheme={currentTheme}
            prefillSubject={journalPrefill?.subject}
            prefillTopic={journalPrefill?.topic}
            onAddEntry={handleAddJournalEntry}
            onToggleResolved={handleToggleResolvedJournal}
            onDeleteEntry={handleDeleteJournal}
          />
        )}

        {/* Dedicated Türkiye Bursları Hub */}
        {activeTab === 'turkey-hub' && (
          <TurkeyBurslariHub
            targets={universityTargets}
            activeTarget={activeTarget}
            currentTheme={currentTheme}
            ytbPreferences={ytbPreferences}
            onUpdateYtbPreferences={handleUpdateYtbPreferences}
            onSelectActiveTarget={handleSelectActiveTarget}
            onToggleChecklistItem={handleToggleChecklistItem}
          />
        )}
      </main>

      {/* 3. Color Palette Modal */}
      <ColorPaletteModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        currentTheme={currentTheme}
        onApplyTheme={handleApplyTheme}
      />

      {/* 4. Reset Progress to Zero Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Reset Progress Belajar ke Awal (0%)?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tindakan ini akan mengatur ulang seluruh persentase penguasaan bab menjadi 0%, mengosongkan riwayat jam belajar, tryout, dan jurnal evaluasi agar kamu bisa memulai perjalanan belajar secara bersih dan terstruktur dari awal.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteResetToZero}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Ya, Mulai dari Nol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Quiet Functional Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 font-['Outfit']">StudiKuasai</span>
            <span>·</span>
            <span>TKA SMA (3 Wajib + 2 Pilihan) · UTBK-SNBT · Türkiye Bursları</span>
            <span>·</span>
            <span>Kelas 12</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
              title="Cadangkan data ke file JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Cadangan</span>
            </button>

            <span>·</span>

            <label className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Pulihkan Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </footer>
    </div>
  );
}
