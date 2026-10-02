import {
  TopicMastery,
  TryoutRecord,
  JournalEntry,
  PaletteTheme,
  DailyStreakState,
  UniversityTarget,
  QuizQuestion,
  TkaConfig,
  YtbPreferences,
  SnbtChoice,
  RaporData,
} from '../types';
import {
  INITIAL_TOPICS,
  INITIAL_TRYOUTS,
  INITIAL_JOURNAL,
  INITIAL_STREAK,
  PRESET_THEMES,
  INITIAL_UNIVERSITY_TARGETS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_TKA_CONFIG,
} from '../data/seedData';
import { applyThemeToCss } from './colorExtractor';

const STORAGE_KEYS = {
  TOPICS: 'studikuasai_topics_v2',
  TRYOUTS: 'studikuasai_tryouts_v2',
  JOURNAL: 'studikuasai_journal_v2',
  STREAK: 'studikuasai_streak_v2',
  THEME: 'studikuasai_theme_v2',
  TARGET_UNIVERSITY: 'studikuasai_target_univ_v2',
  CUSTOM_THEMES: 'studikuasai_custom_themes_v2',
  QUIZ_QUESTIONS: 'studikuasai_quiz_v2',
  TKA_CONFIG: 'studikuasai_tka_config_v2',
  YTB_PREFERENCES: 'studikuasai_ytb_prefs_v2',
  SNBT_CHOICES: 'studikuasai_snbt_choices_v2',
  RAPOR_DATA: 'studikuasai_rapor_kurikulum_merdeka_v1',
};

export const DEFAULT_YTB_PREFERENCES: YtbPreferences = {
  isEnabled: true,
  targetMajorCluster: 'Teknik & Sains Komputer',
  preferredCitiesChoice: 'Kombinasi Seimbang (Sesuai Aturan YTB)',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
    return fallback;
  }
}

// Safe JSON setter
function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage`, e);
  }
}

// YTB Preferences API
export function loadYtbPreferences(): YtbPreferences {
  return safeGet<YtbPreferences>(STORAGE_KEYS.YTB_PREFERENCES, DEFAULT_YTB_PREFERENCES);
}

export function saveYtbPreferences(prefs: YtbPreferences): void {
  safeSet(STORAGE_KEYS.YTB_PREFERENCES, prefs);
}

// TKA Config API
export function loadTkaConfig(): TkaConfig {
  return safeGet<TkaConfig>(STORAGE_KEYS.TKA_CONFIG, INITIAL_TKA_CONFIG);
}

export function saveTkaConfig(config: TkaConfig): void {
  safeSet(STORAGE_KEYS.TKA_CONFIG, config);
}

// Default SNBT Choices (Compliant 4 choices: 2 S1 + 1 D4 + 1 D3)
export const DEFAULT_SNBT_CHOICES: SnbtChoice[] = [
  {
    id: 'snbt-ch-1',
    order: 1,
    universityName: 'Institut Teknologi Bandung (ITB)',
    majorName: 'Sekolah Teknik Elektro & Informatika (STEI-R Rekayasa)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 728,
    quota: 140,
    applicantsLastYear: 2850,
    notes: 'Pilihan impian utama dengan passing grade tertinggi',
  },
  {
    id: 'snbt-ch-2',
    order: 2,
    universityName: 'Universitas Indonesia (UI)',
    majorName: 'Ilmu Komputer (Fasilkom UI)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 724,
    quota: 85,
    applicantsLastYear: 2720,
    notes: 'Pilihan kedua realistis & kompetitif',
  },
  {
    id: 'snbt-ch-3',
    order: 3,
    universityName: 'Universitas Gadjah Mada (UGM)',
    majorName: 'Teknologi Rekayasa Perangkat Lunak',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 652,
    quota: 55,
    applicantsLastYear: 1100,
    notes: 'Pilihan pengaman sarjana terapan vokasi',
  },
  {
    id: 'snbt-ch-4',
    order: 4,
    universityName: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    majorName: 'Teknik Informatika (D3)',
    degreeLevel: 'D3 (Diploma)',
    safeScoreThreshold: 618,
    quota: 65,
    applicantsLastYear: 890,
    notes: 'Safety net jaring pengaman D3',
  },
];

export function loadSnbtChoices(): SnbtChoice[] {
  return safeGet<SnbtChoice[]>(STORAGE_KEYS.SNBT_CHOICES, DEFAULT_SNBT_CHOICES);
}

export function saveSnbtChoices(choices: SnbtChoice[]): void {
  safeSet(STORAGE_KEYS.SNBT_CHOICES, choices);
}

// Default Rapor Data following Kurikulum Merdeka
// Kelas 10 (Semester 1 & 2): IPA & IPS Terpadu
// Kelas 11 & 12 (Semester 3, 4, 5): 4 Mapel Pilihan (Biologi, Fisika, Kimia, Bahasa Jepang)
export const DEFAULT_RAPOR_DATA: RaporData = {
  chosenElectives: ['Biologi', 'Fisika', 'Kimia', 'Bahasa Jepang'],
  semesters: [
    {
      semester: 1,
      gradeLevel: 'Kelas 10',
      matematika: 88,
      bahasaIndonesia: 88,
      bahasaInggris: 86,
      ipaTerpadu: 87, // IPA Terpadu (Fisika, Kimia, Biologi)
      ipsTerpadu: 85, // IPS Terpadu (Ekonomi, Sosiologi, Geografi, Sejarah)
      rataRataUmum: 86.8,
    },
    {
      semester: 2,
      gradeLevel: 'Kelas 10',
      matematika: 89,
      bahasaIndonesia: 87,
      bahasaInggris: 88,
      ipaTerpadu: 88,
      ipsTerpadu: 87,
      rataRataUmum: 87.8,
    },
    {
      semester: 3,
      gradeLevel: 'Kelas 11',
      matematika: 91,
      bahasaIndonesia: 90,
      bahasaInggris: 89,
      electiveGrades: {
        'Biologi': 90,
        'Fisika': 88,
        'Kimia': 89,
        'Bahasa Jepang': 91,
      },
      rataRataUmum: 89.7,
    },
    {
      semester: 4,
      gradeLevel: 'Kelas 11',
      matematika: 92,
      bahasaIndonesia: 89,
      bahasaInggris: 91,
      electiveGrades: {
        'Biologi': 91,
        'Fisika': 90,
        'Kimia': 91,
        'Bahasa Jepang': 92,
      },
      rataRataUmum: 90.9,
    },
    {
      semester: 5,
      gradeLevel: 'Kelas 12',
      matematika: 94,
      bahasaIndonesia: 91,
      bahasaInggris: 92,
      electiveGrades: {
        'Biologi': 93,
        'Fisika': 92,
        'Kimia': 93,
        'Bahasa Jepang': 94,
      },
      rataRataUmum: 92.7,
    },
  ],
  hasEnglishCert: true,
  certType: 'Duolingo English Test (DET)',
  certScore: '125 (CEFR C1)',
  hasOlympOrAwards: true,
  awardLevel: 'Nasional (OSN)',
  hasExtracurricular: true,
};

export function loadRaporData(): RaporData {
  return safeGet<RaporData>(STORAGE_KEYS.RAPOR_DATA, DEFAULT_RAPOR_DATA);
}

export function saveRaporData(data: RaporData): void {
  safeSet(STORAGE_KEYS.RAPOR_DATA, data);
}

// Reset all progress to 0% from scratch
export function resetAllProgressToZero(): {
  topics: TopicMastery[];
  tryouts: TryoutRecord[];
  journal: JournalEntry[];
  streak: DailyStreakState;
} {
  const freshTopics = INITIAL_TOPICS.map((t) => ({
    ...t,
    masteryPercentage: 0,
    hoursSpent: 0,
    status: 'not_started' as const,
    confidence: 1 as const,
  }));
  saveTopics(freshTopics);
  saveTryouts([]);
  saveJournal([]);
  saveStreak(INITIAL_STREAK);

  return {
    topics: freshTopics,
    tryouts: [],
    journal: [],
    streak: INITIAL_STREAK,
  };
}

// Topics API
export function loadTopics(): TopicMastery[] {
  return safeGet<TopicMastery[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
}

export function saveTopics(topics: TopicMastery[]): void {
  safeSet(STORAGE_KEYS.TOPICS, topics);
}

// Tryouts API
export function loadTryouts(): TryoutRecord[] {
  return safeGet<TryoutRecord[]>(STORAGE_KEYS.TRYOUTS, INITIAL_TRYOUTS);
}

export function saveTryouts(tryouts: TryoutRecord[]): void {
  safeSet(STORAGE_KEYS.TRYOUTS, tryouts);
}

// Journal API
export function loadJournal(): JournalEntry[] {
  return safeGet<JournalEntry[]>(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL);
}

export function saveJournal(journal: JournalEntry[]): void {
  safeSet(STORAGE_KEYS.JOURNAL, journal);
}

// Streak API
export function loadStreak(): DailyStreakState {
  const streak = safeGet<DailyStreakState>(STORAGE_KEYS.STREAK, INITIAL_STREAK);
  
  // Check if today needs reset or streak update
  const todayStr = new Date().toISOString().split('T')[0];
  if (streak.lastActiveDate !== todayStr) {
    const lastDate = new Date(streak.lastActiveDate);
    const today = new Date(todayStr);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Consecutive day! Reset daily minutes and quizzes done
      streak.minutesLoggedToday = 0;
      streak.quizzesCompletedToday = 0;
    } else if (diffDays > 1) {
      // Missed a day or more
      if (streak.streakShieldCount > 0) {
        streak.streakShieldCount -= 1; // shield saved streak!
        streak.minutesLoggedToday = 0;
        streak.quizzesCompletedToday = 0;
      } else {
        streak.currentStreak = 0;
        streak.minutesLoggedToday = 0;
        streak.quizzesCompletedToday = 0;
      }
    }
  }
  return streak;
}

export function saveStreak(streak: DailyStreakState): void {
  safeSet(STORAGE_KEYS.STREAK, streak);
}

export function logDailyStudyActivity(minutes: number = 0, quizCompleted: boolean = false): DailyStreakState {
  const current = loadStreak();
  const todayStr = new Date().toISOString().split('T')[0];

  current.minutesLoggedToday += minutes;
  if (quizCompleted) {
    current.quizzesCompletedToday += 1;
  }

  if (!current.activeDates.includes(todayStr)) {
    current.activeDates.push(todayStr);
    if (current.lastActiveDate !== todayStr) {
      current.currentStreak += 1;
      if (current.currentStreak > current.bestStreak) {
        current.bestStreak = current.currentStreak;
      }
    }
    current.lastActiveDate = todayStr;
  }

  saveStreak(current);
  return current;
}

// Theme API
export function loadTheme(): PaletteTheme {
  const saved = safeGet<PaletteTheme>(STORAGE_KEYS.THEME, PRESET_THEMES[0]);
  applyThemeToCss(saved);
  return saved;
}

export function saveTheme(theme: PaletteTheme): void {
  safeSet(STORAGE_KEYS.THEME, theme);
  applyThemeToCss(theme);
}

export function loadCustomThemes(): PaletteTheme[] {
  return safeGet<PaletteTheme[]>(STORAGE_KEYS.CUSTOM_THEMES, []);
}

export function saveCustomTheme(theme: PaletteTheme): void {
  const customs = loadCustomThemes();
  const existingIdx = customs.findIndex(c => c.id === theme.id);
  if (existingIdx >= 0) {
    customs[existingIdx] = theme;
  } else {
    customs.unshift(theme);
  }
  safeSet(STORAGE_KEYS.CUSTOM_THEMES, customs);
}

// University Targets
export function loadUniversityTargets(): UniversityTarget[] {
  return safeGet<UniversityTarget[]>(STORAGE_KEYS.TARGET_UNIVERSITY, INITIAL_UNIVERSITY_TARGETS);
}

export function saveUniversityTargets(targets: UniversityTarget[]): void {
  safeSet(STORAGE_KEYS.TARGET_UNIVERSITY, targets);
}

// Quiz Questions
export function loadQuizQuestions(): QuizQuestion[] {
  return safeGet<QuizQuestion[]>(STORAGE_KEYS.QUIZ_QUESTIONS, INITIAL_QUIZ_QUESTIONS);
}

export function saveQuizQuestions(questions: QuizQuestion[]): void {
  safeSet(STORAGE_KEYS.QUIZ_QUESTIONS, questions);
}

// Export / Import all data
export function exportAllData(): string {
  const data = {
    topics: loadTopics(),
    tryouts: loadTryouts(),
    journal: loadJournal(),
    streak: loadStreak(),
    theme: loadTheme(),
    universityTargets: loadUniversityTargets(),
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.topics) saveTopics(data.topics);
    if (data.tryouts) saveTryouts(data.tryouts);
    if (data.journal) saveJournal(data.journal);
    if (data.streak) saveStreak(data.streak);
    if (data.theme) saveTheme(data.theme);
    if (data.universityTargets) saveUniversityTargets(data.universityTargets);
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}
