export interface CornerRadii {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

export interface HeaderDesignConfig {
  eyebrow: string;
  eyebrowSize: number;
  eyebrowTracking: number;
  eyebrowColor: string;
  line1: string;
  line2: string;
  fontSize: number;
  letterSpacing: number;
  fontWeight: number;
  color: string;
  flourishScale: number;
  flourishFont: string;
  subheaderText: string;
  subheaderSize: number;
  subheaderColor: string;
  buttonText: string;
  buttonRadius: number;
  buttonBg: string;
  buttonColor: string;
  x: number;
  y: number;
}

export interface CardDesignConfig {
  title: string;
  subtitle: string;
  width: number;
  height: number;
  x: number;
  y: number;
  radius: CornerRadii;
  isItalic?: boolean;
}

export interface HairCardDesignConfig {
  title: string;
  subtitle: string;
  width: number;
  height: number;
  x: number;
  y: number;
  topRadius: number;
  bottomRadius: number;
  isItalic: boolean;
}

export interface StackDesignConfig {
  x: number;
  y: number;
  gap: number;
}

export interface ServicesDesignConfig {
  header: HeaderDesignConfig;
  hair: HairCardDesignConfig;
  skin: CardDesignConfig;
  nails: CardDesignConfig;
  spa: CardDesignConfig;
  stack: StackDesignConfig;
}

export const DEFAULT_SERVICES_CONFIG: ServicesDesignConfig = {
  header: {
    eyebrow: "SALON & STUDIO",
    eyebrowSize: 11.5,
    eyebrowTracking: 3.5,
    eyebrowColor: "#806B5C",
    line1: "{E}XPLORE OUR",
    line2: "SERVICES.",
    fontSize: 50,
    letterSpacing: 3.5,
    fontWeight: 300,
    color: "#41332B",
    flourishScale: 1.45,
    flourishFont: "'Alex Brush', cursive",
    subheaderText: "Hair, skin, nails and wellness services crafted for your complete care.",
    subheaderSize: 14,
    subheaderColor: "#806B5C",
    buttonText: "View All Services",
    buttonRadius: 9999,
    buttonBg: "#41332B",
    buttonColor: "#F4EEE7",
    x: -5,
    y: -68
  },
  hair: {
    title: "Hair",
    subtitle: "CUTS · STYLING · COLOR",
    width: 280,
    height: 518,
    x: 15,
    y: -32,
    topRadius: 9999,
    bottomRadius: 0,
    isItalic: true
  },
  skin: {
    title: "Skin",
    subtitle: "FACIALS · TREATMENTS",
    width: 270,
    height: 200,
    x: 15,
    y: -25,
    radius: {
      tl: 8,
      tr: 40,
      bl: 8,
      br: 8
    },
    isItalic: false
  },
  nails: {
    title: "Nails",
    subtitle: "MANICURE · PEDICURE",
    width: 210,
    height: 230,
    x: 15,
    y: -15,
    radius: {
      tl: 8,
      tr: 25,
      bl: 8,
      br: 25
    },
    isItalic: false
  },
  spa: {
    title: "Spa",
    subtitle: "RELAXATION · WELLNESS",
    width: 190,
    height: 300,
    x: 15,
    y: 18,
    radius: {
      tl: 40,
      tr: 8,
      bl: 35,
      br: 8
    },
    isItalic: false
  },
  stack: {
    x: 0,
    y: -36,
    gap: 12
  }
};
