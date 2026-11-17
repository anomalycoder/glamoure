export interface BgConfig {
  offsetY: number; // in pixels (default shifted up!)
  offsetX: number; // in pixels
  scale: number; // in percentage (e.g. 108)
  objectPosY: number; // in % (default 36%)
  objectPosX: number; // in % (default 28%)
  darkness: number; // 0-100
  blur: number; // in pixels
}

export interface ContainerConfig {
  x: number;
  y: number;
  maxWidth: number; // in pixels
  align: 'left' | 'center' | 'right';
  backdropBlur: number; // in pixels (optional card styling)
  backdropBg: string; // e.g. transparent or rgba(20,18,16,0.5)
  borderRadius: number;
  padding: number;
}

export interface LogoConfig {
  text: string;
  subtitle: string;
  fontFamily: string;
  subtitleFont: string;
  fontSize: number;
  subtitleSize: number;
  fontWeight: number;
  subtitleWeight: number;
  letterSpacing: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface NavConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  color: string;
  gap: number;
  link1: string;
  link2: string;
  link3: string;
  link4: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface HeaderBtnConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  borderColor: string;
  bgColor: string;
  borderRadius: number;
  x: number;
  y: number;
  visible: boolean;
}

export interface HeadlineLine1Config {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;
  lineHeight: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface HeadlineLine2Config {
  textPrefix: string;
  textHighlight: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  color: string;
  highlightColor: string;
  highlightItalic: boolean;
  x: number;
  y: number;
  visible: boolean;
}

export interface SubheaderConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface ButtonConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  color: string;
  bgColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  shadow: boolean;
  x: number;
  y: number;
  visible: boolean;
}

export interface FlourishConfig {
  enabled: boolean;
  scriptFont: string; // e.g. "'Pinyon Script', cursive"
  scale: number; // e.g. 1.38
  offsetY: number; // e.g. 0
  color: string; // e.g. ""
}

export interface ServicesStripConfig {
  visible: boolean;
  item1Text: string;
  item2Text: string;
  item3Text: string;
  item4Text: string;
  fontFamily: string;
  iconColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  dividerOpacity: number;
  x: number;
  y: number;
}

export interface HeroDesignConfig {
  bg: BgConfig;
  container: ContainerConfig;
  logo: LogoConfig;
  nav: NavConfig;
  headerBtn: HeaderBtnConfig;
  headlineLine1: HeadlineLine1Config;
  headlineLine2: HeadlineLine2Config;
  subheader: SubheaderConfig;
  primaryBtn: ButtonConfig;
  secondaryBtn: ButtonConfig;
  servicesStrip: ServicesStripConfig;
  flourish: FlourishConfig;
}

export const DEFAULT_HERO_CONFIG: HeroDesignConfig = {
  bg: {
    offsetY: 0,
    offsetX: 0,
    scale: 100,
    objectPosY: 50,
    objectPosX: 50,
    darkness: 0,
    blur: 0,
  },
  container: {
    x: 0,
    y: 0,
    maxWidth: 580,
    align: 'right',
    backdropBlur: 0,
    backdropBg: 'transparent',
    borderRadius: 0,
    padding: 0,
  },
  logo: {
    text: 'GLAMOURÉ',
    subtitle: 'SALON & STUDIO',
    fontFamily: "'Montserrat', sans-serif",
    subtitleFont: "'Plus Jakarta Sans', sans-serif",
    fontSize: 24,
    subtitleSize: 8.5,
    fontWeight: 300,
    subtitleWeight: 500,
    letterSpacing: 4.5,
    color: '#ffffff',
    x: 0,
    y: 0,
    visible: true,
  },
  nav: {
    link1: 'Services',
    link2: 'Stylists',
    link3: 'About',
    link4: 'Contact',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 400, // Light and elegant feel
    letterSpacing: 2.2,
    color: '#e8ded2',
    gap: 48,
    x: -35,
    y: -25,
    visible: true,
  },
  headerBtn: {
    text: 'Book Appointment',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 400,
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    bgColor: 'transparent',
    borderRadius: 9999,
    x: 0,
    y: 0,
    visible: true,
  },
  headlineLine1: {
    text: '{W}HERE BEAUTY MEETS',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 45,
    fontWeight: 300,
    fontStyle: 'normal',
    letterSpacing: 4.5,
    lineHeight: 1.08,
    color: '#ffffff',
    x: 0,
    y: 0,
    visible: true,
  },
  headlineLine2: {
    textPrefix: 'TIMELESS ',
    textHighlight: '{E}LEGANCE.',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 45,
    fontWeight: 300,
    letterSpacing: 4.5,
    lineHeight: 1.08,
    color: '#ffffff',
    highlightColor: '#efc9a5',
    highlightItalic: false,
    x: 28,
    y: -32,
    visible: true,
  },
  subheader: {
    text: "A PERSONALIZED LUXURY SALON EXPERIENCE CRAFTED TO ELEVATE TIMELESS ELEGANCE.",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 400,
    letterSpacing: 2.2,
    lineHeight: 1.75,
    color: 'rgba(222, 211, 199, 0.85)',
    x: 0,
    y: 0,
    visible: true,
  },
  primaryBtn: {
    text: 'Book Appointment',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: '#241812',
    bgColor: '#efc9a5',
    borderRadius: 9999,
    paddingX: 28,
    paddingY: 14,
    shadow: true,
    x: 0,
    y: 0,
    visible: false, // Removed buttons from hero section per user instruction
  },
  secondaryBtn: {
    text: 'Explore Services',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    bgColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 9999,
    paddingX: 28,
    paddingY: 14,
    shadow: false,
    x: 0,
    y: 0,
    visible: false, // Removed buttons from hero section per user instruction
  },
  servicesStrip: {
    visible: true, // Displayed down on the right below the subtext
    item1Text: 'Hair',
    item2Text: 'Skin',
    item3Text: 'Nails',
    item4Text: 'Spa & Wellness',
    fontFamily: "'Montserrat', sans-serif",
    iconColor: '#e7c19a',
    textColor: 'rgba(222, 211, 199, 0.9)',
    fontSize: 12.5,
    fontWeight: 500,
    dividerOpacity: 20,
    x: 127,
    y: 78,
  },
  flourish: {
    enabled: true,
    scriptFont: "'Alex Brush', cursive",
    scale: 1.40,
    offsetY: 0,
    color: '',
  },
};

export const SCRIPT_FONT_OPTIONS = [
  { label: 'Pinyon Script (Classic Swash & Calligraphy - Recommended)', value: "'Pinyon Script', cursive" },
  { label: 'Alex Brush (Flowing Graceful Swashes)', value: "'Alex Brush', cursive" },
  { label: 'Great Vibes (Sweeping Loops & Curves)', value: "'Great Vibes', cursive" },
  { label: 'Cinzel Decorative (Flourished Roman Capitals)', value: "'Cinzel Decorative', serif" },
  { label: 'Bodoni Moda Italic (High-Contrast Didone Italic)', value: "'Bodoni Moda', serif" },
  { label: 'Playfair Display Italic (Couture Editorial Italic)', value: "'Playfair Display', serif" },
];

export const FONT_OPTIONS = [
  // User's Requested Dual-Font Combination
  { label: 'Josefin Sans (Thin Elegant Sans - As in Photo)', value: "'Josefin Sans', sans-serif" },
  { label: 'Pinyon Script (Decorative Swash Script - As in Photo)', value: "'Pinyon Script', cursive" },
  { label: 'Montserrat Light (Minimalist Luxury Sans)', value: "'Montserrat', sans-serif" },
  { label: 'Alex Brush (Calligraphic Flourish Script)', value: "'Alex Brush', cursive" },

  // Typography Suite Pairs
  { label: 'Bodoni Moda (Modern Luxury Serif)', value: "'Bodoni Moda', serif" },
  { label: 'Manrope (Clean Geometric Sans)', value: "'Manrope', sans-serif" },
  { label: 'Cormorant Garamond (Soft Elegant Serif)', value: "'Cormorant Garamond', serif" },
  { label: 'DM Sans (Minimalist Modern Sans)', value: "'DM Sans', sans-serif" },
  { label: 'Libre Bodoni (Premium Editorial Serif)', value: "'Libre Bodoni', serif" },
  { label: 'Plus Jakarta Sans (Crisp Contemporary Sans)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Instrument Serif (Contemporary Luxury Serif)', value: "'Instrument Serif', serif" },
  { label: 'Inter (Neutral Balanced Sans)', value: "'Inter', sans-serif" },
  { label: 'DM Serif Display (Warm Sophisticated Serif)', value: "'DM Serif Display', serif" },
  { label: 'Lato (Warm & Balanced Sans)', value: "'Lato', sans-serif" },
  
  // Additional Couture Fonts
  { label: 'Playfair Display (Haute Couture)', value: "'Playfair Display', serif" },
  { label: 'Cinzel (Classical Roman Elegance)', value: "'Cinzel', serif" },
  { label: 'Great Vibes (Sweeping Loops Script)', value: "'Great Vibes', cursive" },
  { label: 'Space Grotesk (Avant-Garde Sans)', value: "'Space Grotesk', sans-serif" },
];

export interface FontPairingPreset {
  id: string;
  name: string;
  headingFontName: string;
  subheadingFontName: string;
  overallFeel: string;
  headingFont: string;
  subheadingFont: string;
  headingWeight: number;
  subheadingWeight: number;
  headingLetterSpacing: number;
  subheadingLetterSpacing: number;
  flourishFont?: string;
  sampleLine1?: string;
  sampleLine2Prefix?: string;
  sampleLine2Highlight?: string;
}

export const FONT_PAIRING_PRESETS: FontPairingPreset[] = [
  {
    id: 'editorial-swash-photo',
    name: 'Josefin Sans (Light) + Pinyon Script Swash',
    headingFontName: 'Josefin Sans + Pinyon Script',
    subheadingFontName: 'Montserrat Light',
    overallFeel: '✨ Dual-Font Swash (Exact Photo Style)',
    headingFont: "'Josefin Sans', sans-serif",
    subheadingFont: "'Montserrat', sans-serif",
    headingWeight: 300,
    subheadingWeight: 300,
    headingLetterSpacing: 5.0,
    subheadingLetterSpacing: 2.2,
    flourishFont: "'Pinyon Script', cursive",
    sampleLine1: '{R}EVEAL Y{O}UR MOST',
    sampleLine2Prefix: '{R}ADIANT ',
    sampleLine2Highlight: '{S}ELF',
  },
  {
    id: 'montserrat-alexbrush',
    name: 'Montserrat Light + Alex Brush Swash',
    headingFontName: 'Montserrat Light + Alex Brush',
    subheadingFontName: 'Plus Jakarta Sans',
    overallFeel: 'Modern Luxury Swash Flourish',
    headingFont: "'Montserrat', sans-serif",
    subheadingFont: "'Plus Jakarta Sans', sans-serif",
    headingWeight: 300,
    subheadingWeight: 300,
    headingLetterSpacing: 4.5,
    subheadingLetterSpacing: 1.8,
    flourishFont: "'Alex Brush', cursive",
    sampleLine1: '{R}EVEAL Y{O}UR MOST',
    sampleLine2Prefix: '{R}ADIANT ',
    sampleLine2Highlight: '{S}ELF',
  },
  {
    id: 'glamoure-flourish',
    name: 'Glamouré Headline with Swashes',
    headingFontName: 'Josefin Sans + Pinyon Script',
    subheadingFontName: 'DM Sans',
    overallFeel: 'Salon Headline with Flourishes',
    headingFont: "'Josefin Sans', sans-serif",
    subheadingFont: "'DM Sans', sans-serif",
    headingWeight: 300,
    subheadingWeight: 400,
    headingLetterSpacing: 4.2,
    subheadingLetterSpacing: 1.6,
    flourishFont: "'Pinyon Script', cursive",
    sampleLine1: '{E}LEVATE Y{O}UR {S}TYLE,',
    sampleLine2Prefix: '{D}EFINE Y{O}UR ',
    sampleLine2Highlight: '{B}EAUTY.',
  },
  {
    id: 'bodoni-manrope',
    name: 'Bodoni Moda + Manrope',
    headingFontName: 'Bodoni Moda',
    subheadingFontName: 'Manrope',
    overallFeel: 'Modern luxury',
    headingFont: "'Bodoni Moda', serif",
    subheadingFont: "'Manrope', sans-serif",
    headingWeight: 500,
    subheadingWeight: 400,
    headingLetterSpacing: 1.5,
    subheadingLetterSpacing: 1.2,
  },
  {
    id: 'cormorant-dmsans',
    name: 'Cormorant Garamond + DM Sans',
    headingFontName: 'Cormorant Garamond',
    subheadingFontName: 'DM Sans',
    overallFeel: 'Soft, elegant',
    headingFont: "'Cormorant Garamond', serif",
    subheadingFont: "'DM Sans', sans-serif",
    headingWeight: 400,
    subheadingWeight: 500,
    headingLetterSpacing: 2.2,
    subheadingLetterSpacing: 1.4,
  },
  {
    id: 'libre-jakartasans',
    name: 'Libre Bodoni + Plus Jakarta Sans',
    headingFontName: 'Libre Bodoni',
    subheadingFontName: 'Plus Jakarta Sans',
    overallFeel: 'Premium editorial',
    headingFont: "'Libre Bodoni', serif",
    subheadingFont: "'Plus Jakarta Sans', sans-serif",
    headingWeight: 600,
    subheadingWeight: 400,
    headingLetterSpacing: 1.8,
    subheadingLetterSpacing: 1.0,
  },
  {
    id: 'instrumentserif-inter',
    name: 'Instrument Serif + Inter',
    headingFontName: 'Instrument Serif',
    subheadingFontName: 'Inter',
    overallFeel: 'Contemporary luxury',
    headingFont: "'Instrument Serif', serif",
    subheadingFont: "'Inter', sans-serif",
    headingWeight: 400,
    subheadingWeight: 400,
    headingLetterSpacing: 1.4,
    subheadingLetterSpacing: 1.3,
  },
  {
    id: 'dmserif-lato',
    name: 'DM Serif Display + Lato',
    headingFontName: 'DM Serif Display',
    subheadingFontName: 'Lato',
    overallFeel: 'Warm and sophisticated',
    headingFont: "'DM Serif Display', serif",
    subheadingFont: "'Lato', sans-serif",
    headingWeight: 400,
    subheadingWeight: 400,
    headingLetterSpacing: 1.6,
    subheadingLetterSpacing: 1.2,
  },
];

export const COLOR_PALETTE = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Champagne Gold', value: '#efc9a5' },
  { name: 'Warm Cream', value: '#f5eee6' },
  { name: 'Muted Taupe', value: '#ded3c7' },
  { name: 'Antique Gold', value: '#cbb08a' },
  { name: 'Rose Gold', value: '#f3b49f' },
  { name: 'Amber Glow', value: '#e0a96d' },
  { name: 'Rich Charcoal', value: '#241812' },
  { name: 'Transparent', value: 'transparent' },
];
