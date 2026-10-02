import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  Pause,
  Play,
  Share2,
  Tag,
  Filter,
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
  const [filterMode, setFilterMode] = useState<'track' | 'all'>('track');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Initialize a balanced 5-question micro set
  const initBalancedSet = () => {
    // Filter question pool
    let pool = questions;
    if (filterMode === 'track') {
      pool = questions.filter((q) => {
        if (q.track !== activeTrack) return false;
        if (activeTrack === 'TKA') {
          const allowed = [...tkaConfig.mandatorySubjects, ...tkaConfig.electiveSubjects];
          return allowed.includes(q.subject as any);
        }
        return true;
      });
    }

    if (pool.length === 0) {
      pool = questions; // fallback if pool is narrow
    }

    // Shuffle and pick 5
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

  useEffect(() => {
    initBalancedSet();
  }, [questions, activeTrack, filterMode, tkaConfig]);

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

  if (!currentQ && !isCompleted) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Menyiapkan bank soal asli &amp; bocoran FR...</p>
      </div>
    );
  }

  // Completion View
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-xs text-center space-y-6">
        <div 
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Sesi Soal Asli / FR Selesai
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
            Mantap! +20 Menit Belajar Ditambahkan
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Latihan soal asli selesai dalam waktu <strong className="font-mono">{formatTimer(timerSeconds)}</strong>.
            Evaluasi soal yang salah di bawah ini.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Jawaban Benar</div>
            <div className="text-xl font-bold font-mono text-emerald-600">
              {correctCount} / {sessionQuestions.length}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Akurasi</div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {scorePercent}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Waktu Sesi</div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {formatTimer(timerSeconds)}
            </div>
          </div>
        </div>

        <div className="text-left space-y-3 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Review Soal &amp; Error Log:
          </div>

          <div className="space-y-2">
            {sessionQuestions.map((q) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-900">{q.subject}:</span>{' '}
                      <span className="text-slate-700">{q.topic}</span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{q.sourceTag}</div>
                    </div>
                  </div>

                  {!isCorrect && (
                    <button
                      onClick={() =>
                        onSendToJournal(
                          q.subject,
                          q.topic,
                          `Salah di ${q.sourceTag}: "${q.question.slice(0, 80)}...". Kunci konsep: ${q.keyConcept}`
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      + Catat ke Error Log
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={initBalancedSet}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kuis 5 Soal Lain</span>
          </button>
        </div>
      </div>
    );
  }

  const userAns = selectedAnswers[currentQ.id];
  const isCorrect = userAns === currentQ.correctIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Track Selector & Mode Switcher */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-600">Mode Soal:</span>
          <button
            onClick={() => setFilterMode('track')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              filterMode === 'track'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Fokus Jalur {activeTrack}
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Campuran Semua Jalur
          </button>
        </div>

        <button
          onClick={initBalancedSet}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Acak Ulang</span>
        </button>
      </div>

      {/* Top Session Progress Bar & Relaxed Timer */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {currentIndex + 1}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Soal {currentIndex + 1} dari {sessionQuestions.length}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>{currentQ.subject}</span>
              <span>·</span>
              <span className="font-mono">{currentQ.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {sessionQuestions.map((q, i) => {
            const answered = selectedAnswers[q.id] !== undefined;
            const isCurr = i === currentIndex;
            return (
              <div
                key={q.id}
                className={`h-1.5 rounded-full transition-all ${
                  isCurr
                    ? 'w-6 bg-indigo-600'
                    : answered
                    ? 'w-3 bg-slate-400'
                    : 'w-3 bg-slate-200'
                }`}
                style={{
                  backgroundColor: isCurr ? currentTheme.primary : undefined,
                }}
              />
            );
          })}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            title={isTimerRunning ? 'Jeda waktu' : 'Lanjutkan waktu'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
        <div>
          {/* Authentic Exam Source Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-mono font-bold mb-2">
            <Tag className="w-3 h-3 text-amber-600" />
            <span>{currentQ.sourceTag}</span>
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Topik: {currentQ.topic}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {currentQ.formulaOrContext && (
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
              <strong>Bantuan Konsep:</strong> {currentQ.formulaOrContext}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAns === idx;
            let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (isSelected) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50 text-slate-400';
              }
            } else if (isSelected) {
              optionStyle = 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 text-indigo-950 font-semibold';
            }

            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold shrink-0 text-slate-700">
                  {letter}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
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

        {/* Detailed Explanation */}
        {showExplanation && (
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs text-slate-800 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Pembahasan Langkah demi Langkah
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {isCorrect ? 'Benar +1' : 'Perlu Evaluasi'}
              </span>
            </div>
            <p className="leading-relaxed text-slate-700 whitespace-pre-line">{currentQ.explanation}</p>
            <div className="pt-2 border-t border-indigo-100 text-slate-900">
              <strong className="text-indigo-950">Konsep Kunci:</strong> {currentQ.keyConcept}
            </div>

            {!isCorrect && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onSendToJournal(
                      currentQ.subject,
                      currentQ.topic,
                      `Salah di ${qSource(currentQ)}: ${currentQ.question.slice(0, 80)}... Konsep yang keliru: ${currentQ.keyConcept}`
                    )
                  }
                  className="px-3 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors cursor-pointer"
                >
                  + Masukkan ke Error Log Jurnal
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {userAns === undefined ? (
              <span>Pilih salah satu jawaban di atas</span>
            ) : (
              <span>Pilihan tersimpan</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                disabled={userAns === undefined}
                onClick={handleConfirmAnswer}
                className="px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Cek Pembahasan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <span>{currentIndex < sessionQuestions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Sesi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function qSource(q: QuizQuestion) {
  return q.sourceTag || q.topic;
}
