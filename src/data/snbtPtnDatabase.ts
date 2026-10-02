import { DegreeLevel, SnbtChoice, SnbtStrategyAssessment, ChoiceProbability } from '../types';

export interface PtnPresetItem {
  universityName: string;
  majorName: string;
  degreeLevel: DegreeLevel;
  safeScoreThreshold: number;
  quota: number;
  applicantsLastYear: number;
  cluster: 'Saintek / Teknik' | 'Kesehatan' | 'Soshum / Bisnis' | 'Vokasi Terapan';
}

export const POPULAR_PTN_PRESETS: PtnPresetItem[] = [
  // ITB
  {
    universityName: 'Institut Teknologi Bandung (ITB)',
    majorName: 'Sekolah Teknik Elektro & Informatika (STEI-R Rekayasa)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 728,
    quota: 140,
    applicantsLastYear: 2850,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Institut Teknologi Bandung (ITB)',
    majorName: 'Fakultas Teknologi Industri (FTI-Ganesha)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 718,
    quota: 155,
    applicantsLastYear: 2410,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Institut Teknologi Bandung (ITB)',
    majorName: 'Fakultas Matematika & Ilmu Pengetahuan Alam (FMIPA-IPA)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 672,
    quota: 180,
    applicantsLastYear: 1650,
    cluster: 'Saintek / Teknik',
  },

  // UI
  {
    universityName: 'Universitas Indonesia (UI)',
    majorName: 'Pendidikan Dokter (FK UI)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 742,
    quota: 75,
    applicantsLastYear: 3950,
    cluster: 'Kesehatan',
  },
  {
    universityName: 'Universitas Indonesia (UI)',
    majorName: 'Ilmu Komputer (Fasilkom UI)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 724,
    quota: 85,
    applicantsLastYear: 2720,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Indonesia (UI)',
    majorName: 'Teknik Industri (FT UI)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 708,
    quota: 90,
    applicantsLastYear: 1980,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Indonesia (UI)',
    majorName: 'Bisnis Kreatif',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 638,
    quota: 70,
    applicantsLastYear: 1420,
    cluster: 'Vokasi Terapan',
  },

  // UGM
  {
    universityName: 'Universitas Gadjah Mada (UGM)',
    majorName: 'Teknologi Informasi (FT UGM)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 712,
    quota: 70,
    applicantsLastYear: 2450,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Gadjah Mada (UGM)',
    majorName: 'Teknik Sipil (FT UGM)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 685,
    quota: 95,
    applicantsLastYear: 1720,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Gadjah Mada (UGM)',
    majorName: 'Pengelolaan Hutan',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 620,
    quota: 65,
    applicantsLastYear: 980,
    cluster: 'Vokasi Terapan',
  },

  // ITS
  {
    universityName: 'Institut Teknologi Sepuluh Nopember (ITS)',
    majorName: 'Teknik Informatika (FTEIC ITS)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 714,
    quota: 90,
    applicantsLastYear: 2680,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Institut Teknologi Sepuluh Nopember (ITS)',
    majorName: 'Teknik Mesin (FTIRS ITS)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 678,
    quota: 110,
    applicantsLastYear: 1640,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Institut Teknologi Sepuluh Nopember (ITS)',
    majorName: 'Rekayasa Teknologi Manufaktur',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 628,
    quota: 60,
    applicantsLastYear: 1120,
    cluster: 'Vokasi Terapan',
  },

  // UNAIR
  {
    universityName: 'Universitas Airlangga (UNAIR)',
    majorName: 'Kedokteran Gigi (FKG UNAIR)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 705,
    quota: 80,
    applicantsLastYear: 2150,
    cluster: 'Kesehatan',
  },
  {
    universityName: 'Universitas Airlangga (UNAIR)',
    majorName: 'Farmasi (FF UNAIR)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 686,
    quota: 95,
    applicantsLastYear: 1890,
    cluster: 'Kesehatan',
  },
  {
    universityName: 'Universitas Airlangga (UNAIR)',
    majorName: 'Teknologi Radiologi Pencitraan',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 625,
    quota: 55,
    applicantsLastYear: 890,
    cluster: 'Vokasi Terapan',
  },

  // UNDIP
  {
    universityName: 'Universitas Diponegoro (UNDIP)',
    majorName: 'Teknik Komputer (FT UNDIP)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 676,
    quota: 80,
    applicantsLastYear: 1840,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Diponegoro (UNDIP)',
    majorName: 'Teknik Kimia (FT UNDIP)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 662,
    quota: 90,
    applicantsLastYear: 1350,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Diponegoro (UNDIP)',
    majorName: 'Rekayasa Perancangan Mekanik',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 615,
    quota: 70,
    applicantsLastYear: 820,
    cluster: 'Vokasi Terapan',
  },

  // UNPAD
  {
    universityName: 'Universitas Padjadjaran (UNPAD)',
    majorName: 'Teknik Elektro (FT UNPAD)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 668,
    quota: 75,
    applicantsLastYear: 1620,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Padjadjaran (UNPAD)',
    majorName: 'Teknologi Pangan',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 654,
    quota: 90,
    applicantsLastYear: 1530,
    cluster: 'Saintek / Teknik',
  },
  {
    universityName: 'Universitas Padjadjaran (UNPAD)',
    majorName: 'Akuntansi Perpajakan',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 622,
    quota: 65,
    applicantsLastYear: 1100,
    cluster: 'Vokasi Terapan',
  },

  // PENS (Politeknik Elektronika Negeri Surabaya)
  {
    universityName: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    majorName: 'Teknologi Rekayasa Komputer',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 636,
    quota: 60,
    applicantsLastYear: 1450,
    cluster: 'Vokasi Terapan',
  },
  {
    universityName: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    majorName: 'Teknik Telekomunikasi',
    degreeLevel: 'D3 (Diploma)',
    safeScoreThreshold: 595,
    quota: 60,
    applicantsLastYear: 920,
    cluster: 'Vokasi Terapan',
  },

  // POLBAN (Politeknik Negeri Bandung)
  {
    universityName: 'Politeknik Negeri Bandung (POLBAN)',
    majorName: 'Teknik Informatika',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 632,
    quota: 64,
    applicantsLastYear: 1580,
    cluster: 'Vokasi Terapan',
  },
  {
    universityName: 'Politeknik Negeri Bandung (POLBAN)',
    majorName: 'Teknik Mesin',
    degreeLevel: 'D3 (Diploma)',
    safeScoreThreshold: 588,
    quota: 72,
    applicantsLastYear: 840,
    cluster: 'Vokasi Terapan',
  },
];

// Initial starter choices for class 12 student
export const DEFAULT_SNBT_CHOICES: SnbtChoice[] = [
  {
    id: 'snbt-c-1',
    order: 1,
    universityName: 'Institut Teknologi Bandung (ITB)',
    majorName: 'Sekolah Teknik Elektro & Informatika (STEI-R)',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 728,
    quota: 140,
    applicantsLastYear: 2850,
    notes: 'Pilihan Ambisius / Idaman Utama',
  },
  {
    id: 'snbt-c-2',
    order: 2,
    universityName: 'Institut Teknologi Sepuluh Nopember (ITS)',
    majorName: 'Teknik Informatika',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 714,
    quota: 90,
    applicantsLastYear: 2680,
    notes: 'Pilihan Kompetitif & Realistis',
  },
  {
    id: 'snbt-c-3',
    order: 3,
    universityName: 'Universitas Diponegoro (UNDIP)',
    majorName: 'Teknik Komputer',
    degreeLevel: 'S1 (Sarjana)',
    safeScoreThreshold: 676,
    quota: 80,
    applicantsLastYear: 1840,
    notes: 'Pilihan Pengaman Akademik',
  },
  {
    id: 'snbt-c-4',
    order: 4,
    universityName: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    majorName: 'Teknologi Rekayasa Komputer',
    degreeLevel: 'D4 (Sarjana Terapan)',
    safeScoreThreshold: 636,
    quota: 60,
    applicantsLastYear: 1450,
    notes: 'Jaring Pengaman Vokasi Unggulan',
  },
];

/**
 * Validates BPPP Selection Rules for 1, 2, 3, or 4 choices:
 * - 1 choice: Any level (S1, D4, D3)
 * - 2 choices: Any level (e.g. 2 S1, 1 S1 + 1 Vokasi, 2 Vokasi)
 * - 3 choices: Maximum 2 S1, at least 1 Vocational (D4/D3)
 * - 4 choices: Maximum 2 S1, at least 2 Vocational (D4/D3)
 */
export function validateBpppRuleCompliance(choices: SnbtChoice[]): {
  isCompliant: boolean;
  message: string;
} {
  const count = choices.length;
  if (count === 0) {
    return { isCompliant: false, message: 'Belum ada pilihan prodi yang ditambahkan.' };
  }
  if (count > 4) {
    return { isCompliant: false, message: 'Maksimal pilihan prodi di SNBT adalah 4 prodi.' };
  }

  const s1Count = choices.filter((c) => c.degreeLevel === 'S1 (Sarjana)').length;
  const vocationalCount = choices.filter((c) => c.degreeLevel !== 'S1 (Sarjana)').length;

  if (count === 1) {
    return {
      isCompliant: true,
      message: 'Format 1 Pilihan Sah: Bebas memilih program studi S1, D4, atau D3.',
    };
  }

  if (count === 2) {
    return {
      isCompliant: true,
      message: 'Format 2 Pilihan Sah: Bebas memilih kombinasi 2 S1, 1 S1 + 1 Vokasi, atau 2 Vokasi.',
    };
  }

  if (count === 3) {
    if (s1Count > 2) {
      return {
        isCompliant: false,
        message: 'Aturan 3 Pilihan BPPP: Maksimal 2 program Sarjana (S1). Minimal harus ada 1 program Vokasi (D4 atau D3).',
      };
    }
    return {
      isCompliant: true,
      message: `Format 3 Pilihan Sah: ${s1Count} Sarjana (S1) + ${vocationalCount} Vokasi (D4/D3).`,
    };
  }

  if (count === 4) {
    if (s1Count > 2) {
      return {
        isCompliant: false,
        message: 'Aturan 4 Pilihan BPPP: Maksimal 2 program Sarjana (S1). Wajib menyertakan minimal 2 program Vokasi (D4 dan/atau D3).',
      };
    }
    if (vocationalCount < 2) {
      return {
        isCompliant: false,
        message: 'Aturan 4 Pilihan BPPP: Minimal harus ada 2 program Vokasi (D4 atau D3).',
      };
    }
    return {
      isCompliant: true,
      message: `Format 4 Pilihan Sah Sempurna: ${s1Count} Sarjana (S1) + ${vocationalCount} Vokasi (D4/D3).`,
    };
  }

  return { isCompliant: true, message: 'Format sah.' };
}

/**
 * Calculates probability and optimal order of choices
 */
export function evaluateSnbtStrategy(
  choices: SnbtChoice[],
  currentScore: number
): SnbtStrategyAssessment {
  const compliance = validateBpppRuleCompliance(choices);

  // Evaluate each choice probability
  const evaluated: ChoiceProbability[] = choices.map((c) => {
    const isVokasi = c.degreeLevel !== 'S1 (Sarjana)';
    const delta = currentScore - c.safeScoreThreshold;
    const competitivenessRatio = c.quota / (c.applicantsLastYear || 1);

    // Realistic probability calculation curve
    let prob = 50 + delta * 0.45; // every 10 points above threshold adds ~4.5%
    if (competitivenessRatio < 0.05) {
      prob -= 5; // very tight competition penalty
    }

    prob = Math.max(10, Math.min(96, Math.round(prob)));

    let statusZone: ChoiceProbability['statusZone'] = 'Kompetitif / Realistis';
    if (prob >= 80) statusZone = 'Sangat Aman';
    else if (prob >= 65) statusZone = 'Kompetitif / Realistis';
    else if (prob >= 45) statusZone = 'Cukup Ketat';
    else statusZone = 'Ambisius / Spekulatif';

    return {
      choiceId: c.id,
      choice: c,
      calculatedProbability: prob,
      statusZone,
      deltaVsScore: delta,
      isVocational: isVokasi,
      recommendedOrder: 0,
    };
  });

  // Sort by passing grade descending to determine optimal sequence
  // Choice 1: Highest threshold (dream/ambitious)
  // Choice 2: Medium-high
  // Choice 3: Safe
  // Choice 4: Lowest threshold (safety net)
  const sortedByDifficulty = [...evaluated].sort(
    (a, b) => b.choice.safeScoreThreshold - a.choice.safeScoreThreshold
  );

  sortedByDifficulty.forEach((item, idx) => {
    item.recommendedOrder = idx + 1;
  });

  // Check if current order violates descending difficulty principle
  let isOrderLogicallySound = true;
  let orderWarning: string | undefined = undefined;

  for (let i = 0; i < choices.length - 1; i++) {
    const current = choices[i];
    const next = choices[i + 1];

    if (current.safeScoreThreshold < next.safeScoreThreshold - 15) {
      isOrderLogicallySound = false;
      orderWarning = `Peringatan Urutan: Pilihan ${i + 1} (${current.majorName}, passing grade ${current.safeScoreThreshold}) lebih rendah dari Pilihan ${i + 2} (${next.majorName}, passing grade ${next.safeScoreThreshold}). Jika kamu lolos Pilihan ${i + 1}, Pilihan ${i + 2} tidak akan pernah diperiksa oleh sistem BPPP!`;
      break;
    }
  }

  let summary = '';
  if (evaluated.length === 0) {
    summary = 'Belum ada program studi yang dipilih.';
  } else if (!compliance.isCompliant) {
    summary = compliance.message;
  } else if (!isOrderLogicallySound) {
    summary = 'Urutan pilihan belum optimal. Pilihan dengan passing grade lebih tinggi harus diletakkan di pilihan atas.';
  } else {
    const highestProb = Math.max(...evaluated.map((e) => e.calculatedProbability));
    summary = `Strategi pilihan terstruktur dengan sangat baik. Peluang kelulusan kumulatif kamu di salah satu pilihan mencapai ~${Math.min(98, highestProb + 10)}%.`;
  }

  return {
    userCurrentScore: currentScore,
    choicesCount: choices.length,
    isRuleCompliant: compliance.isCompliant,
    ruleFeedback: compliance.message,
    isOrderLogicallySound,
    orderWarning,
    evaluatedChoices: evaluated,
    recommendationSummary: summary,
  };
}
