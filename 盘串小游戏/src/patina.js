/**
 * Deliberately expressive game ageing, not a promise about real objects.
 * The original photograph stays intact: apply `filter` to its image element,
 * then mask a separate multiply tone layer and a screen/reflection gloss layer.
 * Jade retains its original color; coconut shell stays dark brown/black.
 */

const PROFILES = {
  corn: {
    sepia: 0.42, saturation: 2.05, hue: -13, brightness: 0.97, contrast: 1.16,
    tones: ['#f4ce7b', '#e7b14c', '#d79035', '#c57b31'],
    tone: 0.32, gloss: 0.39,
  },
  gourd: {
    sepia: 0.48, saturation: 1.80, hue: -18, brightness: 0.88, contrast: 1.18,
    tones: ['#edbd72', '#dc9450', '#c66739', '#b44729'],
    tone: 0.36, gloss: 0.44,
  },
  walnut: {
    sepia: 0.30, saturation: 2.10, hue: -19, brightness: 0.96, contrast: 1.18,
    tones: ['#d7a070', '#c67e4f', '#b65534', '#a83e29'],
    tone: 0.34, gloss: 0.44,
  },
  zitan: {
    sepia: 0.08, saturation: 1.46, hue: 3, brightness: 0.82, contrast: 1.15,
    tones: ['#a1736e', '#835665', '#694154', '#512b49'],
    tone: 0.26, gloss: 0.49,
  },
  huanghuali: {
    sepia: 0.34, saturation: 1.92, hue: -18, brightness: 0.96, contrast: 1.18,
    tones: ['#dba268', '#cd8951', '#bd693d', '#a64b30'],
    tone: 0.31, gloss: 0.43,
  },
  sandalwood: {
    sepia: 0.40, saturation: 1.62, hue: -10, brightness: 0.95, contrast: 1.14,
    tones: ['#e2c38e', '#d5ad6d', '#c4904e', '#ac703b'],
    tone: 0.29, gloss: 0.37,
  },
  xingyue: {
    sepia: 0.72, saturation: 2.42, hue: -24, brightness: 0.94, contrast: 1.13,
    tones: ['#f3d68e', '#e5b25e', '#d0873f', '#b85c31'],
    tone: 0.43, gloss: 0.44,
  },
  jingang: {
    sepia: 0.33, saturation: 2.20, hue: -21, brightness: 0.94, contrast: 1.20,
    tones: ['#cf9764', '#bd7048', '#ac4b31', '#963324'],
    tone: 0.35, gloss: 0.46,
  },
  zijinshu: {
    sepia: 0.20, saturation: 1.92, hue: -16, brightness: 0.97, contrast: 1.17,
    tones: ['#b48a62', '#a96e4b', '#9b5338', '#8f3e2d'],
    tone: 0.28, gloss: 0.47,
  },
  yedi: {
    sepia: 0, saturation: 0.92, hue: 0, brightness: 0.84, contrast: 1.16,
    tones: ['#908375', '#7d6c5d', '#645349', '#493b34'],
    tone: 0.15, gloss: 0.48,
  },
  hetian: {
    sepia: 0, saturation: 1, hue: 0, brightness: 1.035, contrast: 1.09,
    // No tint: the milestones represent care and companionship, not mineral change.
    tones: ['#e8efe1', '#e8efe1', '#e8efe1', '#e8efe1'],
    tone: 0, gloss: 0.48,
  },
  olive: {
    sepia: 0.33, saturation: 2.06, hue: -20, brightness: 0.95, contrast: 1.18,
    tones: ['#d49e6d', '#c37d4e', '#b35d38', '#a2462c'],
    tone: 0.33, gloss: 0.44,
  },
};

const INTENSITY = [0, 0.23, 0.49, 0.75, 1];
const TONE_INTENSITY = [0, 0.25, 0.51, 0.76, 1];
const GLOSS_INTENSITY = [0, 0.21, 0.43, 0.70, 1];
const fixed = value => Number(value.toFixed(3));

/** @returns {{filter:string,toneColor:string,toneOpacity:number,glossOpacity:number}} */
export function getPatinaAppearance(id, stage = 0) {
  const profile = Object.hasOwn(PROFILES, id) ? PROFILES[id] : PROFILES.gourd;
  const numericStage = Number(stage);
  const index = Number.isFinite(numericStage) ? Math.max(0, Math.min(4, Math.floor(numericStage))) : 0;
  if (index === 0) return { filter: 'none', toneColor: profile.tones[0], toneOpacity: 0, glossOpacity: 0 };
  const p = INTENSITY[index];
  const filter = [
    `sepia(${fixed(profile.sepia * p)})`,
    `saturate(${fixed(1 + (profile.saturation - 1) * p)})`,
    `hue-rotate(${fixed(profile.hue * p)}deg)`,
    `brightness(${fixed(1 + (profile.brightness - 1) * p)})`,
    `contrast(${fixed(1 + (profile.contrast - 1) * p)})`,
  ].join(' ');
  return {
    filter,
    toneColor: profile.tones[index - 1],
    toneOpacity: fixed(profile.tone * TONE_INTENSITY[index]),
    glossOpacity: fixed(profile.gloss * GLOSS_INTENSITY[index]),
  };
}
