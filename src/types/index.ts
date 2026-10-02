export type ActiveTrackType = 'TKA' | 'SNBT' | 'YTB';

export type TkaMandatorySubject = 
  | 'Matematika (Wajib)'
  | 'Bahasa Indonesia'
  | 'Bahasa Inggris';

export type TkaElectiveSubject =
  | 'Fisika'
  | 'Kimia'
  | 'Biologi'
  | 'Matematika Tingkat Lanjut'
  | 'Informatika'
  | 'Ekonomi'
  | 'Sosiologi'
  | 'Geografi';

export type SnbtSubtest =
  | 'Penalaran Umum (PU)'
  | 'Pengetahuan & Pemahaman Umum (PPU)'
  | 'Pemahaman Bacaan & Menulis (PBM)'
  | 'Pengetahuan Kuantitatif (PK)'
  | 'Literasi Bahasa Indonesia'
  | 'Literasi Bahasa Inggris'
  | 'Penalaran Matematika (PM)';

export type YtbModule =
  | 'Matematika Akademik (YÖS Style)'
  | 'Logika & Pola IQ (YTB Exam)'
  | 'Portofolio Dokumen & Rapor'
  | 'Letter of Intent (Niyet Mektubu)'
  | 'Persiapan Wawancara Resmi';

export type SubjectType = 
  | TkaMandatorySubject
  | TkaElectiveSubject
  | SnbtSubtest
  | YtbModule
  | 'Matematika'
  | 'Fisika'
  | 'Kimia'
  | 'Biologi'
  | 'Penalaran SNBT'
  | 'Türkiye Bursları';

export interface TopicMastery {
  id: string;
  track: ActiveTrackType;
  subject: string;
  name: string;
  subtopics: string[];
  masteryPercentage: number; // 0 - 100 (starts from 0 for fresh progress!)
  status: 'not_started' | 'in_progress' | 'mastered' | 'expert';
  hoursSpent: number; // starts from 0
  lastStudied?: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  keyWeakness?: string;
  isMandatory?: boolean; // For TKA 3 mandatory subjects
}

export interface SubScore {
  name: string;
  score: number;
  maxScore: number;
}

export interface TryoutRecord {
  id: string;
  track: ActiveTrackType;
  title: string;
  date: string;
  totalScore: number;
  targetScore: number;
  percentile?: number;
  rank?: string;
  subScores: SubScore[];
  analysis: string;
}

export interface JournalEntry {
  id: string;
  track: ActiveTrackType;
  date: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  weaknesses: string;
  actionPlan: string;
  isResolved: boolean;
}

export interface QuizQuestion {
  id: string;
  track: ActiveTrackType;
  subject: string;
  topic: string;
  sourceTag: string; // e.g. "[Soal Asli UTBK 2025/2026 - FR Hari Ke-3]", "[Soal Asli TKA SMA 2025 - Fisika BPPP]"
  difficulty: 'Konseptual' | 'Sedang' | 'HOTS';
  question: string;
  formulaOrContext?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyConcept: string;
}

export interface PaletteTheme {
  id: string;
  name: string;
  sourceName: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  bgTint: string;
  surface: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface DailyStreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  activeDates: string[];
  dailyTargetMinutes: number;
  minutesLoggedToday: number;
  quizzesCompletedToday: number;
  streakShieldCount: number;
}

export interface UniversityTarget {
  name: string;
  turkishOrIndonesianName: string;
  cityCountry: string;
  major: string;
  targetScore: number;
  imageUrl: string;
  scholarshipChecklist: { id: string; label: string; done: boolean; deadline?: string }[];
  motivationQuote: string;
}

export interface TkaConfig {
  mandatorySubjects: TkaMandatorySubject[];
  electiveSubjects: [TkaElectiveSubject, TkaElectiveSubject];
}

export interface YtbPreferences {
  isEnabled: boolean; // Aktifkan atau nonaktifkan keikutsertaan beasiswa
  targetMajorCluster: 'Teknik & Sains Komputer' | 'Kedokteran & Kesehatan' | 'Ekonomi & Bisnis' | 'Sosial & Hubungan Internasional';
  preferredCitiesChoice: 'Kombinasi Seimbang (Sesuai Aturan YTB)' | 'Hanya Kota Besar' | 'Bebas';
}

export interface SemesterRapor {
  semester: number;
  matematika: number;
  bahasaInggris: number;
  bahasaIndonesia: number;
  peminatan1: number; // e.g. Fisika / Ekonomi
  peminatan2: number; // e.g. Kimia / Sosiologi
  rataRataUmum: number;
}

export interface RaporData {
  semesters: SemesterRapor[];
  hasEnglishCert: boolean;
  certType: 'TOEFL iBT' | 'IELTS' | 'Duolingo English Test (DET)' | 'Belum Ada';
  certScore: string;
  hasOlympOrAwards: boolean;
  awardLevel: 'Internasional' | 'Nasional (OSN)' | 'Provinsi/Kota' | 'Belum Ada';
  hasExtracurricular: boolean;
}

export interface YtbAcceptanceAnalysis {
  averageGpa: number;
  probabilityScore: number; // 0 - 100%
  zone: 'Sangat Tinggi (Peluang Unggulan)' | 'Kompetitif & Siap Bersaing' | 'Cukup (Perlu Booster Portofolio)' | 'Zona Rawan / Di Bawah Standar';
  breakdownInsights: string[];
  recommendations: string[];
  cityRuleCompliant: boolean;
}

export type DegreeLevel = 'S1 (Sarjana)' | 'D4 (Sarjana Terapan)' | 'D3 (Diploma)';

export interface SnbtChoice {
  id: string;
  order: 1 | 2 | 3 | 4;
  universityName: string;
  majorName: string;
  degreeLevel: DegreeLevel;
  safeScoreThreshold: number; // e.g. 710, 680, 640
  quota: number;              // Daya tampung
  applicantsLastYear: number; // Peminat tahun lalu
  notes?: string;
}

export interface ChoiceProbability {
  choiceId: string;
  choice: SnbtChoice;
  calculatedProbability: number; // 0 - 100%
  statusZone: 'Sangat Aman' | 'Kompetitif / Realistis' | 'Cukup Ketat' | 'Ambisius / Spekulatif';
  deltaVsScore: number; // currentScore - safeScoreThreshold
  isVocational: boolean;
  recommendedOrder: number;
}

export interface SnbtStrategyAssessment {
  userCurrentScore: number;
  choicesCount: number;
  isRuleCompliant: boolean; // compliance with BPPP rules for 1, 2, 3, or 4 choices
  ruleFeedback: string;
  isOrderLogicallySound: boolean; // whether passing grades descend appropriately
  orderWarning?: string;
  evaluatedChoices: ChoiceProbability[];
  recommendationSummary: string;
}


