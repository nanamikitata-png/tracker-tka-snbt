export interface ExamCountdown {
  id: string;
  name: string;
  targetDate: Date;
  dateFormatted: string;
  daysLeft: number;
  badge: string;
}

export function getExamCountdowns(): {
  tka: ExamCountdown;
  snbt: ExamCountdown;
  ytbPortal: ExamCountdown;
  ytbExam: ExamCountdown;
} {
  const now = new Date();
  // Normalize now to midnight for clean day calculation
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. TKA SMA: Tanggal 26 Oktober 2026 (sesuai instruksi user)
  const tkaDate = new Date(2026, 9, 26); // October 26, 2026
  const diffTka = Math.max(0, Math.ceil((tkaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // 2. UTBK-SNBT 2027: Tanggal 22 April 2027 (Jadwal resmi Gelombang 1)
  const snbtDate = new Date(2027, 3, 22); // April 22, 2027
  const diffSnbt = Math.max(0, Math.ceil((snbtDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // 3. Pendaftaran Portal Türkiye Bursları (TBBS): 10 Januari 2027
  const ytbPortalDate = new Date(2027, 0, 10); // January 10, 2027
  const diffYtbPortal = Math.max(0, Math.ceil((ytbPortalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // 4. Tes Akademik / YÖS Beasiswa Turki: 15 Maret 2027
  const ytbExamDate = new Date(2027, 2, 15); // March 15, 2027
  const diffYtbExam = Math.max(0, Math.ceil((ytbExamDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    tka: {
      id: 'tka',
      name: 'TKA SMA (3 Wajib + 2 Pilihan)',
      targetDate: tkaDate,
      dateFormatted: '26 Oktober 2026',
      daysLeft: diffTka,
      badge: diffTka <= 30 ? 'Mendesak (Bulan Ini)' : 'Persiapan',
    },
    snbt: {
      id: 'snbt',
      name: 'UTBK-SNBT 2027 (7 Subtes)',
      targetDate: snbtDate,
      dateFormatted: '22 April 2027',
      daysLeft: diffSnbt,
      badge: 'Target Utama PTN',
    },
    ytbPortal: {
      id: 'ytb-portal',
      name: 'Submit Berkas Portal TBBS',
      targetDate: ytbPortalDate,
      dateFormatted: '10 Januari 2027',
      daysLeft: diffYtbPortal,
      badge: 'Batas Berkas',
    },
    ytbExam: {
      id: 'ytb-exam',
      name: 'Tes Akademik YTB / YÖS',
      targetDate: ytbExamDate,
      dateFormatted: '15 Maret 2027',
      daysLeft: diffYtbExam,
      badge: 'Seleksi Akademik',
    },
  };
}
