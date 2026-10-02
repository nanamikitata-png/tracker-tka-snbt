export interface YtbDocRequirement {
  id: string;
  category: 'Wajib Utama' | 'Sangat Direkomendasikan' | 'Pendukung Khusus';
  name: string;
  description: string;
  format: string;
  tips: string;
}

export interface UniversityCluster {
  tier: string;
  categoryTitle: string;
  ruleExplanation: string;
  universities: {
    name: string;
    city: string;
    isTopThreeCities: boolean;
    recommendedMajors: string[];
    languageOfInstruction: string;
    acceptanceRateNotes: string;
  }[];
}

export interface EssaySample {
  id: string;
  title: string;
  authorInfo: string;
  universityAdmitted: string;
  majorAdmitted: string;
  year: string;
  promptQuestion: string;
  contentEnglish: string;
  contentIndonesian: string;
  reviewerNotes: string[];
}

export const YTB_REQUIRED_DOCUMENTS: YtbDocRequirement[] = [
  {
    id: 'doc-rapor',
    category: 'Wajib Utama',
    name: 'Transkrip Nilai Rapor Semester 1 - 5',
    description: 'Nilai rapor kelas 10, 11, dan semester 1 kelas 12 dengan legalisir resmi kepala sekolah.',
    format: 'PDF (Asli + Terjemahan Bahasa Inggris/Turki Tersumpah)',
    tips: 'Pastikan nilai mata pelajaran inti (Matematika, IPA/IPS) minimal 75-80 (skala 100), atau minimal 90 untuk Kedokteran/Farmasi.',
  },
  {
    id: 'doc-surat-aktif',
    category: 'Wajib Utama',
    name: 'Surat Keterangan Siswa Aktif / Ijazah Sementara',
    description: 'Surat resmi dari sekolah yang menerangkan bahwa Anda adalah siswa aktif kelas 12 yang akan lulus tahun 2027.',
    format: 'PDF (Dilengkapi kop surat sekolah, cap basah, dan terjemahan resmi)',
    tips: 'Sertakan estimasi tanggal kelulusan resmi sekolah.',
  },
  {
    id: 'doc-paspor',
    category: 'Wajib Utama',
    name: 'Paspor Internasional yang Masih Berlaku',
    description: 'Halaman identitas paspor WNI yang masih berlaku minimal 1.5 hingga 2 tahun ke depan.',
    format: 'PDF / JPG kualitas tinggi',
    tips: 'Jika belum memiliki paspor saat mendaftar, KTP asli masih diterima di sistem TBBS, namun sangat disarankan segera membuat paspor sebelum tahap wawancara.',
  },
  {
    id: 'doc-foto',
    category: 'Wajib Utama',
    name: 'Pasfoto Biometrik Format Resmi ICAO',
    description: 'Foto formal terbaru latar belakang putih polos, wajah menghadap lurus ke kamera.',
    format: 'JPG/PNG ukuran 5x5 cm / rasio paspor',
    tips: 'Gunakan pakaian rapi berkerah, tanpa kacamata gelap, pencahayaan merata.',
  },
  {
    id: 'doc-lor',
    category: 'Wajib Utama',
    name: '2 Surat Rekomendasi Akademik (Letter of Recommendation - LoR)',
    description: 'Surat rekomendasi dari guru akademik SMA (misal: Guru Matematika, Fisika, atau Wali Kelas).',
    format: 'PDF bertanda tangan basah guru + stempel sekolah',
    tips: 'Wajib mencantumkan nomor telepon resmi, email resmi guru, dan gelar akademik guru. Pihak YTB Ankara terkadang melakukan verifikasi acak via email.',
  },
  {
    id: 'doc-sertif-bahasa',
    category: 'Sangat Direkomendasikan',
    name: 'Sertifikat Kemampuan Bahasa (TOEFL iBT / IELTS / DET / TÖMER)',
    description: 'Bukti kemahiran bahasa jika memilih program studi yang berpengantar 100% Bahasa Inggris.',
    format: 'PDF Sertifikat Resmi',
    tips: 'Jika Anda memilih prodi berbahasa Turki, sertifikat bahasa tidak wajib karena YTB menyediakan kursus bahasa Turki (TÖMER) gratis selama 1 tahun penuh di Turki!',
  },
  {
    id: 'doc-prestasi',
    category: 'Sangat Direkomendasikan',
    name: 'Sertifikat Prestasi Olimpiade, Lomba & Karya Ilmiah',
    description: 'Sertifikat juara olimpiade sains (OSN), debat, karya tulis ilmiah (KIR), atau kompetisi internasional/nasional.',
    format: 'PDF',
    tips: 'Unggah sertifikat dari jenjang SMA (3 tahun terakhir). Prestasi di tingkat provinsi/nasional memberi bobot poin sangat tinggi.',
  },
  {
    id: 'doc-volunteering',
    category: 'Pendukung Khusus',
    name: 'Sertifikat Kegiatan Sosial, Kepemimpinan & Organisasi',
    description: 'Bukti keaktifan di OSIS, MPK, Pramuka, kegiatan relawan sosial, atau organisasi kepemudaan.',
    format: 'PDF',
    tips: 'Menunjukkan bahwa Anda bukan hanya unggul akademis, melainkan memiliki jiwa kepemimpinan dan kepekaan sosial tinggi.',
  },
];

export const YTB_UNIVERSITY_CLUSTERS: UniversityCluster[] = [
  {
    tier: 'Tier 1 - Kampus Elit Global',
    categoryTitle: 'Universitas Riset Peringkat Teratas (Sangat Selektif)',
    ruleExplanation: 'Maksimal disarankan memilih 2-3 universitas dari kelompok ini agar peluang kelulusan tetap aman.',
    universities: [
      {
        name: 'Boğaziçi Üniversitesi',
        city: 'Istanbul',
        isTopThreeCities: true,
        recommendedMajors: ['Industrial Engineering', 'Computer Engineering', 'Economics', 'Molecular Biology'],
        languageOfInstruction: '100% Bahasa Inggris',
        acceptanceRateNotes: 'Paling bergengsi di Turki. Nilai rapor > 90 dan LoI sangat tajam wajib dimiliki.',
      },
      {
        name: 'Middle East Technical University (METU / ODTÜ)',
        city: 'Ankara',
        isTopThreeCities: true,
        recommendedMajors: ['Mechanical Engineering', 'Electrical-Electronics', 'Aerospace', 'Civil Eng'],
        languageOfInstruction: '100% Bahasa Inggris',
        acceptanceRateNotes: 'Kampus teknik nomor 1 di Timur Tengah. Kuat di bidang teknik dan teknologi luar angkasa.',
      },
      {
        name: 'Istanbul Technical University (İTÜ)',
        city: 'Istanbul',
        isTopThreeCities: true,
        recommendedMajors: ['Naval Architecture', 'Chemical Engineering', 'Architecture', 'AI Engineering'],
        languageOfInstruction: 'Bahasa Inggris & Turki (Campuran)',
        acceptanceRateNotes: 'Salah satu universitas teknik tertua di dunia dengan koneksi industri industri pertahanan Turki.',
      },
      {
        name: 'Hacettepe Üniversitesi',
        city: 'Ankara',
        isTopThreeCities: true,
        recommendedMajors: ['Medicine (Kedokteran)', 'Pharmacy (Farmasi)', 'Dentistry', 'Bioengineering'],
        languageOfInstruction: 'Bahasa Inggris / Turki',
        acceptanceRateNotes: 'Raja sekolah kedokteran dan riset sains biomedis di Turki.',
      },
    ],
  },
  {
    tier: 'Tier 2 - Universitas Negeri Besar & Populer',
    categoryTitle: 'Pusat Akademik Terkemuka di Kota Utama',
    ruleExplanation: 'Pilihan seimbang dengan reputasi nasional tinggi dan kuota penerimaan mahasiswa internasional yang cukup besar.',
    universities: [
      {
        name: 'Istanbul Üniversitesi',
        city: 'Istanbul',
        isTopThreeCities: true,
        recommendedMajors: ['International Relations', 'Business Administration', 'Law', 'Literature'],
        languageOfInstruction: 'Bahasa Turki & Inggris',
        acceptanceRateNotes: 'Kampus bersejarah tertua dengan alumni tokoh-tokoh negara Turki.',
      },
      {
        name: 'Ankara Üniversitesi',
        city: 'Ankara',
        isTopThreeCities: true,
        recommendedMajors: ['Political Sciences (Mülkiye)', 'Biotechnology', 'Veterinary', 'Physics'],
        languageOfInstruction: 'Bahasa Turki & Inggris',
        acceptanceRateNotes: 'Sangat kuat dalam bidang sains murni dan studi diplomasi internasional.',
      },
      {
        name: 'Yıldız Technical University (YTÜ)',
        city: 'Istanbul',
        isTopThreeCities: true,
        recommendedMajors: ['Computer Science', 'Mechatronics Engineering', 'Civil Engineering'],
        languageOfInstruction: 'Bahasa Inggris & Turki',
        acceptanceRateNotes: 'Fasilitas teknopark sangat maju di jantung kota Istanbul.',
      },
      {
        name: 'Ege Üniversitesi',
        city: 'Izmir',
        isTopThreeCities: true,
        recommendedMajors: ['Food Engineering', 'Biomedical Engineering', 'Medicine'],
        languageOfInstruction: 'Bahasa Turki',
        acceptanceRateNotes: 'Kampus pesisir barat yang modern dengan riset agrikultur dan bioteknologi maju.',
      },
    ],
  },
  {
    tier: 'Tier 3 - Kampus Kunci Lolos Luar 3 Kota Besar (Wajib Ada di TBBS!)',
    categoryTitle: 'Universitas Berkualitas Tinggi di Luar Istanbul, Ankara & Izmir',
    ruleExplanation: 'ATURAN RESMI YTB: Minimal 1/3 pilihan HARUS di luar 3 kota besar! Menempatkan kampus kelompok ini menjamin aplikasi Anda tidak ditolak otomatis.',
    universities: [
      {
        name: 'Bursa Uludağ Üniversitesi',
        city: 'Bursa',
        isTopThreeCities: false,
        recommendedMajors: ['Automotive Engineering', 'Industrial Engineering', 'Textile Eng'],
        languageOfInstruction: 'Bahasa Turki',
        acceptanceRateNotes: 'Pusat industri manufaktur & otomotif nomor 1 Turki. Peluang diterima tinggi.',
      },
      {
        name: 'Anadolu Üniversitesi & Eskişehir Osmangazi',
        city: 'Eskişehir',
        isTopThreeCities: false,
        recommendedMajors: ['Aviation & Aerospace', 'Materials Science', 'Communication'],
        languageOfInstruction: 'Bahasa Turki & Inggris',
        acceptanceRateNotes: 'Kota pelajar terbaik di Turki (sangat aman, ramah mahasiswa, dan biaya hidup hemat).',
      },
      {
        name: 'Selçuk Üniversitesi',
        city: 'Konya',
        isTopThreeCities: false,
        recommendedMajors: ['Computer Engineering', 'Dentistry', 'Agricultural Technology'],
        languageOfInstruction: 'Bahasa Turki',
        acceptanceRateNotes: 'Kampus raksasa dengan fasilitas laboratorium lengkap dan kuota mahasiswa internasional ramah.',
      },
      {
        name: 'Akdeniz Üniversitesi',
        city: 'Antalya',
        isTopThreeCities: false,
        recommendedMajors: ['Medicine (Pionir Transplantasi Organ Dunia)', 'Tourism Management'],
        languageOfInstruction: 'Bahasa Turki',
        acceptanceRateNotes: 'Terkenal di dunia kedokteran transplantasi organ dan iklim mediterania yang indah.',
      },
    ],
  },
];

export const YTB_SAMPLE_ESSAYS: EssaySample[] = [
  {
    id: 'essay-industrial-eng',
    title: 'Letter of Intent: Industrial Engineering di Boğaziçi Üniversitesi',
    authorInfo: 'Awardee S1 Türkiye Bursları Asal Jawa Barat (Lolos Tahun 2024)',
    universityAdmitted: 'Boğaziçi Üniversitesi (Pilihan 1)',
    majorAdmitted: 'B.Sc. Industrial Engineering (100% English)',
    year: '2024',
    promptQuestion: 'Jelaskan alasan akademis memilih bidang studi ini, mengapa memilih Turki, dan rencana kontribusi pasca kelulusan.',
    contentEnglish: `Growing up in an industrial corridor in West Java, I witnessed firsthand how bottlenecks in supply chain management and manufacturing inefficiency hinder developing economies. In high school, my team represented our province in the National Science Project Olympiad, where we formulated an algorithmic route optimization model for emergency relief logistics. This formative research solidified my passion: to pursue Industrial Engineering as a tool for systematic transformation.

Turkey stands as the premier bridge between Asian logistics and European industrial standards, boasting cutting-edge manufacturing hubs and global trade networks. More specifically, Boğaziçi University’s Department of Industrial Engineering offers rigorous coursework in stochastic models and operations research, alongside the renowned Optimization and Financial Engineering Laboratory directed by faculty whose publications I have actively studied. 

Upon completing my undergraduate studies, I aim to return to Indonesia and contribute to the National Logistics Ecosystem initiative, while establishing joint supply-chain research partnerships between Indonesian transport bodies and Turkish industrial innovators. The Türkiye Bursları scholarship will not merely fund my education; it will provide the platform for me to become a bilateral catalyst in global industrial optimization.`,
    contentIndonesian: `Tumbuh di kawasan koridor industri di Jawa Barat membuat saya menyaksikan secara langsung bagaimana hambatan dalam manajemen rantai pasok dan ketidakefisienan manufaktur membebani perekonomian negara berkembang. Semasa SMA, tim saya mewakili provinsi dalam Olimpiade Penelitian Sains, di mana kami menyusun model optimasi rute algoritmik untuk logistik bantuan darurat. Penelitian tersebut memantapkan cita-cita saya: mendalami Teknik Industri sebagai instrumen transformasi sistemik.

Turki berdiri sebagai jembatan utama antara logistik Asia dan standar industri manufaktur Eropa, memiliki pusat-pusat perakitan mutakhir dan jaringan perdagangan global. Secara khusus, Departemen Teknik Industri di Boğaziçi Üniversitesi menawarkan kurikulum mendalam dalam model stokastik dan riset operasi, didukung oleh Optimization and Financial Engineering Laboratory terkemuka yang karya publikasi para profesornya telah saya pelajari secara aktif.

Setelah menyelesaikan studi sarjana, rencana konkret saya adalah kembali ke Indonesia dan berkontribusi dalam penguatan inisiatif Ekosistem Logistik Nasional, sembari membangun kemitraan riset rantai pasok bilateral antara otoritas transportasi Indonesia dan inovator industri Turki. Beasiswa Türkiye Bursları bukan sekadar mendanai perkuliahan saya, melainkan memberi panggung bagi saya untuk menjadi katalis hubungan bilateral dalam optimasi industri global.`,
    reviewerNotes: [
      'Menghubungkan masalah nyata di daerah asal dengan disiplin ilmu yang dipilih (Personal Hook kuat, bukan sekadar teori).',
      'Menyebutkan nama laboratorium riset spesifik di Boğaziçi Üniversitesi, membuktikan pelamar melakukan riset mendalam sebelum mendaftar.',
      'Rencana pasca studi sangat realistis dan konkret (relevan untuk kedua negara: Indonesia dan Turki).',
    ],
  },
  {
    id: 'essay-computer-eng',
    title: 'Letter of Intent: Computer Engineering di Middle East Technical University (METU)',
    authorInfo: 'Awardee S1 Türkiye Bursları Asal DKI Jakarta (Lolos Tahun 2025)',
    universityAdmitted: 'Middle East Technical University / ODTÜ (Pilihan 1)',
    majorAdmitted: 'B.Sc. Computer Engineering (100% English)',
    year: '2025',
    promptQuestion: 'Jelaskan latar belakang akademis Anda, mengapa memilih METU di Turki, dan apa visi Anda.',
    contentEnglish: `My fascination with computing ignited when I competed in the National Olympiad in Informatics (OSN), solving complex dynamic programming puzzles under strict memory bounds. Through this, I realized that algorithms are not just lines of code—they are structural blueprints capable of solving public sector vulnerabilities, such as cybersecurity in decentralized registries.

Middle East Technical University (METU) in Ankara has pioneered computer engineering education in the region, hosting the ModSimmer Modeling and Simulation Research Center and an elite technopark that interfaces directly with leading cyberdefense initiatives. Learning under the mentorship of METU’s world-class faculty will empower me with rigorous mathematical foundations in distributed systems and artificial intelligence.

After graduation, I envision contributing to bilateral cybersecurity protocols and AI research frameworks connecting Southeast Asian tech ecosystems with Turkey’s emerging digital defense corridor. Türkiye Bursları is the definitive bridge that will enable me to master this discipline at the highest academic echelon.`,
    contentIndonesian: `Kecintaan saya pada ilmu komputer berawal saat saya berkompetisi dalam Olimpiade Sains Nasional (OSN) bidang Informatika, di mana saya memecahkan teka-teki pemrograman dinamis yang kompleks di bawah batasan memori yang ketat. Melalui proses ini, saya menyadari bahwa algoritma bukan sekadar baris kode, melainkan cetak biru struktural yang mampu mengatasi kerentanan sektor publik, seperti keamanan siber dalam sistem terdesentralisasi.

Middle East Technical University (METU) di Ankara telah mempelopori pendidikan teknik komputer di kawasan ini, menaungi Pusat Riset Pemodelan dan Simulasi (ModSimmer) serta kawasan teknopark elit yang terhubung langsung dengan inisiatif pertahanan siber terdepan. Belajar di bawah bimbingan para pengajar kelas dunia METU akan membekali saya dengan landasan matematika yang kuat dalam sistem terdistribusi dan kecerdasan buatan.

Pasca kelulusan, visi saya adalah berkontribusi pada pengembangan protokol keamanan siber bilateral dan kerangka riset AI yang menghubungkan ekosistem teknologi Asia Tenggara dengan koridor pertahanan digital Turki. Türkiye Bursları adalah jembatan definitif yang akan memampukan saya menguasai disiplin ilmu ini di tingkat akademik tertinggi.`,
    reviewerNotes: [
      'Menonjolkan prestasi konkret di tingkat nasional (OSN Informatika) sebagai bukti kapabilitas belajar tinggi.',
      'Sangat jelas menjelaskan mengapa harus METU (fasilitas ModSimmer dan technopark Ankara).',
      'Gaya penulisan akademis tegas, percaya diri, tanpa kalimat berbunga-bunga yang tidak perlu.',
    ],
  },
];

// Calculation of acceptance probability based on user's GPA, certs, and city rule compliance
export function calculateYtbProbability(
  gpa: number, // 0 - 100
  isEnglishCertAvailable: boolean,
  isAwardAvailable: boolean,
  hasLoIReady: boolean,
  cityRuleCompliant: boolean,
  targetCluster: string
): {
  averageGpa: number;
  probabilityScore: number;
  zone: 'Sangat Tinggi (Peluang Unggulan)' | 'Kompetitif & Siap Bersaing' | 'Cukup (Perlu Booster Portofolio)' | 'Zona Rawan / Di Bawah Standar';
  breakdownInsights: string[];
  recommendations: string[];
  cityRuleCompliant: boolean;
} {
  let score = 0;
  const insights: string[] = [];
  const recs: string[] = [];

  const isMedical = targetCluster.toLowerCase().includes('kedokteran');
  const minGpaRequired = isMedical ? 90 : 70;

  // 1. GPA Weight (Max 55 points)
  if (gpa >= 92) {
    score += 55;
    insights.push(`Nilai rata-rata rapor (${gpa.toFixed(1)}) berada di persentil teratas pelamar internasional.`);
  } else if (gpa >= 88) {
    score += 48;
    insights.push(`Nilai rata-rata rapor (${gpa.toFixed(1)}) sangat kompetitif untuk prodi teknik dan sains.`);
  } else if (gpa >= 82) {
    score += 40;
    insights.push(`Nilai rata-rata rapor (${gpa.toFixed(1)}) memenuhi standar umum seleksi sarjana YTB.`);
  } else if (gpa >= minGpaRequired) {
    score += 30;
    insights.push(`Nilai rata-rata rapor (${gpa.toFixed(1)}) memenuhi batas minimal (${minGpaRequired}), namun berada di zona persaingan ketat.`);
    recs.push('Tingkatkan nilai rapor semester 5 dan kuatkan esai Letter of Intent untuk mengimbangi nilai rapor.');
  } else {
    score += 15;
    insights.push(`Nilai rapor (${gpa.toFixed(1)}) berada di bawah ambang batas ideal (${minGpaRequired}) untuk klaster ini.`);
    recs.push(`Perhatian: Ambang batas minimal resmi YTB adalah 70 untuk S1 umum dan 90 untuk Kedokteran.`);
  }

  // 2. Language Certification (Max 15 points)
  if (isEnglishCertAvailable) {
    score += 15;
    insights.push('Sertifikat bahasa internasional resmi telah tersedia (nilai tambah besar untuk prodi 100% English).');
  } else {
    score += 5;
    recs.push('Jika memilih program studi 100% Bahasa Inggris, siapkan sertifikat TOEFL iBT/IELTS/DET agar tidak gugur di verifikasi bahasa.');
  }

  // 3. Academic Awards & Olympiad (Max 15 points)
  if (isAwardAvailable) {
    score += 15;
    insights.push('Portofolio sertifikat prestasi / kejuaraan tingkat kota/provinsi/nasional sangat memperkuat profil pelamar.');
  } else {
    score += 5;
    recs.push('Sertakan sertifikat kegiatan ekstrakurikuler, kepemimpinan, atau proyek ilmiah SMA untuk mendongkrak profil.');
  }

  // 4. Letter of Intent / Essay (Max 15 points)
  if (hasLoIReady) {
    score += 15;
    insights.push('Draft Letter of Intent sudah dipersiapkan secara terstruktur.');
  } else {
    score += 5;
    recs.push('Segera selesaikan draf Letter of Intent 2-3 halaman sesuai panduan struktur 4 bagian.');
  }

  // 5. City Selection Compliance Penalty
  if (!cityRuleCompliant) {
    score = Math.max(25, score - 20);
    insights.push('PERINGATAN: Memilih hanya kampus di Istanbul/Ankara/Izmir tanpa kampus luar 3 kota besar berisiko terkena penalti kuota YTB.');
    recs.push('Wajib tambahkan minimal 2-3 pilihan kampus di kota seperti Bursa, Eskişehir, atau Konya sesuai ketentuan resmi TBBS.');
  }

  const finalProb = Math.min(96, Math.max(20, Math.round(score)));

  let zone: 'Sangat Tinggi (Peluang Unggulan)' | 'Kompetitif & Siap Bersaing' | 'Cukup (Perlu Booster Portofolio)' | 'Zona Rawan / Di Bawah Standar';
  if (finalProb >= 85) {
    zone = 'Sangat Tinggi (Peluang Unggulan)';
  } else if (finalProb >= 72) {
    zone = 'Kompetitif & Siap Bersaing';
  } else if (finalProb >= 55) {
    zone = 'Cukup (Perlu Booster Portofolio)';
  } else {
    zone = 'Zona Rawan / Di Bawah Standar';
  }

  return {
    averageGpa: +gpa.toFixed(1),
    probabilityScore: finalProb,
    zone,
    breakdownInsights: insights,
    recommendations: recs,
    cityRuleCompliant,
  };
}
