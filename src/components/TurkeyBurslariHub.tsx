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
} from 'lucide-react';
import { UniversityTarget, PaletteTheme, YtbPreferences, RaporData, SemesterRapor } from '../types';
import {
  YTB_REQUIRED_DOCUMENTS,
  YTB_UNIVERSITY_CLUSTERS,
  YTB_SAMPLE_ESSAYS,
  calculateYtbProbability,
} from '../data/ytbGuideData';
import { getExamCountdowns } from '../utils/countdown';

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
  const [subTab, setSubTab] = useState<'rapor-calculator' | 'documents' | 'universities' | 'essay-guide' | 'essay-samples'>('rapor-calculator');
  const [activeEssayIndex, setActiveEssayIndex] = useState<number>(0);
  const countdowns = getExamCountdowns();

  // Rapor Data State (Semester 1 to 5)
  const [raporData, setRaporData] = useState<RaporData>({
    semesters: [
      { semester: 1, matematika: 88, bahasaInggris: 86, bahasaIndonesia: 88, peminatan1: 85, peminatan2: 87, rataRataUmum: 86.8 },
      { semester: 2, matematika: 89, bahasaInggris: 88, bahasaIndonesia: 87, peminatan1: 87, peminatan2: 88, rataRataUmum: 87.8 },
      { semester: 3, matematika: 91, bahasaInggris: 89, bahasaIndonesia: 90, peminatan1: 88, peminatan2: 89, rataRataUmum: 89.4 },
      { semester: 4, matematika: 92, bahasaInggris: 91, bahasaIndonesia: 89, peminatan1: 90, peminatan2: 91, rataRataUmum: 90.6 },
      { semester: 5, matematika: 94, bahasaInggris: 92, bahasaIndonesia: 91, peminatan1: 92, peminatan2: 93, rataRataUmum: 92.4 },
    ],
    hasEnglishCert: true,
    certType: 'Duolingo English Test (DET)',
    certScore: '125 (CEFR C1)',
    hasOlympOrAwards: true,
    awardLevel: 'Nasional (OSN)',
    hasExtracurricular: true,
  });

  const [hasLoIReady, setHasLoIReady] = useState<boolean>(true);
  const [cityRuleCompliant, setCityRuleCompliant] = useState<boolean>(
    ytbPreferences.preferredCitiesChoice === 'Kombinasi Seimbang (Sesuai Aturan YTB)'
  );

  // Compute average of all semester averages
  const overallGpa = +(
    raporData.semesters.reduce((acc, s) => acc + s.rataRataUmum, 0) /
    raporData.semesters.length
  ).toFixed(1);

  // Compute acceptance probability
  const probabilityAnalysis = calculateYtbProbability(
    overallGpa,
    raporData.hasEnglishCert,
    raporData.hasOlympOrAwards,
    hasLoIReady,
    cityRuleCompliant,
    ytbPreferences.targetMajorCluster
  );

  const handleUpdateSemesterScore = (
    semIndex: number,
    field: keyof SemesterRapor,
    value: number
  ) => {
    const updated = [...raporData.semesters];
    const sem = { ...updated[semIndex], [field]: value };
    // recalculate average of this semester
    const sum = sem.matematika + sem.bahasaInggris + sem.bahasaIndonesia + sem.peminatan1 + sem.peminatan2;
    sem.rataRataUmum = +(sum / 5).toFixed(1);
    updated[semIndex] = sem;
    setRaporData({ ...raporData, semesters: updated });
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
          <span>Kalkulator Rapor &amp; Prediksi Lolos</span>
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
          <span>Aturan Pemilihan Kampus &amp; Jurusan TBBS</span>
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

          {/* Form Input Rapor Semester 1 - 5 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Input Nilai Rapor Semester 1 s/d 5 (Skala 0 - 100)
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah angka nilai per semester di bawah ini untuk melihat pergeseran persentase kelulusanmu secara real-time.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Rata-rata 5 Semester: <span className="font-mono text-slate-900 font-bold">{overallGpa}</span>
              </div>
            </div>

            {/* Table of Semesters */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="p-2.5 font-semibold">Semester</th>
                    <th className="p-2.5 font-semibold">Matematika</th>
                    <th className="p-2.5 font-semibold">Bahasa Inggris</th>
                    <th className="p-2.5 font-semibold">Bahasa Indonesia</th>
                    <th className="p-2.5 font-semibold">Peminatan 1 (Fis/Eko)</th>
                    <th className="p-2.5 font-semibold">Peminatan 2 (Kim/Sos)</th>
                    <th className="p-2.5 font-semibold text-right">Rata-rata Smt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {raporData.semesters.map((sem, idx) => (
                    <tr key={sem.semester} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-sans font-bold text-slate-800">
                        Semester {sem.semester} {sem.semester === 5 ? '(Terbaru)' : ''}
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sem.matematika}
                          onChange={(e) => handleUpdateSemesterScore(idx, 'matematika', Number(e.target.value))}
                          className="w-16 p-1 rounded border border-slate-200 text-center font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sem.bahasaInggris}
                          onChange={(e) => handleUpdateSemesterScore(idx, 'bahasaInggris', Number(e.target.value))}
                          className="w-16 p-1 rounded border border-slate-200 text-center font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sem.bahasaIndonesia}
                          onChange={(e) => handleUpdateSemesterScore(idx, 'bahasaIndonesia', Number(e.target.value))}
                          className="w-16 p-1 rounded border border-slate-200 text-center font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sem.peminatan1}
                          onChange={(e) => handleUpdateSemesterScore(idx, 'peminatan1', Number(e.target.value))}
                          className="w-16 p-1 rounded border border-slate-200 text-center font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sem.peminatan2}
                          onChange={(e) => handleUpdateSemesterScore(idx, 'peminatan2', Number(e.target.value))}
                          className="w-16 p-1 rounded border border-slate-200 text-center font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {sem.rataRataUmum}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={cityRuleCompliant}
                  onChange={(e) => setCityRuleCompliant(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Aturan Kota YTB</div>
                  <div className="text-slate-500 text-[11px]">Min. 2-3 Kampus Luar 3 Kota Besar</div>
                </div>
              </label>
            </div>
          </div>
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
    </div>
  );
};
