import { PaletteTheme } from '../types';

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Lighten or darken color
export function adjustLightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, r * factor));
  const newG = Math.min(255, Math.max(0, g * factor));
  const newB = Math.min(255, Math.max(0, b * factor));
  return rgbToHex(newR, newG, newB);
}

// Check luminance to ensure readability
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Extract dominant and accent colors from an HTML Image or Canvas
export async function extractPaletteFromImage(
  imageSrc: string,
  themeName: string = 'Kustom Kampus'
): Promise<PaletteTheme> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // Downscale to 80x80 for speed and noise reduction
        const width = 80;
        const height = 80;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const colorBuckets: { [key: string]: { r: number; g: number; b: number; count: number; sat: number } } = {};

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue; // skip transparent

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const lightness = (max + min) / 510;
          const saturation = max === 0 ? 0 : delta / max;

          // Filter out pure white, pure black, and washed-out greys for theme primaries
          if (lightness > 0.92 || lightness < 0.08 || (saturation < 0.15 && (lightness > 0.8 || lightness < 0.2))) {
            continue;
          }

          // Quantize color into buckets
          const qR = Math.round(r / 24) * 24;
          const qG = Math.round(g / 24) * 24;
          const qB = Math.round(b / 24) * 24;
          const key = `${qR}-${qG}-${qB}`;

          if (!colorBuckets[key]) {
            colorBuckets[key] = { r: qR, g: qG, b: qB, count: 0, sat: saturation };
          }
          colorBuckets[key].count++;
        }

        const sortedColors = Object.values(colorBuckets).sort((a, b) => b.count - a.count);

        if (sortedColors.length === 0) {
          // Fallback to sophisticated Boğaziçi Navy
          resolve(getDefaultTheme());
          return;
        }

        // Primary: Most dominant color with good character
        const primaryRaw = sortedColors[0];
        let primaryHex = rgbToHex(primaryRaw.r, primaryRaw.g, primaryRaw.b);

        // Find an accent color that differs noticeably in hue or lightness
        let accentRaw = sortedColors.find(c => {
          const diffR = Math.abs(c.r - primaryRaw.r);
          const diffG = Math.abs(c.g - primaryRaw.g);
          const diffB = Math.abs(c.b - primaryRaw.b);
          return (diffR + diffG + diffB) > 100 && c.sat > 0.25;
        }) || sortedColors[Math.min(1, sortedColors.length - 1)];

        let accentHex = rgbToHex(accentRaw.r, accentRaw.g, accentRaw.b);

        // If accent is too similar to primary, calculate a complementary shift
        if (primaryHex === accentHex) {
          const { r, g, b } = hexToRgb(primaryHex);
          accentHex = rgbToHex(Math.min(255, b + 40), Math.min(255, r + 20), Math.max(0, g - 20));
        }

        // Ensure primary has appropriate contrast for UI usage
        const pRgb = hexToRgb(primaryHex);
        const pLum = getLuminance(pRgb.r, pRgb.g, pRgb.b);
        if (pLum > 0.6) {
          primaryHex = adjustLightness(primaryHex, -25);
        } else if (pLum < 0.05) {
          primaryHex = adjustLightness(primaryHex, 30);
        }

        const primaryLight = adjustLightness(primaryHex, 35);
        const primaryDark = adjustLightness(primaryHex, -25);
        const accentLight = adjustLightness(accentHex, 30);
        const bgTint = adjustLightness(primaryHex, 85);

        const theme: PaletteTheme = {
          id: `custom-${Date.now()}`,
          name: themeName,
          sourceName: 'Gambar Pilihan Kamu',
          primary: primaryHex,
          primaryLight,
          primaryDark,
          accent: accentHex,
          accentLight,
          bgTint,
          surface: '#ffffff',
          imageUrl: imageSrc,
          isCustom: true
        };

        resolve(theme);
      } catch (err) {
        console.error('Error extracting colors:', err);
        resolve(getDefaultTheme());
      }
    };

    img.onerror = () => {
      resolve(getDefaultTheme());
    };

    img.src = imageSrc;
  });
}

export function getDefaultTheme(): PaletteTheme {
  return {
    id: 'theme-bogazici',
    name: 'Boğaziçi Prestij Blue',
    sourceName: 'Boğaziçi Üniversitesi (Istanbul)',
    primary: '#1d4ed8',        // Blue-700
    primaryLight: '#60a5fa',   // Blue-400
    primaryDark: '#1e3a8a',    // Blue-900
    accent: '#d97706',         // Warm Amber/Gold
    accentLight: '#fde68a',    // Amber-200
    bgTint: '#eff6ff',         // Blue-50
    surface: '#ffffff',
    imageUrl: '/src/assets/images/bogazici_campus_view_1790936999569.jpg',
    isCustom: false
  };
}

// Apply theme to CSS Root variables
export function applyThemeToCss(theme: PaletteTheme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-light', theme.primaryLight);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-light', theme.accentLight);
  root.style.setProperty('--bg-tint', theme.bgTint);
}
