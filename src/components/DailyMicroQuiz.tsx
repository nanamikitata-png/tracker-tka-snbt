import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Pause,
  Play,
  Tag,
  Star,
  Layers,
  ChevronRight,
  BookmarkPlus,
  Compass,
} from 'lucide-react';
import { QuizQuestion, PaletteTheme, ActiveTrackType, TkaConfig } from '../types';

interface DailyMicroQuizProps {
  questions: QuizQuestion[];
  activeTrack: ActiveTrackType;
  tkaConfig: TkaConfig;
  currentTheme: PaletteTheme;
  onQuizCompleted: (earnedMinutes: number) => void;
  onSendToJournal: (subject: string, topic: string, weakness: string) => void;
}

export const DailyMicroQuiz: React.FC<DailyMicroQuizProps> = ({
  questions,
  activeTrack,
  tkaConfig,
  currentTheme,
  onQuizCompleted,
  onSendToJournal,
}) => {
  // Subject Filter State ('ALL' or specific subject name)
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Compute available subjects for the current track with question counts
  const trackQuestions = questions.filter((q) => q.track === activeTrack);

  const getAvailableSubjects = () => {
    if (activeTrack === 'TKA') {
      const wajib = [...tkaConfig.mandatorySubjects];
      const pilihanUser = [...tkaConfig.electiveSubjects];
      const allTkaSubjects = [
        'Matematika (Wajib)',
        'Bahasa Indonesia',
        'Bahasa Inggris',
        'Biologi',
        'Fisika',
        'Kimia',
        'Matematika Tingkat Lanjut',
        'Informatika',
        'Ekonomi',
        'Sosiologi',
        'Geografi',
      ];

      return allTkaSubjects.map((name) => {
        const count = trackQuestions.filter((q) => q.subject.toLowerCase() === name.toLowerCase()).length;
        const isWajib = wajib.some((w) => w.toLowerCase() === name.toLowerCase());
        const isPilihanUser = pilihanUser.some((p) => p.toLowerCase() === name.toLowerCase());

        return {
          name,
          count,
          isWajib,
          isPilihanUser,
        };
      });
    }

    if (activeTrack === 'SNBT') {
      const snbtSubtests = [
        'Penalaran Umum (PU)',
        'Pengetahuan & Pemahaman Umum (PPU)',
        'Pemahaman Bacaan & Menulis (PBM)',
        'Pengetahuan Kuantitatif (PK)',
        'Literasi Bahasa Indonesia (LBI)',
        'Literasi Bahasa Inggris (LBE)',
        'Penalaran Matematika (PM)',
      ];
      return snbtSubtests.map((name) => ({
        name,
        count: trackQuestions.filter((q) => q.subject.toLowerCase().includes(name.split(' ')[0].toLowerCase())).length || 1,
        isWajib: false,
        isPilihanUser: false,
      }));
    }

    // YTB
    const ytbModules = ['Matematika Akademik (YÖS Style)', 'Logika & Pola IQ (YTB Exam)'];
    return ytbModules.map((name) => ({
      name,
      count: trackQuestions.filter((q) => q.subject.toLowerCase().includes(name.slice(0, 5).toLowerCase())).length || 1,
      isWajib: false,
      isPilihanUser: false,
    }));
  };

  const availableSubjects = getAvailableSubjects();

  // Initialize questions set based on track and selected subject
  const initQuizSession = (subjectToLoad = selectedSubject) => {
    let pool = trackQuestions;

    if (subjectToLoad !== 'ALL') {
      pool = trackQuestions.filter((q) => q.subject.toLowerCase() === subjectToLoad.toLowerCase());
      // If pool is empty, fall back to broader match
      if (pool.length === 0) {
        pool = trackQuestions.filter((q) => q.subject.toLowerCase().includes(subjectToLoad.toLowerCase()));
      }
    } else if (activeTrack === 'TKA') {
      // In ALL mode for TKA, prioritize user's active 3 Wajib + 2 Pilihan
      const allowed = [...tkaConfig.mandatorySubjects, ...tkaConfig.electiveSubjects];
      const activePool = trackQuestions.filter((q) =>
        allowed.some((a) => a.toLowerCase() === q.subject.toLowerCase())
      );
      if (activePool.length > 0) pool = activePool;
    }

    if (pool.length === 0) {
      pool = trackQuestions.length > 0 ? trackQuestions : questions;
    }

    // Pick 3 to 5 questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(5, shuffled.length));

    setSessionQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setIsCompleted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setShowExplanation(false);
  };

  // When track or subject selection changes, reload session
  useEffect(() => {
    initQuizSession(selectedSubject);
  }, [activeTrack, selectedSubject, tkaConfig]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const currentQ = sessionQuestions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index,
    }));
  };

  const handleConfirmAnswer = () => {
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      setIsTimerRunning(false);
      onQuizCompleted(20);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const correctCount = sessionQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const scorePercent = Math.round((correctCount / (sessionQuestions.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header Banner & Per-Mapel Selector Bar */}
      <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {activeTrack === 'TKA' ? 'TKA SMA (26 Okt 2026)' : activeTrack === 'SNBT' ? 'UTBK-SNBT 2027' : 'Türkiye Bursları'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Latihan Soal Asli &amp; Mirip Bocoran FR
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] mt-1">
              {activeTrack === 'TKA' ? 'Latihan Soal Asli TKA Per-Mata Pelajaran' : 'Latihan Soal Mandiri'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Pilih satu mata pelajaran spesifik di bawah ini agar latihan Anda fokus dan teratur, tanpa soal bercampur aduk.
            </p>
          </div>

          <button
            type="button"
            onClick={() => initQuizSession(selectedSubject)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            title="Muat ulang soal untuk mata pelajaran ini"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Acak Soal Baru</span>
          </button>
        </div>

        {/* Horizontal Scrollable Subject Selector Chips */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pilih Mata Pelajaran Fokus:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* 'ALL' Button */}
            <button
              type="button"
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSubject === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              <span>Semua Mapel Aktif</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                {trackQuestions.length}
              </span>
            </button>

            {/* Subject Specific Chips */}
            {availableSubjects.map((sub) => {
              const isSelected = selectedSubject.toLowerCase() === sub.name.toLowerCase();

              return (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? currentTheme.primary : undefined,
                    borderColor: isSelected ? currentTheme.primary : undefined,
                  }}
                >
                  {sub.isPilihanUser && (
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                  <span>{sub.name}</span>
                  {sub.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      {sub.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. QUIZ ARENA / COMPLETION VIEW */}
      {!currentQ && !isCompleted ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-600 text-sm font-medium">
            Tidak ada soal tersedia untuk mapel ini. Silakan pilih mata pelajaran lain di atas.
          </p>
        </div>
      ) : isCompleted ? (
        /* Sesi Selesai (Completion Screen) */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Sesi Latihan Soal Selesai
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
              Kerja Bagus! +20 Menit Belajar Ditambahkan
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Latihan untuk <strong>{selectedSubject === 'ALL' ? 'Semua Mapel' : selectedSubject}</strong> selesai dalam waktu{' '}
              <strong className="font-mono text-slate-900">{formatTimer(timerSeconds)}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Benar</div>
              <div className="text-xl font-extrabold font-mono text-emerald-600">
                {correctCount} / {sessionQuestions.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Akurasi</div>
              <div className="text-xl font-extrabold font-mono text-slate-900">
                {scorePercent}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Waktu</div>
              <div className="text-xl font-extrabold font-mono text-slate-900">
                {formatTimer(timerSeconds)}
              </div>
            </div>
          </div>

          {/* Error Log Review */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Evaluasi Jawaban Sesi Ini:
            </div>

            <div className="space-y-2.5">
              {sessionQuestions.map((q) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          {q.subject}: <span className="font-medium text-slate-700">{q.topic}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{q.sourceTag}</div>
                        {!isCorrect && (
                          <div className="text-[11px] text-slate-600 mt-1 italic">
                            Konsep Kunci: {q.keyConcept}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isCorrect && (
                      <button
                        type="button"
                        onClick={() =>
                          onSendToJournal(
                            q.subject,
                            q.topic,
                            `Salah di ${q.sourceTag}: "${q.question.slice(0, 75)}...". Kunci konsep: ${q.keyConcept}`
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        + Catat ke Error Log
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => initQuizSession(selectedSubject)}
              className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer hover:opacity-90"
              style={{ backgroundColor: currentTheme.primary }}
            >
              Ulangi / Latihan Soal {selectedSubject === 'ALL' ? 'Lain' : selectedSubject}
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject('ALL')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Ganti Mapel Lain
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {currentIndex + 1}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Soal {currentIndex + 1} dari {sessionQuestions.length}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                    {currentQ.subject}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Topik: {currentQ.topic} · Tingkat: {currentQ.difficulty}
                </div>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {sessionQuestions.map((q, i) => {
                const answered = selectedAnswers[q.id] !== undefined;
                const isCurr = i === currentIndex;
                return (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all ${
                      isCurr
                        ? 'w-6 bg-indigo-600'
                        : answered
                        ? 'w-2.5 bg-slate-400'
                        : 'w-2.5 bg-slate-200'
                    }`}
                    style={{
                      backgroundColor: isCurr ? currentTheme.primary : undefined,
                    }}
                  />
                );
              })}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                title={isTimerRunning ? 'Jeda waktu' : 'Lanjutkan waktu'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Main Question Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
            <div>
              {/* Official Source Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-mono font-bold mb-3">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentQ.sourceTag}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-['Outfit']">
                {currentQ.question}
              </h3>

              {currentQ.formulaOrContext && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-semibold">Konsep / Bantuan Rumus:</strong> {currentQ.formulaOrContext}
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const userAns = selectedAnswers[currentQ.id];
                const isSelected = userAns === idx;
                const letter = String.fromCharCode(65 + idx);

                let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800 hover:bg-slate-50/70';

                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctIndex) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-300 bg-rose-50 text-rose-950 line-through opacity-85';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-indigo-950 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3.5 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isSelected && !isAnswerSubmitted
                          ? 'bg-indigo-600 text-white'
                          : isAnswerSubmitted && idx === currentQ.correctIndex
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {letter}
                    </span>

                    <span className="flex-1 leading-relaxed">{option}</span>

                    {isAnswerSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Section */}
            {showExplanation && (
              <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/30 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between font-bold text-indigo-950">
                  <div className="flex items-center gap-2 text-sm font-['Outfit']">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Pembahasan &amp; Solusi Langkah demi Langkah</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      selectedAnswers[currentQ.id] === currentQ.correctIndex
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedAnswers[currentQ.id] === currentQ.correctIndex ? 'Benar ✅' : 'Jawaban Salah ❌'}
                  </span>
                </div>

                <p className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                  {currentQ.explanation}
                </p>

                <div className="p-3 rounded-xl bg-white border border-indigo-200/70 text-slate-900 space-y-1">
                  <strong className="text-indigo-950 font-bold block">💡 Kunci Konsep Cepat:</strong>
                  <span className="text-slate-700">{currentQ.keyConcept}</span>
                </div>

                {selectedAnswers[currentQ.id] !== currentQ.correctIndex && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        onSendToJournal(
                          currentQ.subject,
                          currentQ.topic,
                          `Salah di ${currentQ.sourceTag}: "${currentQ.question.slice(0, 80)}...". Konsep: ${currentQ.keyConcept}`
                        )
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200/80 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Catat ke Error Log Jurnal</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {selectedAnswers[currentQ.id] === undefined
                  ? 'Pilih salah satu jawaban (A, B, C, D, atau E)'
                  : isAnswerSubmitted
                  ? 'Jawaban telah dikunci'
                  : 'Jawaban terpilih. Klik Kunci Jawaban.'}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Kunci Jawaban &amp; Cek
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all cursor-pointer hover:opacity-90 flex items-center gap-1.5"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <span>{currentIndex < sessionQuestions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
