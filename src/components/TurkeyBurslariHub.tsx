import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Calendar,
  Compass,
  FileCheck,
  Building2,
  ExternalLink,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Calculator,
  AlertTriangle,
  HelpCircle,
  FileText,
  MapPin,
  Check,
  Sliders,
  ShieldAlert,
  Flame,
  Plus,
  Trash2,
  Settings2,
  RotateCcw,
  Info,
  X,
  Layers,
  Target,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  CheckCheck,
} from 'lucide-react';
import {
  UniversityTarget,
  PaletteTheme,
  YtbPreferences,
  RaporData,
  SemesterRapor,
  YtbChoice,
} from '../types';
import {
  YTB_REQUIRED_DOCUMENTS,
  YTB_UNIVERSITY_CLUSTERS,
  YTB_SAMPLE_ESSAYS,
  AVAILABLE_ELECTIVE_SUBJECTS,
  calculateYtbProbability,
  YTB_PRESET_UNIVERSITIES,
  evaluateYtbChoiceStrategy,
  YtbPresetUniversity,
} from '../data/ytbGuideData';
import { getExamCountdowns } from '../utils/countdown';
import {
  loadRaporData,
  saveRaporData,
  DEFAULT_RAPOR_DATA,
  loadYtbChoices,
  saveYtbChoices,
  DEFAULT_YTB_CHOICES,
} from '../utils/storage';

interface TurkeyBurslariHubProps {
  targets: UniversityTarget[];
  activeTarget: UniversityTarget;
  currentTheme: PaletteTheme;
  ytbPreferences: YtbPreferences;
  onUpdateYtbPreferences: (prefs: YtbPreferences) => void;
  onSelectActiveTarget: (target: UniversityTarget) => void;
  onToggleChecklistItem: (univName: string, checklistId: string) => void;
}

export const TurkeyBurslariHub: React.FC<TurkeyBurslariHubProps> = ({
  targets,
  activeTarget,
  currentTheme,
  ytbPreferences,
  onUpdateYtbPreferences,
  onSelectActiveTarget,
  onToggleChecklistItem,
}) => {
  const [subTab, setSubTab] = useState<'rapor-calculator' | 'ytb-choices' | 'universities' | 'documents' | 'essay-guide' | 'essay-samples'>('rapor-calculator');
  const [activeEssayIndex, setActiveEssayIndex] = useState<number>(0);
  const countdowns = getExamCountdowns();

  // Rapor Data State initialized from storage (Kurikulum Merdeka)
  const [raporData, setRaporData] = useState<RaporData>(loadRaporData());
  const [isElectiveModalOpen, setIsElectiveModalOpen] = useState<boolean>(false);
  const [customElectiveInput, setCustomElectiveInput] = useState<string>('');
  const [electiveFilterCategory, setElectiveFilterCategory] = useState<string>('Semua');

  // YTB Choices (Pilihan 1-12 TBBS) State
  const [ytbChoices, setYtbChoices] = useState<YtbChoice[]>(loadYtbChoices());
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState<boolean>(false);
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);

  // Form State for Choice Modal
  const [formUnivName, setFormUnivName] = useState<string>('Boğaziçi Üniversitesi');
  const [formCity, setFormCity] = useState<string>('Istanbul');
  const [formIsTopThree, setFormIsTopThree] = useState<boolean>(true);
  const [formTier, setFormTier] = useState<'Tier 1 - Kampus Elit Global' | 'Tier 2 - Universitas Negeri Utama' | 'Tier 3 - Kampus Kunci Luar 3 Kota'>('Tier 1 - Kampus Elit Global');
  const [formMajorName, setFormMajorName] = useState<string>('Computer Engineering (Teknik Komputer)');
  const [formLang, setFormLang] = useState<'100% Bahasa Inggris' | 'Bahasa Turki (dengan TÖMER 1 Thn Gratis)' | 'Campuran (Inggris & Turki)'>('100% Bahasa Inggris');
  const [formMinGpa, setFormMinGpa] = useState<number>(70);
  const [formNotes, setFormNotes] = useState<string>('');

  const updateAndSaveChoices = (newChoices: YtbChoice[]) => {
    const reindexed = newChoices.map((c, idx) => ({ ...c, order: idx + 1 }));
    setYtbChoices(reindexed);
    saveYtbChoices(reindexed);
  };

  const updateAndSaveRapor = (newData: RaporData) => {
    setRaporData(newData);
    saveRaporData(newData);
  };

  const [hasLoIReady, setHasLoIReady] = useState<boolean>(true);

  // Compute average of all semester averages
  const overallGpa = +(
    raporData.semesters.reduce((acc, s) => acc + s.rataRataUmum, 0) /
    raporData.semesters.length
  ).toFixed(1);

  // Evaluate Choice Strategy based on chosen universities & majors
  const choiceStrategyAssessment = evaluateYtbChoiceStrategy(
    ytbChoices,
    overallGpa,
    raporData.hasEnglishCert,
    raporData.hasOlympOrAwards
  );

  const cityRuleCompliant = choiceStrategyAssessment.isCityRuleCompliant;

  // Compute general acceptance probability taking into account Kurikulum Merdeka electives
  const probabilityAnalysis = calculateYtbProbability(
    overallGpa,
    raporData.hasEnglishCert,
    raporData.hasOlympOrAwards,
    hasLoIReady,
    cityRuleCompliant,
    ytbPreferences.targetMajorCluster,
    raporData.chosenElectives
  );

  const handleOpenAddChoiceModal = () => {
    const defaultPreset = YTB_PRESET_UNIVERSITIES[0];
    setEditingChoiceId(null);
    setFormUnivName(defaultPreset.name);
    setFormCity(defaultPreset.city);
    setFormIsTopThree(defaultPreset.isTopThreeCities);
    setFormTier(defaultPreset.tier);
    setFormMajorName(defaultPreset.majors[0].name);
    setFormLang(defaultPreset.majors[0].language);
    setFormMinGpa(defaultPreset.majors[0].minGpa);
    setFormNotes('');
    setIsChoiceModalOpen(true);
  };

  const handleOpenEditChoiceModal = (choice: YtbChoice) => {
    setEditingChoiceId(choice.id);
    setFormUnivName(choice.universityName);
    setFormCity(choice.city);
    setFormIsTopThree(choice.isTopThreeCities);
    setFormTier(choice.tier);
    setFormMajorName(choice.majorName);
    setFormLang(choice.languageOfInstruction);
    setFormMinGpa(choice.minGpaRequired);
    setFormNotes(choice.notes || '');
    setIsChoiceModalOpen(true);
  };

  const handleSaveChoiceModal = () => {
    if (!formUnivName.trim() || !formMajorName.trim()) return;

    if (editingChoiceId) {
      const updated = ytbChoices.map((c) =>
        c.id === editingChoiceId
          ? {
              ...c,
              universityName: formUnivName.trim(),
              majorName: formMajorName.trim(),
              city: formCity.trim(),
              isTopThreeCities: formIsTopThree,
              languageOfInstruction: formLang,
              tier: formTier,
              minGpaRequired: formMinGpa,
              notes: formNotes.trim(),
            }
          : c
      );
      updateAndSaveChoices(updated);
    } else {
      if (ytbChoices.length >= 12) {
        alert('Maksimal pilihan di portal TBBS adalah 12 universitas & jurusan.');
        return;
      }
      const newChoice: YtbChoice = {
        id: `ytb-ch-${Date.now()}`,
        order: ytbChoices.length + 1,
        universityName: formUnivName.trim(),
        majorName: formMajorName.trim(),
        city: formCity.trim(),
        isTopThreeCities: formIsTopThree,
        languageOfInstruction: formLang,
        tier: formTier,
        minGpaRequired: formMinGpa,
        notes: formNotes.trim(),
      };
      updateAndSaveChoices([...ytbChoices, newChoice]);
    }
    setIsChoiceModalOpen(false);
  };

  const handleRemoveChoice = (id: string) => {
    updateAndSaveChoices(ytbChoices.filter((c) => c.id !== id));
  };

  const handleMoveChoice = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ytbChoices.length) return;
    const copy = [...ytbChoices];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateAndSaveChoices(copy);
  };

  const handleAutoSortStrategy = () => {
    const copy = [...ytbChoices].sort((a, b) => {
      const rank = (tier: string) => {
        if (tier.includes('Tier 1')) return 1;
        if (tier.includes('Tier 2')) return 2;
        return 3;
      };
      return rank(a.tier) - rank(b.tier);
    });
    updateAndSaveChoices(copy);
  };

  const handleResetToDefaultChoices = () => {
    updateAndSaveChoices(DEFAULT_YTB_CHOICES);
  };

  // Handler for Kelas 10 (Semester 1 & 2): IPA & IPS Terpadu
  const handleUpdateKelas10Score = (
    semIndex: 0 | 1,
    field: 'matematika' | 'bahasaIndonesia' | 'bahasaInggris' | 'ipaTerpadu' | 'ipsTerpadu',
    value: number
  ) => {
    const updated = [...raporData.semesters];
    const sem = { ...updated[semIndex], [field]: Math.max(0, Math.min(100, value)) };
    const sum =
      (sem.matematika || 0) +
      (sem.bahasaIndonesia || 0) +
      (sem.bahasaInggris || 0) +
      (sem.ipaTerpadu || 0) +
      (sem.ipsTerpadu || 0);
    sem.rataRataUmum = +(sum / 5).toFixed(1);
    updated[semIndex] = sem;
    updateAndSaveRapor({ ...raporData, semesters: updated });
  };

  // Handler for Kelas 11 & 12 (Semester 3, 4, 5): Core Subjects
  const handleUpdateKelas11or12Core = (
    semIndex: 2 | 3 | 4,
    field: 'matematika' | 'bahasaIndonesia' | 'bahasaInggris',
    value: number
  ) => {
    const updated = [...raporData.semesters];
    const sem = { ...updated[semIndex], [field]: Math.max(0, Math.min(100, value)) };
    const coreSum = (sem.matematika || 0) + (sem.bahasaIndonesia || 0) + (sem.bahasaInggris || 0);
    const electives = raporData.chosenElectives;
    const electivesMap = sem.electiveGrades || {};
    const electivesSum = electives.reduce((acc, name) => acc + (electivesMap[name] || 85), 0);
    const totalCount = 3 + electives.length;
    sem.rataRataUmum = +((coreSum + electivesSum) / totalCount).toFixed(1);
    updated[semIndex] = sem;
    updateAndSaveRapor({ ...raporData, semesters: updated });
  };

  // Handler for Kelas 11 & 12 (Semester 3, 4, 5): Elective Grades
  const handleUpdateElectiveGrade = (
    semIndex: 2 | 3 | 4,
    subjectName: string,
    value: number
  ) => {
    const updated = [...raporData.semesters];
    const sem = { ...updated[semIndex] };
    const electivesMap = { ...(sem.electiveGrades || {}), [subjectName]: Math.max(0, Math.min(100, value)) };
    sem.electiveGrades = electivesMap;
    const coreSum = (sem.matematika || 0) + (sem.bahasaIndonesia || 0) + (sem.bahasaInggris || 0);
    const electives = raporData.chosenElectives;
    const electivesSum = electives.reduce((acc, name) => acc + (electivesMap[name] || 85), 0);
    const totalCount = 3 + electives.length;
    sem.rataRataUmum = +((coreSum + electivesSum) / totalCount).toFixed(1);
    updated[semIndex] = sem;
    updateAndSaveRapor({ ...raporData, semesters: updated });
  };

  // Add an elective subject (3 - 4 electives)
  const handleAddElective = (subjectName: string) => {
    const name = subjectName.trim();
    if (!name || raporData.chosenElectives.includes(name)) return;
    if (raporData.chosenElectives.length >= 4) return;

    const newElectives = [...raporData.chosenElectives, name];
    const updatedSemesters = raporData.semesters.map((sem, idx) => {
      if (idx >= 2) {
        const electivesMap = { ...(sem.electiveGrades || {}) };
        if (electivesMap[name] === undefined) {
          electivesMap[name] = 88;
        }
        const coreSum = (sem.matematika || 0) + (sem.bahasaIndonesia || 0) + (sem.bahasaInggris || 0);
        const electivesSum = newElectives.reduce((acc, s) => acc + (electivesMap[s] || 85), 0);
        const totalCount = 3 + newElectives.length;
        return {
          ...sem,
          electiveGrades: electivesMap,
          rataRataUmum: +((coreSum + electivesSum) / totalCount).toFixed(1),
        };
      }
      return sem;
    });

    updateAndSaveRapor({
      ...raporData,
      chosenElectives: newElectives,
      semesters: updatedSemesters,
    });
    setIsElectiveModalOpen(false);
  };

  // Remove an elective subject (keep minimum 3)
  const handleRemoveElective = (subjectName: string) => {
    if (raporData.chosenElectives.length <= 3) return;

    const newElectives = raporData.chosenElectives.filter((s) => s !== subjectName);
    const updatedSemesters = raporData.semesters.map((sem, idx) => {
      if (idx >= 2) {
        const electivesMap = { ...(sem.electiveGrades || {}) };
        delete electivesMap[subjectName];
        const coreSum = (sem.matematika || 0) + (sem.bahasaIndonesia || 0) + (sem.bahasaInggris || 0);
        const electivesSum = newElectives.reduce((acc, s) => acc + (electivesMap[s] || 85), 0);
        const totalCount = 3 + newElectives.length;
        return {
          ...sem,
          electiveGrades: electivesMap,
          rataRataUmum: +((coreSum + electivesSum) / totalCount).toFixed(1),
        };
      }
      return sem;
    });

    updateAndSaveRapor({
      ...raporData,
      chosenElectives: newElectives,
      semesters: updatedSemesters,
    });
  };

  // Apply user-requested preset: Biologi, Fisika, Kimia, Bahasa Jepang
  const handleSetUserPreset = () => {
    const targetElectives = ['Biologi', 'Fisika', 'Kimia', 'Bahasa Jepang'];
    const updatedSemesters = raporData.semesters.map((sem, idx) => {
      if (idx >= 2) {
        const existingMap = sem.electiveGrades || {};
        const newMap: Record<string, number> = {
          'Biologi': existingMap['Biologi'] || 91,
          'Fisika': existingMap['Fisika'] || 90,
          'Kimia': existingMap['Kimia'] || 91,
          'Bahasa Jepang': existingMap['Bahasa Jepang'] || 92,
        };
        const coreSum = (sem.matematika || 0) + (sem.bahasaIndonesia || 0) + (sem.bahasaInggris || 0);
        const electivesSum = targetElectives.reduce((acc, s) => acc + (newMap[s] || 85), 0);
        const totalCount = 3 + targetElectives.length;
        return {
          ...sem,
          electiveGrades: newMap,
          rataRataUmum: +((coreSum + electivesSum) / totalCount).toFixed(1),
        };
      }
      return sem;
    });

    updateAndSaveRapor({
      ...raporData,
      chosenElectives: targetElectives,
      semesters: updatedSemesters,
    });
  };

  const handleToggleParticipation = () => {
    onUpdateYtbPreferences({
      ...ytbPreferences,
      isEnabled: !ytbPreferences.isEnabled,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Participation Toggle & Quick Status */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Pusat Persiapan Türkiye Bursları (YTB 2027)
                </h2>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    ytbPreferences.isEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ytbPreferences.isEnabled ? 'Status: Diikuti (Aktif)' : 'Status: Tidak Diikuti (Nonaktif)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Beasiswa penuh pemerintah Turki untuk jenjang S1 (Tuition fee, asrama, uang saku bulanan, tiket pesawat PP, dan asuransi).
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              Ikuti Beasiswa Ini:
            </span>
            <button
              type="button"
              onClick={handleToggleParticipation}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                ytbPreferences.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  ytbPreferences.isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* If Disabled State Message */}
        {!ytbPreferences.isEnabled && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Jalur Beasiswa Türkiye Bursları Sedang Dinonaktifkan:</strong>{' '}
              Anda saat ini memfokuskan persiapan pada TKA SMA dan UTBK-SNBT. Modul ini tetap dapat Anda jelajahi untuk referensi dokumen dan esai, atau aktifkan kembali tombol di atas kapan pun Anda siap.
            </div>
          </div>
        )}

        {/* Real-time Accurate Countdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-500">Pendaftaran Portal TBBS</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {countdowns.ytbPortal.daysLeft}{' '}
              <span className="text-xs font-normal text-slate-500">hari ({countdowns.ytbPortal.dateFormatted})</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-500">Tes Akademik YÖS / YTB</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {countdowns.ytbExam.daysLeft}{' '}
              <span className="text-xs font-normal text-slate-500">hari ({countdowns.ytbExam.dateFormatted})</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-500">TKA SMA (26 Okt)</div>
            <div className="text-lg font-bold font-mono tabular-nums text-amber-600 mt-0.5">
              {countdowns.tka.daysLeft}{' '}
              <span className="text-xs font-normal text-slate-500">hari ({countdowns.tka.dateFormatted})</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-500">UTBK-SNBT 2027</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {countdowns.snbt.daysLeft}{' '}
              <span className="text-xs font-normal text-slate-500">hari ({countdowns.snbt.dateFormatted})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setSubTab('rapor-calculator')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'rapor-calculator'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-indigo-600" />
          <span>Kalkulator Rapor &amp; Profil Akademik</span>
        </button>

        <button
          onClick={() => setSubTab('ytb-choices')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'ytb-choices'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-rose-600" />
          <span>Pilihan 1–12 Kampus &amp; Jurusan (Tercih TBBS)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-bold">
            {ytbChoices.length}/12
          </span>
        </button>

        <button
          onClick={() => setSubTab('documents')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'documents'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Berkas yang Harus Disiapkan ({YTB_REQUIRED_DOCUMENTS.length})</span>
        </button>

        <button
          onClick={() => setSubTab('universities')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'universities'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Katalog &amp; Profil Kampus Turki</span>
        </button>

        <button
          onClick={() => setSubTab('essay-guide')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'essay-guide'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Struktur Letter of Intent (Esai) yang Baik</span>
        </button>

        <button
          onClick={() => setSubTab('essay-samples')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'essay-samples'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Contoh Asli Esai Awardee Lolos</span>
        </button>
      </div>

      {/* 3. Sub-Tab Views */}

      {/* VIEW A: KALKULATOR NILAI RAPOR & PERSENTASE KELULUSAN AKURAT */}
      {subTab === 'rapor-calculator' && (
        <div className="space-y-6">
          {/* Probability Assessment Box */}
          <div 
            className="p-6 rounded-2xl border shadow-xs space-y-4"
            style={{
              backgroundColor: currentTheme.bgTint,
              borderColor: `${currentTheme.primary}40`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Hasil Analisis Akurasi Persentase Kelulusan Berkas YTB
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                  Peluang Diterima:{' '}
                  <span style={{ color: currentTheme.primary }}>
                    {probabilityAnalysis.probabilityScore}%
                  </span>{' '}
                  · {probabilityAnalysis.zone}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Rata-rata Rapor Kumulatif (Semester 1–5):{' '}
                  <strong className="font-mono text-slate-900">{overallGpa} / 100</strong>{' '}
                  (Batas Minimal Resmi YTB: 70 untuk S1 Umum / 90 untuk Kedokteran).
                </p>
              </div>

              {/* Progress Bar Circular / Metric Box */}
              <div className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-center shrink-0">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Skor Probabilitas</div>
                <div className="text-3xl font-extrabold font-mono text-slate-900" style={{ color: currentTheme.primary }}>
                  {probabilityAnalysis.probabilityScore}%
                </div>
              </div>
            </div>

            {/* Breakdown Insights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Kekuatan Profil Akademik Kamu:
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {probabilityAnalysis.breakdownInsights.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Rekomendasi Tindakan untuk Maksimalkan Lolos:
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {probabilityAnalysis.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bridge: Penjelasan Peluang Beasiswa vs Target Kampus & Jurusan */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-sky-50 to-rose-50 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm flex flex-wrap items-center gap-2">
                  <span>Apakah Persentase di Atas Sudah Menyertakan Kampus &amp; Jurusan?</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                    Profil Kelayakan Umum
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Skor di atas adalah <strong>Evaluasi Kesiapan Akademik Umum</strong> Anda. Pada sistem resmi Türkiye Bursları (portal TBBS), penerimaan beasiswa <strong>selalu terikat langsung dengan pilihan 1 s/d 12 universitas &amp; jurusan</strong> yang Anda tentukan! Peluang di kampus Tier 1 (Boğaziçi/METU) tentu berbeda jauh dengan Tier 3 (Bursa Uludağ/Akdeniz), serta wajib memenuhi <em>Aturan Geografi 3 Kota Besar</em>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubTab('ytb-choices')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-1.5 shrink-0 hover:opacity-90 transition-all cursor-pointer"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <span>Atur 1–12 Kampus &amp; Jurusan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Form Input Rapor Semester 1 - 5 Kurikulum Merdeka */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Kurikulum Merdeka
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Sistem Rapor Indonesia untuk Seleksi TBBS
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mt-1">
                  Input Nilai Rapor Semester 1 s/d 5 (Skala 0 - 100)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Di Kelas 10 (Smt 1 &amp; 2), IPA dan IPS dipelajari sebagai satu rumpun terpadu. Sedangkan di Kelas 11 &amp; 12 (Smt 3, 4, 5), siswa mendalami <strong>3 hingga 4 mata pelajaran pilihan</strong> yang konsisten.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
                Rata-rata Kumulatif 5 Semester:{' '}
                <span className="font-mono text-slate-900 font-extrabold text-sm ml-1" style={{ color: currentTheme.primary }}>
                  {overallGpa}
                </span>
                <span className="text-[11px] text-slate-400 font-normal ml-0.5">/ 100</span>
              </div>
            </div>

            {/* A. Konfigurasi Mata Pelajaran Pilihan Kelas 11 & 12 (3 - 4 Mapel) */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">
                    Mata Pelajaran Pilihan Kelas 11 &amp; 12 ({raporData.chosenElectives.length}/4 Terpilih):
                  </span>
                  <span className="text-[11px] text-slate-500 italic hidden md:inline">
                    (Kelas 12 konsisten mengikuti pilihan kelas 11)
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleSetUserPreset}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
                    title="Pasang mapel pilihan: Biologi, Fisika, Kimia, Bahasa Jepang"
                  >
                    ⚡ Preset Kamu (Bio, Fis, Kim, B. Jepang)
                  </button>

                  {raporData.chosenElectives.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setIsElectiveModalOpen(true)}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Mapel Pilihan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chosen Electives Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {raporData.chosenElectives.map((subject, idx) => {
                  const subjectMeta = AVAILABLE_ELECTIVE_SUBJECTS.find((s) => s.name === subject);
                  const categoryTag = subjectMeta?.category || 'Pilihan';

                  const badgeColor =
                    categoryTag === 'MIPA'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : categoryTag === 'IPS'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : categoryTag === 'Bahasa & Budaya'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

                  return (
                    <div
                      key={subject}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${badgeColor}`}
                    >
                      <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                      <span>{subject}</span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/70 font-semibold">
                        {categoryTag}
                      </span>
                      {raporData.chosenElectives.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveElective(subject)}
                          className="hover:text-rose-600 transition-colors p-0.5 rounded cursor-pointer"
                          title={`Hapus ${subject} dari mapel pilihan`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* B. TABEL 1: Kelas 10 (Semester 1 & 2) - Fondasi Terpadu */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Bagian 1: Kelas 10 · Semester 1 &amp; 2 (Fondasi IPA &amp; IPS Terpadu)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  5 Mapel (Mat, B. Indo, B. Ing, IPA Terpadu, IPS Terpadu)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                      <th className="p-3 font-semibold w-36">Semester</th>
                      <th className="p-3 font-semibold">Matematika</th>
                      <th className="p-3 font-semibold">B. Indonesia</th>
                      <th className="p-3 font-semibold">B. Inggris</th>
                      <th className="p-3 font-semibold text-emerald-800 bg-emerald-50/50">
                        IPA Terpadu (Fis/Kim/Bio)
                      </th>
                      <th className="p-3 font-semibold text-amber-800 bg-amber-50/50">
                        IPS Terpadu (Eko/Sos/Geo/Sej)
                      </th>
                      <th className="p-3 font-semibold text-right">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {[0, 1].map((idx) => {
                      const sem = raporData.semesters[idx];
                      if (!sem) return null;
                      return (
                        <tr key={sem.semester} className="hover:bg-slate-50/60">
                          <td className="p-3 font-sans font-bold text-slate-800">
                            Semester {sem.semester} <span className="text-[10px] text-slate-400 font-normal">(Kelas 10)</span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.matematika}
                              onChange={(e) => handleUpdateKelas10Score(idx as 0 | 1, 'matematika', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.bahasaIndonesia}
                              onChange={(e) => handleUpdateKelas10Score(idx as 0 | 1, 'bahasaIndonesia', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.bahasaInggris}
                              onChange={(e) => handleUpdateKelas10Score(idx as 0 | 1, 'bahasaInggris', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3 bg-emerald-50/30">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.ipaTerpadu ?? 87}
                              onChange={(e) => handleUpdateKelas10Score(idx as 0 | 1, 'ipaTerpadu', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-emerald-300 text-center font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                            />
                          </td>
                          <td className="p-3 bg-amber-50/30">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.ipsTerpadu ?? 86}
                              onChange={(e) => handleUpdateKelas10Score(idx as 0 | 1, 'ipsTerpadu', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-amber-300 text-center font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                            />
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900 text-sm">
                            {sem.rataRataUmum}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* C. TABEL 2: Kelas 11 & 12 (Semester 3, 4, 5) - Mata Pelajaran Pilihan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Bagian 2: Kelas 11 &amp; 12 · Semester 3, 4, 5 (Mata Pelajaran Pilihan Terfokus)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  {3 + raporData.chosenElectives.length} Mapel (3 Mapel Wajib + {raporData.chosenElectives.length} Mapel Pilihan)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                      <th className="p-3 font-semibold w-36">Semester</th>
                      <th className="p-3 font-semibold">Matematika</th>
                      <th className="p-3 font-semibold">B. Indonesia</th>
                      <th className="p-3 font-semibold">B. Inggris</th>
                      {raporData.chosenElectives.map((elective) => (
                        <th key={elective} className="p-3 font-semibold text-indigo-900 bg-indigo-50/40">
                          {elective}
                        </th>
                      ))}
                      <th className="p-3 font-semibold text-right">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {[2, 3, 4].map((idx) => {
                      const sem = raporData.semesters[idx];
                      if (!sem) return null;
                      const isLatest = sem.semester === 5;
                      const gradeLabel =
                        sem.semester === 3
                          ? 'Kelas 11 Smt 1'
                          : sem.semester === 4
                          ? 'Kelas 11 Smt 2'
                          : 'Kelas 12 Smt 1 (Terlampir TBBS)';

                      return (
                        <tr key={sem.semester} className={`hover:bg-slate-50/60 ${isLatest ? 'bg-indigo-50/20' : ''}`}>
                          <td className="p-3 font-sans font-bold text-slate-800">
                            Semester {sem.semester}{' '}
                            <span className="text-[10px] text-indigo-600 font-semibold block">
                              {gradeLabel}
                            </span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.matematika}
                              onChange={(e) => handleUpdateKelas11or12Core(idx as 2 | 3 | 4, 'matematika', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.bahasaIndonesia}
                              onChange={(e) => handleUpdateKelas11or12Core(idx as 2 | 3 | 4, 'bahasaIndonesia', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sem.bahasaInggris}
                              onChange={(e) => handleUpdateKelas11or12Core(idx as 2 | 3 | 4, 'bahasaInggris', Number(e.target.value))}
                              className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                          {raporData.chosenElectives.map((elective) => {
                            const gradeVal = sem.electiveGrades?.[elective] ?? 90;
                            return (
                              <td key={elective} className="p-3 bg-indigo-50/20">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={gradeVal}
                                  onChange={(e) => handleUpdateElectiveGrade(idx as 2 | 3 | 4, elective, Number(e.target.value))}
                                  className="w-16 p-1.5 rounded-lg border border-indigo-200 text-center font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                />
                              </td>
                            );
                          })}
                          <td className="p-3 text-right font-bold text-slate-900 text-sm">
                            {sem.rataRataUmum}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profile Booster Checkboxes */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={raporData.hasEnglishCert}
                  onChange={(e) => setRaporData({ ...raporData, hasEnglishCert: e.target.checked })}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Sertifikat Bahasa Asing</div>
                  <div className="text-slate-500 text-[11px]">TOEFL / IELTS / DET Resmi</div>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={raporData.hasOlympOrAwards}
                  onChange={(e) => setRaporData({ ...raporData, hasOlympOrAwards: e.target.checked })}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Prestasi Olimpiade / KIR</div>
                  <div className="text-slate-500 text-[11px]">Juara Kota/Provinsi/Nasional</div>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={hasLoIReady}
                  onChange={(e) => setHasLoIReady(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Draft Letter of Intent (LoI)</div>
                  <div className="text-slate-500 text-[11px]">Esai Terstruktur 4 Bagian</div>
                </div>
              </label>

              <div
                onClick={() => setSubTab('ytb-choices')}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  cityRuleCompliant
                    ? 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-950'
                    : 'border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 text-amber-950'
                }`}
                title="Klik untuk membuka dan mengatur daftar 12 pilihan kampus TBBS"
              >
                <div className="mt-0.5">
                  {cityRuleCompliant ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>Aturan Kota TBBS</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      cityRuleCompliant ? 'bg-emerald-200/80 text-emerald-900' : 'bg-amber-200/80 text-amber-900'
                    }`}>
                      {cityRuleCompliant ? 'Terpenuhi ✅' : 'Perlu Diatur ⚠️'}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80">
                    {choiceStrategyAssessment.outsideBigThreeCount} di luar 3 kota · Atur di tab Tercih →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW BARU: SIMULASI & STRATEGI 12 TERCIH KAMPUS & JURUSAN YTB */}
      {subTab === 'ytb-choices' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider bg-rose-600">
                    Sistem TBBS Resmi
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Daftar 1 s/d 12 Tercih Universitas &amp; Program Studi
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                  Simulasi 12 Pilihan Kampus &amp; Jurusan (Türkiye Bursları)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Penerimaan beasiswa Türkiye Bursları <strong>tidak berdiri sendiri</strong>, melainkan terikat langsung pada pilihan prodi Anda di portal TBBS. Sistem mengevaluasi kelayakan rapor Anda ({overallGpa}/100) terhadap ambang batas jurusan (Kedokteran min. 90.0, Teknik/Sains min. 70.0), kasta kampus (Tier 1 vs Tier 3), dan kepatuhan terhadap <strong>Aturan Geografi 3 Kota Besar</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoSortStrategy}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Urutkan pilihan secara strategis: Impian (Tier 1) di atas, Realistis (Tier 2) di tengah, Aman luar 3 kota (Tier 3) di penutup"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Urutkan Strategi</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultChoices}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Kembalikan ke preset rekomendasi 6 pilihan seimbang"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preset Standar</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddChoiceModal}
                  disabled={ytbChoices.length >= 12}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all ${
                    ytbChoices.length >= 12
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'hover:opacity-90 cursor-pointer'
                  }`}
                  style={{ backgroundColor: ytbChoices.length >= 12 ? undefined : currentTheme.primary }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pilihan ({ytbChoices.length}/12)</span>
                </button>
              </div>
            </div>

            {/* TBBS Metric & Rules Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* Box 1: Aturan Geografi 3 Kota Besar */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                choiceStrategyAssessment.isCityRuleCompliant
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    {choiceStrategyAssessment.isCityRuleCompliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    Aturan Geografi TBBS:
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white font-bold">
                    {choiceStrategyAssessment.outsideBigThreeCount} / {choiceStrategyAssessment.totalChoices} Luar 3 Kota ({choiceStrategyAssessment.outsideRatioPercentage}%)
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {choiceStrategyAssessment.cityRuleMessage}
                </p>
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      choiceStrategyAssessment.isCityRuleCompliant ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, choiceStrategyAssessment.outsideRatioPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Box 2: Peluang Kelolosan Portofolio Keseluruhan */}
              <div 
                className="p-4 rounded-xl border text-xs space-y-1.5"
                style={{
                  backgroundColor: currentTheme.bgTint,
                  borderColor: `${currentTheme.primary}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Peluang Lolos Portofolio:</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900" style={{ color: currentTheme.primary }}>
                    {choiceStrategyAssessment.overallPortfolioChance}%
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700">
                  {choiceStrategyAssessment.portfolioVerdict}
                </div>
                <p className="text-[10px] text-slate-500">
                  Kombinasi prodi impian (Tier 1) dan kampus aman di luar 3 kota memastikan Anda tetap memiliki pintu kelulusan terbuka.
                </p>
              </div>

              {/* Box 3: Tips & Saran Strategis */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Rekomendasi Panel Reviewer:
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  {choiceStrategyAssessment.strategicTips.slice(0, 2).map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Choice Cards List */}
          <div className="space-y-3">
            {choiceStrategyAssessment.evaluatedChoices.map((item, idx) => {
              const { choice, probability, statusZone, isGpaEligible, feedback } = item;
              const isFirst = idx === 0;
              const isLast = idx === choiceStrategyAssessment.evaluatedChoices.length - 1;

              return (
                <div
                  key={choice.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    !isGpaEligible
                      ? 'border-rose-300 bg-rose-50/40'
                      : choice.tier.includes('Tier 3')
                      ? 'border-emerald-200/90 bg-emerald-50/20 hover:bg-emerald-50/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50/70 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Choice Information */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs text-white shadow-xs shrink-0"
                          style={{
                            backgroundColor: choice.tier.includes('Tier 1')
                              ? '#4f46e5'
                              : choice.tier.includes('Tier 2')
                              ? '#0284c7'
                              : '#059669',
                          }}
                        >
                          #{choice.order}
                        </span>

                        <h4 className="font-bold text-slate-900 text-base">
                          {choice.universityName}
                        </h4>

                        {/* City Tag */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            choice.isTopThreeCities
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          {choice.city} {choice.isTopThreeCities ? '(3 Kota Besar)' : '(Luar 3 Kota Besar ✅)'}
                        </span>

                        {/* Tier Tag */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {choice.tier.split(' - ')[0]}
                        </span>
                      </div>

                      {/* Major, Language, and Min GPA */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-extrabold text-slate-800 font-['Outfit']">
                          {choice.majorName}
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          choice.languageOfInstruction.includes('100% Bahasa Inggris')
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {choice.languageOfInstruction}
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          choice.minGpaRequired >= 90
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          Min. Rapor YTB: {choice.minGpaRequired}.0
                        </span>
                      </div>

                      {choice.notes && (
                        <p className="text-xs text-slate-500 italic">
                          "{choice.notes}"
                        </p>
                      )}

                      {/* Feedback from Evaluator */}
                      <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                        !isGpaEligible
                          ? 'bg-rose-100/80 text-rose-950 border border-rose-200 font-medium'
                          : 'bg-slate-50 text-slate-700 border border-slate-100'
                      }`}>
                        <Info className={`w-4 h-4 shrink-0 mt-0.5 ${!isGpaEligible ? 'text-rose-600' : 'text-indigo-600'}`} />
                        <span>{feedback}</span>
                      </div>
                    </div>

                    {/* Probability & Actions Box */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* Probability Gauge */}
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Peluang Pilihan Ini
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-0.5">
                          <span
                            className={`text-2xl font-extrabold font-mono tabular-nums ${
                              !isGpaEligible
                                ? 'text-rose-600'
                                : probability >= 82
                                ? 'text-emerald-600'
                                : probability >= 68
                                ? 'text-indigo-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {probability}%
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                            !isGpaEligible
                              ? 'bg-rose-100 text-rose-800'
                              : probability >= 82
                              ? 'bg-emerald-100 text-emerald-800'
                              : probability >= 68
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {statusZone}
                        </span>
                      </div>

                      {/* Reorder and Edit Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveChoice(idx, 'up')}
                          disabled={isFirst}
                          className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                            isFirst ? 'opacity-30 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-100 cursor-pointer bg-white'
                          }`}
                          title="Geser Prioritas Naik"
                        >
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveChoice(idx, 'down')}
                          disabled={isLast}
                          className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                            isLast ? 'opacity-30 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-100 cursor-pointer bg-white'
                          }`}
                          title="Geser Prioritas Turun"
                        >
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditChoiceModal(choice)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer bg-white text-slate-600"
                          title="Edit Pilihan"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(choice.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer bg-white text-rose-600"
                          title="Hapus Pilihan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Choice Bottom Banner */}
          {ytbChoices.length < 12 && (
            <button
              type="button"
              onClick={handleOpenAddChoiceModal}
              className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pilihan Kampus #{ytbChoices.length + 1} (Tersisa {12 - ytbChoices.length} Pilihan Lagi)</span>
            </button>
          )}
        </div>
      )}

      {/* VIEW B: PERSYARATAN BERKAS LENGKAP */}
      {subTab === 'documents' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mb-1">
              Checklist &amp; Spesifikasi Berkas Resmi Türkiye Bursları
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Siapkan dokumen dalam format PDF berkualitas tinggi dengan resolusi jelas. Semua dokumen berbahasa Indonesia wajib disertai terjemahan tersumpah.
            </p>

            <div className="space-y-3">
              {YTB_REQUIRED_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{doc.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.category === 'Wajib Utama'
                            ? 'bg-rose-100 text-rose-800'
                            : doc.category === 'Sangat Direkomendasikan'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {doc.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{doc.format}</span>
                  </div>

                  <p className="text-xs text-slate-600">{doc.description}</p>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
                    <strong className="text-indigo-900">Tips Penting Panitia:</strong> {doc.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: ATURAN PEMILIHAN KAMPUS & JURUSAN TBBS */}
      {subTab === 'universities' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold text-sm flex items-center gap-2 text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Aturan Kunci Sistem Pemilihan Kampus Türkiye Bursları (TBBS):
            </div>
            <p className="leading-relaxed">
              Di portal beasiswa TBBS, pelamar dapat memilih hingga <strong>maksimal 12 pilihan universitas dan program studi</strong>. Namun terdapat <strong>ATURAN GEOGRAFI KETAT</strong>: Anda <em>TIDAK DIIZINKAN</em> memilih seluruh kampus hanya di 3 kota metropolitan (Istanbul, Ankara, dan Izmir). Minimal 1/3 (setidaknya 2–3 pilihan) wajib dialokasikan ke universitas unggulan di luar 3 kota besar (seperti Bursa, Eskişehir, Konya, atau Antalya). Pelamar yang melanggar aturan ini sering kali gagal di seleksi administratif!
            </p>
          </div>

          <div className="space-y-6">
            {YTB_UNIVERSITY_CLUSTERS.map((cluster, cIdx) => (
              <div
                key={cIdx}
                className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">
                      {cluster.tier}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mt-0.5">
                    {cluster.categoryTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cluster.ruleExplanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {cluster.universities.map((u, uIdx) => (
                    <div
                      key={uIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              u.isTopThreeCities ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {u.city} {u.isTopThreeCities ? '(3 Kota Besar)' : '(Luar 3 Kota Besar)'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 mt-1">
                          <strong>Pengantar:</strong> {u.languageOfInstruction}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {u.recommendedMajors.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 italic">
                        {u.acceptanceRateNotes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW D: STRUKTUR LETTER OF INTENT (ESAI) YANG BAIK */}
      {subTab === 'essay-guide' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Panduan Menulis Letter of Intent (Niyet Mektubu / Statement of Purpose)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Letter of Intent adalah penentu utama apakah berkas Anda lolos ke tahap wawancara tatap muka. Komite YTB Ankara mencari esai yang jujur, akademis, dan memiliki benang merah yang jelas.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Bagian 1: Latar Belakang &amp; Personal Academic Hook (150–200 kata)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hindari kalimat klise seperti <em>"Sejak kecil saya suka komputer..."</em>. Gantilah dengan pengalaman riset nyata semasa SMA, permasalahan nyata di lingkungan sekitar yang ingin Anda selesaikan, atau proyek penelitian yang pernah Anda kerjakan.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Bagian 2: Alasan Memilih Negara Turki (150–200 kata)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jelaskan posisi strategis Turki dalam disiplin ilmu Anda. Jika memilih teknik, sebutkan industri pertahanan/otomotif Turki yang maju pesat. Jika kedokteran, sebutkan riset transplantasi organ mutakhir Turki. Hindari hanya memuji Turki karena faktor pariwisata atau serial drama!
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                  Bagian 3: Alasan Memilih Universitas &amp; Jurusan Spesifik (200 kata)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sebutkan nama laboratorium riset di universitas pilihan pertama Anda (misal Boğaziçi / METU / İTÜ), nama profesor yang publikasinya Anda kagumi, atau mata kuliah pembeda yang tidak tersedia di Indonesia.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                  Bagian 4: Rencana Karir &amp; Kontribusi Bilateral Indonesia-Turki (150 kata)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paparkan apa yang akan Anda lakukan setelah lulus. Sebutkan bagaimana Anda akan menjadi jembatan hubungan diplomasi, riset, atau ekonomi bilateral antara Republik Indonesia dan Republik Turki.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: CONTOH ESAI ASLI DARI AWARDEE YANG LOLOS */}
      {subTab === 'essay-samples' && (
        <div className="space-y-6">
          {/* Sample Selector */}
          <div className="flex items-center gap-2">
            {YTB_SAMPLE_ESSAYS.map((essay, idx) => (
              <button
                key={essay.id}
                onClick={() => setActiveEssayIndex(idx)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeEssayIndex === idx
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-indigo-950'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                {essay.majorAdmitted.split('(')[0]} · {essay.universityAdmitted.split('(')[0]}
              </button>
            ))}
          </div>

          {/* Active Sample Card */}
          {(() => {
            const currentEssay = YTB_SAMPLE_ESSAYS[activeEssayIndex];
            return (
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">{currentEssay.authorInfo}</span>
                    <span>·</span>
                    <span>Lolos Tahun {currentEssay.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mt-1">
                    {currentEssay.title}
                  </h3>
                  <div className="text-xs text-indigo-700 font-semibold mt-1">
                    Diterima di: {currentEssay.universityAdmitted} ({currentEssay.majorAdmitted})
                  </div>
                </div>

                {/* English Content Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Versi Asli Bahasa Inggris (Yang Disubmit ke TBBS):
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                    {currentEssay.contentEnglish}
                  </p>
                </div>

                {/* Indonesian Translation */}
                <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Terjemahan Bahasa Indonesia &amp; Makna Inti:
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {currentEssay.contentIndonesian}
                  </p>
                </div>

                {/* Reviewer Breakdown Annotation */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Mengapa Esai Ini Berhasil Memikat Juri Beasiswa YTB Ankara?
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {currentEssay.reviewerNotes.map((note, nIdx) => (
                      <li key={nIdx}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 4. Modal Pilih Mata Pelajaran Pilihan Kelas 11 & 12 */}
      {isElectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Pilih Mata Pelajaran Pilihan Kelas 11 &amp; 12
                </h3>
                <p className="text-xs text-slate-500">
                  Sesuai Kurikulum Merdeka (maksimal 4 mapel pilihan, saat ini: {raporData.chosenElectives.length}/4)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsElectiveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['Semua', 'MIPA', 'IPS', 'Bahasa & Budaya', 'Vokasi / Terapan'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setElectiveFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold cursor-pointer transition-colors ${
                      electiveFilterCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Subject Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {AVAILABLE_ELECTIVE_SUBJECTS.filter(
                  (s) => electiveFilterCategory === 'Semua' || s.category === electiveFilterCategory
                ).map((subject) => {
                  const isAlreadyChosen = raporData.chosenElectives.includes(subject.name);
                  return (
                    <div
                      key={subject.name}
                      onClick={() => !isAlreadyChosen && handleAddElective(subject.name)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isAlreadyChosen
                          ? 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer group'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-indigo-600">
                          {subject.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{subject.category}</div>
                      </div>

                      {isAlreadyChosen ? (
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-200/60">
                          Sudah Terpilih
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom Elective Input */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Tidak menemukan mapelmu? Masukkan mapel pilihan kustom:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: Bahasa Korea / Antropologi Lanjut..."
                    value={customElectiveInput}
                    onChange={(e) => setCustomElectiveInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customElectiveInput.trim()) {
                        handleAddElective(customElectiveInput.trim());
                        setCustomElectiveInput('');
                      }
                    }}
                    disabled={!customElectiveInput.trim() || raporData.chosenElectives.length >= 4}
                    className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PILIHAN KAMPUS TBBS (YTB CHOICE) */}
      {isChoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm font-['Outfit']">
                  {editingChoiceId ? 'Edit Pilihan Kampus TBBS' : `Tambah Pilihan Kampus #${ytbChoices.length + 1} (Maks 12)`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Preset Selector */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Pilih Cepat dari Preset Universitas Ternama di Turki:
                </label>
                <select
                  onChange={(e) => {
                    const preset = YTB_PRESET_UNIVERSITIES.find((p) => p.name === e.target.value);
                    if (preset) {
                      setFormUnivName(preset.name);
                      setFormCity(preset.city);
                      setFormIsTopThree(preset.isTopThreeCities);
                      setFormTier(preset.tier);
                      setFormMajorName(preset.majors[0].name);
                      setFormLang(preset.majors[0].language);
                      setFormMinGpa(preset.majors[0].minGpa);
                    }
                  }}
                  value={formUnivName}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <optgroup label="Tier 1 - Kampus Elit Global (Sangat Selektif)">
                    {YTB_PRESET_UNIVERSITIES.filter((u) => u.tier.includes('Tier 1')).map((u) => (
                      <option key={u.name} value={u.name}>
                        {u.name} ({u.city})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 2 - Universitas Negeri Utama di Kota Besar">
                    {YTB_PRESET_UNIVERSITIES.filter((u) => u.tier.includes('Tier 2')).map((u) => (
                      <option key={u.name} value={u.name}>
                        {u.name} ({u.city})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 3 - Kampus Kunci Lolos Luar 3 Kota (Sesuai Aturan TBBS)">
                    {YTB_PRESET_UNIVERSITIES.filter((u) => u.tier.includes('Tier 3')).map((u) => (
                      <option key={u.name} value={u.name}>
                        {u.name} ({u.city} - Luar 3 Kota ✅)
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[11px] text-slate-500">
                  Memilih preset otomatis mengatur nama kampus, kota, kasta tier, dan daftar prodi populer.
                </p>
              </div>

              {/* Major Selector */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Program Studi / Jurusan:
                </label>
                {/* Check if current univ has preset majors */}
                {(() => {
                  const currentPreset = YTB_PRESET_UNIVERSITIES.find((u) => u.name === formUnivName);
                  if (currentPreset) {
                    return (
                      <div className="space-y-2">
                        <select
                          value={formMajorName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormMajorName(val);
                            const matchedMajor = currentPreset.majors.find((m) => m.name === val);
                            if (matchedMajor) {
                              setFormLang(matchedMajor.language);
                              setFormMinGpa(matchedMajor.minGpa);
                            }
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                        >
                          {currentPreset.majors.map((m) => (
                            <option key={m.name} value={m.name}>
                              {m.name} ({m.language})
                            </option>
                          ))}
                          <option value="CUSTOM">-- Ketik Jurusan Lainnya --</option>
                        </select>

                        {formMajorName === 'CUSTOM' && (
                          <input
                            type="text"
                            placeholder="Ketik nama jurusan impian Anda..."
                            onChange={(e) => setFormMajorName(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    );
                  }
                  return (
                    <input
                      type="text"
                      value={formMajorName}
                      onChange={(e) => setFormMajorName(e.target.value)}
                      placeholder="Contoh: Computer Engineering / Kedokteran"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  );
                })()}
              </div>

              {/* City and Big 3 Flag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Kota Lokasi:</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => {
                      const c = e.target.value;
                      setFormCity(c);
                      const isBig3 = ['istanbul', 'ankara', 'izmir'].includes(c.toLowerCase().trim());
                      setFormIsTopThree(isBig3);
                    }}
                    placeholder="Contoh: Bursa / Istanbul"
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Status Aturan Geografi:</label>
                  <div className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
                    formIsTopThree ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  }`}>
                    {formIsTopThree ? '3 Kota Besar (Istanbul/Ankara/Izmir)' : 'Luar 3 Kota Besar (Aman TBBS ✅)'}
                  </div>
                </div>
              </div>

              {/* Language of Instruction */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Bahasa Pengantar Perkuliahan:
                </label>
                <select
                  value={formLang}
                  onChange={(e) => setFormLang(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="100% Bahasa Inggris">100% Bahasa Inggris (Wajib Sertifikat TOEFL/IELTS/DET)</option>
                  <option value="Bahasa Turki (dengan TÖMER 1 Thn Gratis)">Bahasa Turki (Otomatis Beasiswa Kursus TÖMER 1 Tahun Gratis)</option>
                  <option value="Campuran (Inggris & Turki)">Campuran (30% Inggris + 70% Turki)</option>
                </select>
              </div>

              {/* Minimum GPA Requirement Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Batas Minimal Nilai Rapor Resmi YTB:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                    formMinGpa >= 90 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {formMinGpa}.0 / 100
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {formMinGpa >= 90
                    ? 'Jurusan rumpun Kesehatan/Kedokteran memiliki syarat mutlak minimal 90.0 di portal TBBS.'
                    : 'Jurusan Teknik, Sains, dan Sosial memiliki syarat minimal 70.0 (disarankan > 82).'}
                </p>
              </div>

              {/* Personal Notes */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Catatan Personal / Alasan Memilih:</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Kampus impian utama, dosen pembimbing kuat di bidang AI"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setIsChoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveChoiceModal}
                disabled={!formUnivName.trim() || !formMajorName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {editingChoiceId ? 'Simpan Perubahan' : 'Tambahkan ke Daftar Tercih'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
