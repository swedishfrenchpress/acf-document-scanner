"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Notification data pool - document processing notifications
const notificationPool = [
  { entity: "Mikhail Volkov", type: "Person identified" },
  { entity: "Cyprus Holdings Ltd", type: "Company extracted" },
  { entity: "$2.3M transfer", type: "Transaction found" },
  { entity: "BVI Shell Corp", type: "Entity linked" },
  { entity: "Swiss Trustee AG", type: "Connection mapped" },
  { entity: "Yacht 'Serenity'", type: "Asset discovered" },
];

interface StackNotification {
  id: number;
  entity: string;
  type: string;
  position: number;
}

// Animated Entity Discovery Bento Component
function EntityDiscoveryBento() {
  const [notifications, setNotifications] = useState<StackNotification[]>([]);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const dataIndexRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    idCounterRef.current = 0;
    dataIndexRef.current = 0;

    const initTimeout = requestAnimationFrame(() => {
      const initialStack: StackNotification[] = [];
      for (let i = 0; i < 3; i++) {
        const data = notificationPool[dataIndexRef.current % notificationPool.length];
        initialStack.push({
          id: idCounterRef.current++,
          ...data,
          position: 2 - i,
        });
        dataIndexRef.current++;
      }
      setNotifications(initialStack);
    });

    return () => {
      cancelAnimationFrame(initTimeout);
      setNotifications([]);
    };
  }, [isInView]);

  useEffect(() => {
    if (!isInView || notifications.length === 0) return;

    const cycleInterval = setInterval(() => {
      setNotifications(prev => {
        const updated = prev.map(n => ({
          ...n,
          position: n.position + 1,
        }));

        const newData = notificationPool[dataIndexRef.current % notificationPool.length];
        dataIndexRef.current++;
        
        updated.push({
          id: idCounterRef.current++,
          ...newData,
          position: -1,
        });

        setTimeout(() => {
          setNotifications(current => 
            current.map(n => n.position === -1 ? { ...n, position: 0 } : n)
          );
        }, 50);

        return updated.filter(n => n.position <= 3);
      });
    }, 2500);

    return () => clearInterval(cycleInterval);
  }, [isInView, notifications.length]);

  const getStackStyles = (position: number) => {
    const stackConfigs: Record<number, { y: string; scale: number; opacity: number; zIndex: number }> = {
      [-1]: { y: 'calc(-50% + 60px)', scale: 1, opacity: 0, zIndex: 4 },
      0: { y: '-50%', scale: 1, opacity: 1, zIndex: 3 },
      1: { y: 'calc(-50% - 12px)', scale: 0.96, opacity: 0.85, zIndex: 2 },
      2: { y: 'calc(-50% - 24px)', scale: 0.92, opacity: 0.7, zIndex: 1 },
      3: { y: 'calc(-50% - 50px)', scale: 0.88, opacity: 0, zIndex: 0 },
    };

    const config = stackConfigs[position] || stackConfigs[3];
    
    return {
      transform: `translateY(${config.y}) scale(${config.scale})`,
      opacity: config.opacity,
      zIndex: config.zIndex,
    };
  };

  return (
    <div ref={containerRef} className="bg-teal-pale rounded-lg p-6 flex-1 min-h-[320px] flex flex-col relative overflow-hidden border border-gray-200">
      <h3 className="text-2xl font-semibold text-navy mb-2 text-center">
        Real-time Entity Extraction
      </h3>
      <p className="text-base text-gray-500 mb-2 text-center">
        Upload a document. Watch as names, companies, addresses, and amounts are automatically identified.
      </p>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[380px] h-[140px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="absolute top-1/2 left-0 right-0 flex rounded-lg shadow-md ring-1 ring-black/5 items-center p-4 gap-4 pointer-events-none select-none bg-white"
              style={{
                ...getStackStyles(notification.position),
                transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-teal-soft flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-navy">{notification.type}</p>
                <p className="text-sm text-gray-500 truncate">{notification.entity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ACF Logo Component
function ACFLogo({ className = "text-3xl", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className={light ? "text-white" : "text-navy"}>acf</span>
      <span className="text-coral">.</span>
    </span>
  );
}

// Navigation
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm" 
        : ""
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Empty nav - logo removed */}
      </div>
    </nav>
  );
}

// Hero Section with Video Background
function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/scan-hero-image.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Strong dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />
        {/* Bottom gradient fade to page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-4xl mx-auto px-6 text-center pt-16">
        {/* Tagline */}
        <p className="text-teal-light text-sm font-semibold tracking-wider uppercase mb-4 drop-shadow-md">
          Document Intelligence Platform
        </p>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 drop-shadow-lg">
          Every document.<br />
          Every connection.<br />
          Never forgotten.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Upload thousands of documents. Our AI extracts names, companies, and relationships — 
          then links them to everything your organization has ever found.
        </p>
      </div>
    </section>
  );
}

// Problem Statement Section
function ProblemStatement() {
  return (
    <section className="bg-white py-20 px-4 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-4">The Problem</p>
        <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-8">
          Corruption hides in complexity
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed mb-6">
          A government official doesn&apos;t put a yacht in his own name — he puts it in a BVI shell company, 
          owned by a Cyprus holding company, managed by a Swiss trustee, with his son&apos;s former classmate as the nominee director.
        </p>
        <p className="text-lg text-gray-500 leading-relaxed mb-10">
          The evidence exists — scattered across corporate registries, property databases, procurement records, 
          and court filings in a dozen countries. The connections are there, buried in thousands of documents.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <p className="text-xl text-navy font-medium">
            &ldquo;The corruption networks are interconnected.<br/>The research is not.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// Bento Box Feature Section
function BentoFeatures() {
  return (
    <section id="features" className="bg-bg-light py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-4">The Solution</p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
            One system for all your research
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Every document, every entity, and every connection — searchable, linkable, and persistent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Document Upload & Analysis */}
          <div className="bg-white rounded-lg p-6 flex flex-col border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-2">Upload & Analyze</p>
                <h3 className="text-2xl font-semibold text-navy">
                  Drop any document
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="text-base text-gray-500 mb-6">
              PDFs, court filings, corporate registrations, financial records. 
              Our AI extracts every name, company, address, and amount automatically.
            </p>
            
            {/* Document stack */}
            <div className="flex-1 flex items-center justify-center min-h-[180px] relative">
              <div className="relative">
                <div className="absolute -bottom-1 -right-1 w-40 h-52 bg-gray-100 rounded-lg transform rotate-2 border border-gray-200 animate-document-stack-2"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-40 h-52 bg-gray-50 rounded-lg transform rotate-1 border border-gray-200 animate-document-stack-1"></div>
                <div className="relative w-40 h-52 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col animate-document-float">
                  <div className="h-2 w-3/4 bg-navy/20 rounded mb-2"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded mb-1"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded mb-1"></div>
                  <div className="h-1.5 w-2/3 bg-gray-100 rounded mb-3"></div>
                  <div className="h-1.5 w-1/2 bg-teal-soft rounded mb-1"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded mb-1"></div>
                  <div className="h-1.5 w-3/4 bg-teal-soft rounded mb-1"></div>
                  <div className="flex-1"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-12 bg-gray-100 rounded text-[8px] flex items-center justify-center text-gray-500">PDF</div>
                    <div className="h-4 w-14 bg-teal-soft rounded text-[8px] flex items-center justify-center text-teal">SCANNED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Mapping */}
          <div className="bg-white rounded-lg p-6 flex flex-col border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-2">Connection Mapping</p>
                <h3 className="text-2xl font-semibold text-navy">
                  Visualize networks
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <p className="text-base text-gray-500 mb-6">
              The yacht you&apos;re investigating today gets linked to the shell company a colleague traced three years ago.
            </p>
            
            {/* Network graph */}
            <div className="flex-1 relative min-h-[180px] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 180">
                <line 
                  x1="150" y1="90" x2="60" y2="40" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.2s'
                  }}
                />
                <line 
                  x1="150" y1="90" x2="240" y2="40" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.4s'
                  }}
                />
                <line 
                  x1="150" y1="90" x2="60" y2="140" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.6s'
                  }}
                />
                <line 
                  x1="150" y1="90" x2="240" y2="140" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.8s'
                  }}
                />
                <line x1="60" y1="40" x2="60" y2="140" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="240" y1="40" x2="240" y2="140" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                
                <circle 
                  cx="150" cy="90" 
                  r="18" 
                  fill="#1a1a2e"
                  style={{
                    animation: 'center-node-pulse 2.5s ease-in-out infinite'
                  }}
                />
                <text x="150" y="94" textAnchor="middle" fill="white" fontSize="8" fontWeight="500">OFFICIAL</text>
                
                <circle 
                  cx="60" cy="40" 
                  r="14" 
                  fill="#ccfbf1" 
                  stroke="#0d9488" 
                  strokeWidth="1"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.3s'
                  }}
                />
                <text x="60" y="44" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="500">BVI Co.</text>
                
                <circle 
                  cx="240" cy="40" 
                  r="14" 
                  fill="#ccfbf1" 
                  stroke="#0d9488" 
                  strokeWidth="1"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.5s'
                  }}
                />
                <text x="240" y="44" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="500">YACHT</text>
                
                <circle 
                  cx="60" cy="140" 
                  r="14" 
                  fill="#ccfbf1" 
                  stroke="#0d9488" 
                  strokeWidth="1"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.7s'
                  }}
                />
                <text x="60" y="144" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="500">TRUST</text>
                
                <circle 
                  cx="240" cy="140" 
                  r="14" 
                  fill="#ccfbf1" 
                  stroke="#0d9488" 
                  strokeWidth="1"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.9s'
                  }}
                />
                <text x="240" y="144" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="500">NOMINEE</text>
              </svg>
            </div>
          </div>

          {/* Multi-language Support */}
          <div className="bg-white rounded-lg p-6 flex flex-col border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-2">Multi-language</p>
                <h3 className="text-2xl font-semibold text-navy">
                  Multiple languages supported
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-soft flex items-center justify-center">
                <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
            </div>
            <p className="text-base text-gray-500 mb-6">
              Names transliterated six different ways? No problem. All variations linked as aliases on a single entity.
            </p>
            
            {/* Language cards */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 animate-language-fade-1">
                <p className="text-lg font-semibold text-navy mb-0.5">Волков</p>
                <p className="text-[10px] text-gray-400">Russian</p>
              </div>
              <span className="text-gray-300 animate-language-link">=</span>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 animate-language-fade-2">
                <p className="text-lg font-semibold text-navy mb-0.5">Volkov</p>
                <p className="text-[10px] text-gray-400">English</p>
              </div>
              <span className="text-gray-300 animate-language-link" style={{ animationDelay: '1.2s' }}>=</span>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 animate-language-fade-3">
                <p className="text-lg font-semibold text-navy mb-0.5">Volkoff</p>
                <p className="text-[10px] text-gray-400">French</p>
              </div>
            </div>
          </div>

          {/* Entity Discovery + Persistence */}
          <div className="flex flex-col gap-4">
            <EntityDiscoveryBento />

            <div className="bg-white rounded-lg p-6 flex-1 border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-soft flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-1">
                    Knowledge that persists
                  </h3>
                  <p className="text-base text-gray-500">
                    When someone leaves, their research stays. When a name appears in a new leak, you&apos;ll know it was relevant years ago.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Before/After Comparison
function BeforeAfter() {
  const comparisons = [
    {
      before: '"Have we ever looked at this company?" requires asking around',
      after: 'Search the system and know in seconds',
    },
    {
      before: 'Same shell company investigated three times by three people',
      after: 'One profile, enriched by everyone who touches it',
    },
    {
      before: 'Name variations found separately',
      after: 'Linked as aliases on a single entity',
    },
    {
      before: 'Researcher leaves, knowledge is lost',
      after: 'Research persists in the system',
    },
    {
      before: 'Connections discovered by accident or memory',
      after: 'Connections surfaced automatically on upload',
    },
  ];

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-4">What Changes</p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
            Before vs. After
          </h2>
        </div>

        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3 text-sm font-medium text-gray-500 px-4">
            <div>Before</div>
            <div>After</div>
          </div>
          {comparisons.map((item, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-3">
              <div className="bg-coral-soft rounded-lg p-4 flex items-center border border-red-100">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-sm text-gray-600">{item.before}</p>
                </div>
              </div>
              <div className="bg-teal-pale rounded-lg p-4 flex items-center border border-teal/20">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-navy font-medium">{item.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload",
      description: "Drop any document — PDFs, scanned images, court filings. Supports multiple languages.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Extract",
      description: "AI reads every page, extracting people, companies, addresses, dates, and amounts.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Match",
      description: "Every entity is checked against your organization's existing research.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Investigate",
      description: "Visualize ownership chains and build on what colleagues have discovered.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-bg-light py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
            From document to intelligence
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gray-200"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-4 text-teal">
                  {step.icon}
                </div>
                <span className="text-xs font-mono text-teal font-semibold mb-2">{step.number}</span>
                <h3 className="text-lg font-semibold text-navy mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Application Screenshots Section
function ApplicationScreenshots() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-teal tracking-wider uppercase mb-4">See It In Action</p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
            The platform in action
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Real screenshots from the application showing document analysis, entity extraction, and connection mapping.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Document Scanning */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/doc-scan.jpg"
                  alt="Document scanning interface"
                  fill
                  className="object-cover"
                />
                {/* Gradient fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-navy mb-1">Document Upload & Scanning</h3>
              <p className="text-sm text-gray-500">Upload documents and watch as the AI extracts entities in real-time.</p>
            </div>
          </div>

          {/* Analyzed Document */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/analyzed-doc.jpg"
                  alt="Analyzed document with extracted entities"
                  fill
                  className="object-cover"
                />
                {/* Gradient fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-navy mb-1">Entity Extraction & Analysis</h3>
              <p className="text-sm text-gray-500">See extracted names, companies, and relationships highlighted and linked.</p>
            </div>
          </div>

          {/* Connection Map */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/map-linking.jpg"
                  alt="Connection map showing entity relationships"
                  fill
                  className="object-cover"
                />
                {/* Gradient fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-navy mb-1">Connection Mapping</h3>
              <p className="text-sm text-gray-500">Automatically visualize relationships and connections between entities in a network graph.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-navy py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-base text-white/50 mb-12 max-w-xl mx-auto">
          AI-powered document intelligence for human rights organizations and investigative journalists.
        </p>
        
        {/* Partner Logos */}
        <div className="bg-white/5 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-12">
            <Image
              src="/hrf-logo.svg"
              alt="Human Rights Foundation"
              width={200}
              height={80}
              className="h-16 w-auto"
            />
            <Image
              src="/ai-rights-logo.svg"
              alt="AI Rights"
              width={200}
              height={80}
              className="h-16 w-auto"
            />
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-white/30">
            Expose corruption. Follow the money.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <ProblemStatement />
      <BentoFeatures />
      <BeforeAfter />
      <HowItWorks />
      <ApplicationScreenshots />
      <Footer />
    </main>
  );
}
