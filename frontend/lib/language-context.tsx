'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';

export interface Translations {
  nav: {
    schemes: string;
    eligibility: string;
    assistant: string;
    documents: string;
    comparison: string;
    about: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    admin: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    tagline: string;
    description: string;
    startExploring: string;
    askAi: string;
    statsSchemes: string;
    statsSchemesLabel: string;
    statsAccuracy: string;
    statsAccuracyLabel: string;
    statsCitizens: string;
    statsCitizensLabel: string;
    statsLanguages: string;
    statsLanguagesLabel: string;
  };
  features: {
    badge: string;
    heading: string;
    subheading: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
  };
  howItWorks: {
    badge: string;
    heading: string;
    subheading: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
  };
  schemes: {
    badge: string;
    heading: string;
    subheading: string;
    all: string;
    agriculture: string;
    healthcare: string;
    housing: string;
    finance: string;
    womenChild: string;
    education: string;
    viewDetails: string;
    checkEligibility: string;
    benefitLabel: string;
    verifiedSource: string;
  };
  impact: {
    badge: string;
    heading: string;
    subheading: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
    stat4Number: string;
    stat4Label: string;
  };
  testimonials: {
    badge: string;
    heading: string;
    subheading: string;
    demoNotice: string;
  };
  faq: {
    badge: string;
    heading: string;
    subheading: string;
  };
  footer: {
    aboutTitle: string;
    aboutDesc: string;
    quickLinks: string;
    categories: string;
    disclaimerTitle: string;
    disclaimerDesc: string;
    rightsReserved: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      schemes: "Schemes",
      eligibility: "Eligibility Checker",
      assistant: "AI Assistant",
      documents: "Documents Hub",
      comparison: "Compare Schemes",
      about: "About JanSathi",
      signIn: "Sign In",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      admin: "Admin",
    },
    hero: {
      badge: "🇮🇳 Digital Public Infrastructure for Bharat",
      titlePart1: "Government Services",
      titlePart2: "Made Simple for Every Indian",
      tagline: "Government Services Made Simple for Every Indian.",
      description: "Discover welfare schemes, verify deterministic eligibility in seconds, prepare documents with smart OCR, and receive step-by-step guidance in Telugu and English.",
      startExploring: "Start Exploring Schemes",
      askAi: "Ask AI Assistant",
      statsSchemes: "500+",
      statsSchemesLabel: "Central & State Schemes",
      statsAccuracy: "100%",
      statsAccuracyLabel: "Grounded Official Citations",
      statsCitizens: "140 Cr",
      statsCitizensLabel: "Citizens Empowered",
      statsLanguages: "2",
      statsLanguagesLabel: "Telugu & English Ready",
    },
    features: {
      badge: "Cutting-Edge Public Tech",
      heading: "Designed for Accessibility, Accuracy & Trust",
      subheading: "JanSathi AI bridges the digital divide with official government data and explainable intelligence.",
      f1Title: "Multilingual Voice & Text AI",
      f1Desc: "Interact seamlessly in Telugu and English. Speak your questions naturally and receive voice-guided explanations.",
      f2Title: "Deterministic Eligibility Engine",
      f2Desc: "No guesswork. Clear rule-based matching against published age, income, land, and category criteria.",
      f3Title: "Grounded RAG Architecture",
      f3Desc: "Every AI response is grounded directly in official Gazette notifications and government portal documents.",
      f4Title: "Smart OCR & Document Readiness",
      f4Desc: "Check required documents before applying. Extract fields and identify missing prerequisites safely.",
      f5Title: "Scheme Change Monitor",
      f5Desc: "Automatic tracking of official source updates and freshness indicators to keep you ahead of policy revisions.",
      f6Title: "Rural & Low-Bandwidth Mode",
      f6Desc: "Optimized for 2G/3G speeds and mobile devices, with offline-friendly caching for critical welfare information.",
    },
    howItWorks: {
      badge: "Simple 4-Step Process",
      heading: "How JanSathi AI Empowers You",
      subheading: "From discovery to application preparation in minutes.",
      s1Title: "1. Discover Schemes",
      s1Desc: "Browse hundreds of central and state welfare initiatives filtered by your profile and needs.",
      s2Title: "2. Check Eligibility",
      s2Desc: "Enter simple criteria like age, state, and occupation for an instant transparent evaluation.",
      s3Title: "3. Verify Documents",
      s3Desc: "Upload sample proofs to generate a personalized checklist of documents needed for approval.",
      s4Title: "4. Get Step-by-Step Guidance",
      s4Desc: "Follow a structured application walkthrough with direct official links and Telugu audio assistance.",
    },
    schemes: {
      badge: "Popular Welfare Initiatives",
      heading: "Explore Top Government Schemes",
      subheading: "Verified benefits and direct links to official government portals.",
      all: "All Schemes",
      agriculture: "Agriculture & Farmers",
      healthcare: "Healthcare & Life",
      housing: "Housing & Shelter",
      finance: "Financial Inclusion",
      womenChild: "Women & Child",
      education: "Education & Skills",
      viewDetails: "View Details",
      checkEligibility: "Check Eligibility",
      benefitLabel: "Benefit",
      verifiedSource: "Verified Official Source",
    },
    impact: {
      badge: "Civic Impact",
      heading: "Empowering Citizens Across the Nation",
      subheading: "Democratizing access to public entitlements and eliminating bureaucratic hurdles.",
      stat1Number: "₹3.2 Lakh Cr+",
      stat1Label: "Annual Direct Benefit Transfers Enabled",
      stat2Number: "28 States & 8 UTs",
      stat2Label: "Cross-India Scheme Coverage",
      stat3Number: "Zero Hallucination",
      stat3Label: "Deterministic Rules + Grounded Citations",
      stat4Number: "100% Free",
      stat4Label: "Dedicated to Public Welfare",
    },
    testimonials: {
      badge: "Citizen Stories",
      heading: "Real Impact for Everyday Indians",
      subheading: "Experiences from citizens navigating welfare schemes with JanSathi AI.",
      demoNotice: "Sample citizen stories for hackathon demonstration",
    },
    faq: {
      badge: "Got Questions?",
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know about JanSathi AI and how we assist you.",
    },
    footer: {
      aboutTitle: "About JanSathi AI",
      aboutDesc: "An AI-powered civic assistant dedicated to making government welfare schemes and public services transparent, accessible, and multilingual for every Indian citizen.",
      quickLinks: "Quick Navigation",
      categories: "Scheme Sectors",
      disclaimerTitle: "Official Disclaimer",
      disclaimerDesc: "JanSathi AI is an independent citizen assistance portal. All scheme links redirect to official government portals (e.g. data.gov.in, pmkisan.gov.in, pmjay.gov.in). We never ask for Aadhaar OTPs, passwords, or bank credentials.",
      rightsReserved: "JanSathi AI - Built with pride for Bharat. All rights reserved.",
    }
  },
  te: {
    nav: {
      schemes: "ప్రభుత్వ పథకాలు",
      eligibility: "అర్హత తనిఖీ",
      assistant: "AI సహాయకుడు",
      documents: "పత్రాల కేంద్రం",
      comparison: "పథకాల పోలిక",
      about: "మా గురించి",
      signIn: "లాగిన్",
      getStarted: "ప్రారంభించండి",
      dashboard: "డ్యాష్‌బోర్డ్",
      admin: "అడ్మిన్",
    },
    hero: {
      badge: "🇮🇳 భారత డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్",
      titlePart1: "ప్రభుత్వ సేవలు",
      titlePart2: "ప్రతి భారతీయుడి కోసం సులభతరం",
      tagline: "ప్రతి భారతీయుడి కోసం ప్రభుత్వ సేవలు సులభతరం.",
      description: "సంక్షేమ పథకాలను కనుగొనండి, కొన్ని సెకన్లలో మీ అర్హతను ఖచ్చితంగా తెలుసుకోండి, స్మార్ట్ OCR తో పత్రాలను సిద్ధం చేసుకోండి మరియు తెలుగు మరియు ఆంగ్లంలో సమగ్ర మార్గదర్శకత్వం పొందండి.",
      startExploring: "పథకాలను అన్వేషించండి",
      askAi: "AI సహాయకుడిని అడగండి",
      statsSchemes: "500+",
      statsSchemesLabel: "కేంద్ర & రాష్ట్ర పథకాలు",
      statsAccuracy: "100%",
      statsAccuracyLabel: "అధికారిక ప్రభుత్వ సమాచారం",
      statsCitizens: "140 కోట్లు",
      statsCitizensLabel: "పౌరుల సాధికారత",
      statsLanguages: "2",
      statsLanguagesLabel: "తెలుగు & ఇంగ్లీష్ సిద్ధం",
    },
    features: {
      badge: "అధునాతన ప్రజా సాంకేతికత",
      heading: "సహజత్వం, ఖచ్చితత్వం మరియు నమ్మకంతో రూపకల్పన",
      subheading: "అధికారిక ప్రభుత్వ డేటా మరియు సులభమైన AI తో డిజిటల్ వ్యత్యాసాన్ని తొలగిస్తున్నాం.",
      f1Title: "బహుభాషా వాయిస్ & టెక్స్ట్ AI",
      f1Desc: "తెలుగు మరియు ఆంగ్లంలో సహజంగా మాట్లాడండి. మీ ప్రశ్నలకు నేరుగా వాయిస్ రూపంలో వివరణలు పొందండి.",
      f2Title: "నియమ-ఆధారిత అర్హత ఇంజిన్",
      f2Desc: "ఊహాగానాలు లేవు. వయస్సు, ఆదాయం, భూమి మరియు కేటగిరీ నిబంధనల ప్రకారం ఖచ్చితమైన అర్హత విశ్లేషణ.",
      f3Title: "గెజిట్-ఆధారిత RAG ఆర్కిటెక్చర్",
      f3Desc: "ప్రతి AI సమాధానం అధికారిక ప్రభుత్వ గెజిట్లు మరియు పోర్టల్ పత్రాల నుండి ధృవీకరించబడుతుంది.",
      f4Title: "స్మార్ట్ OCR & పత్రాల సంసిద్ధత",
      f4Desc: "దరఖాస్తు చేయడానికి ముందు అవసరమైన పత్రాలను తనిఖీ చేయండి. లోపించిన వివరాలను సురక్షితంగా గుర్తించండి.",
      f5Title: "పథకాల మార్పుల పర్యవేక్షణ",
      f5Desc: "ప్రభుత్వ నిబంధనలు లేదా గడువులు మారినప్పుడు తాజా సమాచారాన్ని తెలియజేసే వ్యవస్థ.",
      f6Title: "గ్రామీణ & తక్కువ బ్యాండ్‌విడ్త్ మోడ్",
      f6Desc: "2G/3G ఇంటర్నెట్ వేగంతో కూడా తేలికగా పనిచేసేలా ఆప్టిమైజ్ చేయబడింది.",
    },
    howItWorks: {
      badge: "సులభమైన 4 దశలు",
      heading: "జన్‌సాథి AI ఎలా పనిచేస్తుంది?",
      subheading: "పథకం తెలుసుకోవడం నుండి దరఖాస్తు వరకు నిమిషాల్లో పూర్తవుతుంది.",
      s1Title: "1. పథకాలను కనుగొనండి",
      s1Desc: "మీ అవసరాలకు తగిన వందలాది కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలను పరిశీలించండి.",
      s2Title: "2. అర్హతను తనిఖీ చేయండి",
      s2Desc: "వయస్సు, రాష్ట్రం మరియు వృత్తి వంటి వివరాలను నమోదు చేసి తక్షణమే అర్హతను తెలుసుకోండి.",
      s3Title: "3. పత్రాలను పరిశీలించండి",
      s3Desc: "అవసరమైన పత్రాల చెక్‌లిస్ట్‌ను స్వయంచాలకంగా రూపొందించి సిద్ధం చేసుకోండి.",
      s4Title: "4. పూర్తి మార్గదర్శకత్వం పొందండి",
      s4Desc: "తెలుగులో స్పష్టమైన దశలవారీ సూచనలు మరియు అధికారిక ప్రభుత్వ లింకులతో దరఖాస్తు చేసుకోండి.",
    },
    schemes: {
      badge: "ప్రముఖ సంక్షేమ పథకాలు",
      heading: "ముఖ్యమైన ప్రభుత్వ పథకాలను అన్వేషించండి",
      subheading: "ధృవీకరించబడిన ప్రయోజనాలు మరియు అధికారిక పోర్టల్ లింకులు.",
      all: "అన్ని పథకాలు",
      agriculture: "వ్యవసాయం & రైతులు",
      healthcare: "ఆరోగ్య సంరక్షణ",
      housing: "గృహ నిర్మాణం",
      finance: "ఆర్థిక సహాయం",
      womenChild: "మహిళా & శిశు సంక్షేమం",
      education: "విద్య & నైపుణ్యాలు",
      viewDetails: "వివరాలు చూడండి",
      checkEligibility: "అర్హత చూడండి",
      benefitLabel: "ప్రయోజనం",
      verifiedSource: "ధృవీకరించబడిన మూలం",
    },
    impact: {
      badge: "సామాజిక ప్రభావం",
      heading: "జాతివ్యాప్తంగా పౌరుల సాధికారత",
      subheading: "ప్రజా సంక్షేమ ఫలాలను ప్రతి పౌరుడికీ సులభంగా చేరవేయడమే మా లక్ష్యం.",
      stat1Number: "₹3.2 లక్షల కోట్లు+",
      stat1Label: "ప్రత్యక్ష నగదు బదిలీ పథకాలు",
      stat2Number: "28 రాష్ట్రాలు & 8 కేంద్రపాలిత ప్రాంతాలు",
      stat2Label: "భారతదేశ వ్యాప్త పథకాలు",
      stat3Number: "100% ఖచ్చితత్వం",
      stat3Label: "నియమ-ఆధారిత నిర్ధారణ",
      stat4Number: "ఉచితం",
      stat4Label: "ప్రజా సేవకు అంకితం",
    },
    testimonials: {
      badge: "పౌరుల స్పందనలు",
      heading: "సాధారణ ప్రజల అనుభవాలు",
      subheading: "జన్‌సాథి AI ద్వారా సంక్షేమ పథకాలు పొందిన పౌరుల అనుభవాలు.",
      demoNotice: "హ్యాకథాన్ ప్రదర్శన కోసం నమూనా పౌరుల కథనాలు",
    },
    faq: {
      badge: "సందేహాలు ఉన్నాయా?",
      heading: "తరచుగా అడిగే ప్రశ్నలు (FAQ)",
      subheading: "జన్‌సాథి AI మరియు సేవల గురించి పూర్తి సమాచారం.",
    },
    footer: {
      aboutTitle: "జన్‌సాథి AI గురించి",
      aboutDesc: "భారతీయ పౌరులందరికీ ప్రభుత్వ సంక్షేమ పథకాలు మరియు సేవలను సులభంగా, పారదర్శకంగా అందించే AI సహాయక వేదిక.",
      quickLinks: "ముఖ్యమైన లింకులు",
      categories: "పథకాల రంగాలు",
      disclaimerTitle: "అధికారిక నిరాకరణ (Disclaimer)",
      disclaimerDesc: "జన్‌సాథి AI అనేది స్వతంత్ర పౌర సహాయ వేదిక. అన్ని లింకులు అధికారిక ప్రభుత్వ పోర్టళ్లకు (data.gov.in, pmkisan.gov.in) దారితీస్తాయి. మేము ఆధార్ OTPలు లేదా బ్యాంకు పాస్‌వర్డ్‌లను ఎప్పుడూ అడగము.",
      rightsReserved: "జన్‌సాథి AI - భారత్ కోసం గర్వంగా నిర్మించబడింది. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.",
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('jansathi_lang') as Language;
    if (saved && (saved === 'en' || saved === 'te')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jansathi_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
