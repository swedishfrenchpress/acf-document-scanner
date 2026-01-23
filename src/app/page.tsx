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
    <div ref={containerRef} className="bg-teal-pale rounded-sm p-10 flex-1 min-h-[320px] flex flex-col relative overflow-hidden border border-gray-200 card-hover editorial-accent">
      <h3 className="text-2xl font-bold text-charcoal mb-3 text-center tracking-tight">
        Real-time Entity Extraction
      </h3>
      <p className="text-base text-gray-700 mb-6 text-center font-light leading-relaxed">
        Upload a document. Watch as names, companies, addresses, and amounts are automatically identified.
      </p>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[380px] h-[140px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="absolute top-1/2 left-0 right-0 flex rounded-sm items-center p-6 gap-4 pointer-events-none select-none bg-bg-paper border border-gray-200"
              style={{
                ...getStackStyles(notification.position),
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="w-12 h-12 rounded-sm bg-teal-soft flex items-center justify-center flex-shrink-0 border border-teal/20">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-charcoal">{notification.type}</p>
                <p className="text-sm text-gray-600 truncate font-light">{notification.entity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-bg-paper/90 backdrop-blur-xl border-b border-gray-200/50" 
        : ""
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Empty nav - logo removed */}
      </div>
    </nav>
  );
}

// Hero Section with Video Background
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grain-overlay">
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
        {/* Editorial gradient overlay - warmer, more atmospheric */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-cream/85 via-bg-cream/70 to-bg-cream/90 z-10" />
        {/* Bottom gradient fade to page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-cream to-transparent z-20" />
      </div>

      {/* Content - Editorial layout */}
      <div className="relative z-30 max-w-6xl mx-auto px-8 pt-24 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="md:col-span-12">
            {/* Tagline with editorial accent */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-teal"></div>
              <p className="text-teal text-xs font-semibold tracking-[0.2em] uppercase">
                Document Intelligence Platform
              </p>
            </div>

            {/* Main Headline - Editorial serif */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-charcoal leading-[1.05] mb-8 tracking-tight">
              Every document.<br />
              Every connection.<br />
              <span className="italic">Never forgotten.</span>
            </h1>

            {/* Subtitle - refined body font */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-2xl leading-relaxed mb-10 font-light">
              Upload thousands of documents. Our AI extracts names, companies, and relationships — 
              then links them to everything your organization has ever found.
            </p>

            {/* CTA Button - editorial style */}
            <a
              href="https://corruption-disrespector-demo.replit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center px-10 py-4 bg-charcoal text-white text-base font-semibold rounded-sm hover:bg-charcoal-light transition-all"
            >
              View Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Problem Statement Section
function ProblemStatement() {
  return (
    <section className="bg-bg-paper py-40 px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Asymmetric layout */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* Left column - label */}
          <div className="md:col-span-3">
            <div className="sticky top-24">
              <div className="h-px w-16 bg-teal mb-4"></div>
              <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">The Problem</p>
            </div>
          </div>

          {/* Right column - content */}
          <div className="md:col-span-9">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] mb-10 tracking-tight">
              Corruption hides in complexity
            </h2>
            
            <div className="space-y-8 mb-12">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                A government official doesn&apos;t put a yacht in his own name — he puts it in a BVI shell company, 
                owned by a Cyprus holding company, managed by a Swiss trustee, with his son&apos;s former classmate as the nominee director.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                The evidence exists — scattered across corporate registries, property databases, procurement records, 
                and court filings in a dozen countries. The connections are there, buried in thousands of documents.
              </p>
            </div>

            {/* Editorial quote block */}
            <div className="bg-bg-cream border-l-4 border-teal pl-8 py-8 pr-12 relative">
              <div className="absolute top-0 left-0 text-6xl text-teal/10 font-display leading-none">&ldquo;</div>
              <p className="text-2xl text-charcoal font-medium leading-relaxed relative z-10 italic">
                The corruption networks are interconnected.<br/>The research is not.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bento Box Feature Section
function BentoFeatures() {
  return (
    <section id="features" className="bg-bg-cream py-40 px-8 relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial header */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-teal"></div>
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">The Solution</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] mb-6 tracking-tight max-w-4xl">
            One system for all your research
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl font-light leading-relaxed">
            Every document, every entity, and every connection — searchable, linkable, and persistent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Document Upload & Analysis */}
          <div className="bg-bg-paper rounded-sm p-10 flex flex-col border border-gray-200 card-hover relative overflow-hidden editorial-accent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full blur-2xl"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-4">Upload & Analyze</p>
                <h3 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">
                  Drop any document
                </h3>
              </div>
              <div className="w-14 h-14 rounded-sm bg-teal-soft flex items-center justify-center border border-teal/20">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed font-light relative z-10">
              PDFs, court filings, corporate registrations, financial records. 
              Our AI extracts every name, company, address, and amount automatically.
            </p>
            
            {/* Document stack with scanning effect */}
            <div className="flex-1 flex items-center justify-center min-h-[180px] relative">
              <div className="relative">
                <div className="absolute -bottom-1 -right-1 w-40 h-52 bg-gray-100 rounded-sm transform rotate-2 border border-gray-200 animate-document-stack-2"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-40 h-52 bg-gray-50 rounded-sm transform rotate-1 border border-gray-200 animate-document-stack-1"></div>
                <div className="relative w-40 h-52 bg-bg-paper rounded-sm border border-gray-200 p-4 flex flex-col animate-document-float overflow-hidden">
                  {/* Scanning line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent animate-scan-line"></div>
                  <div className="h-2 w-3/4 bg-charcoal/20 rounded-sm mb-2"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-sm mb-1"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-sm mb-1"></div>
                  <div className="h-1.5 w-2/3 bg-gray-100 rounded-sm mb-3"></div>
                  <div className="h-1.5 w-1/2 bg-teal-soft rounded-sm mb-1"></div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-sm mb-1"></div>
                  <div className="h-1.5 w-3/4 bg-teal-soft rounded-sm mb-1"></div>
                  <div className="flex-1"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-12 bg-gray-100 rounded-sm text-[8px] flex items-center justify-center text-gray-600 font-medium">PDF</div>
                    <div className="h-4 w-14 bg-teal-soft rounded-sm text-[8px] flex items-center justify-center text-teal font-medium">SCANNED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Mapping */}
          <div className="bg-bg-paper rounded-sm p-10 flex flex-col border border-gray-200 card-hover relative overflow-hidden editorial-accent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full blur-2xl"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-4">Connection Mapping</p>
                <h3 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">
                  Visualize networks
                </h3>
              </div>
              <div className="w-14 h-14 rounded-sm bg-teal-soft flex items-center justify-center border border-teal/20">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed font-light relative z-10">
              The yacht you&apos;re investigating today gets linked to the shell company a colleague traced three years ago.
            </p>
            
            {/* Network graph - elegant version with labels outside nodes */}
            <div className="flex-1 relative min-h-[200px] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 340 200">
                {/* Connection lines - drawn first so nodes appear on top */}
                <line 
                  x1="170" y1="100" x2="50" y2="45" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.3s'
                  }}
                />
                <line 
                  x1="170" y1="100" x2="290" y2="45" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.5s'
                  }}
                />
                <line 
                  x1="170" y1="100" x2="50" y2="155" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.7s'
                  }}
                />
                <line 
                  x1="170" y1="100" x2="290" y2="155" 
                  stroke="#0d9488" 
                  strokeWidth="1.5" 
                  opacity="0"
                  style={{
                    animation: 'line-fade-in 1s ease-out forwards',
                    animationDelay: '0.9s'
                  }}
                />
                {/* Secondary connections */}
                <line x1="50" y1="45" x2="50" y2="155" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="290" y1="45" x2="290" y2="155" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Center node - Official with pulse rings */}
                <circle 
                  cx="170" cy="100" 
                  r="28" 
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="1"
                  opacity="0"
                  style={{
                    animation: 'pulse-ring 2.5s ease-out infinite'
                  }}
                />
                <circle 
                  cx="170" cy="100" 
                  r="20" 
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="1"
                  opacity="0"
                  style={{
                    animation: 'pulse-ring 2.5s ease-out infinite',
                    animationDelay: '0.4s'
                  }}
                />
                <circle 
                  cx="170" cy="100" 
                  r="12" 
                  fill="#dc2626"
                />
                <text x="170" y="138" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="700" letterSpacing="0.08em">OFFICIAL</text>
                
                {/* Top left node - BVI Corp */}
                <circle 
                  cx="50" cy="45" 
                  r="8" 
                  fill="#0d9488"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.3s'
                  }}
                />
                <text x="50" y="28" textAnchor="middle" fill="#525252" fontSize="9" fontWeight="500">BVI Corp</text>
                
                {/* Top right node - Yacht */}
                <circle 
                  cx="290" cy="45" 
                  r="8" 
                  fill="#0d9488"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.5s'
                  }}
                />
                <text x="290" y="28" textAnchor="middle" fill="#525252" fontSize="9" fontWeight="500">Yacht</text>
                
                {/* Bottom left node - Swiss Trust */}
                <circle 
                  cx="50" cy="155" 
                  r="8" 
                  fill="#0d9488"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.7s'
                  }}
                />
                <text x="50" y="178" textAnchor="middle" fill="#525252" fontSize="9" fontWeight="500">Swiss Trust</text>
                
                {/* Bottom right node - Nominee */}
                <circle 
                  cx="290" cy="155" 
                  r="8" 
                  fill="#0d9488"
                  style={{
                    animation: 'node-pulse 2s ease-in-out infinite',
                    animationDelay: '0.9s'
                  }}
                />
                <text x="290" y="178" textAnchor="middle" fill="#525252" fontSize="9" fontWeight="500">Nominee</text>
              </svg>
            </div>
          </div>

          {/* Multi-language Support */}
          <div className="bg-bg-paper rounded-sm p-10 flex flex-col border border-gray-200 card-hover relative overflow-hidden editorial-accent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full blur-2xl"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-4">Multi-language</p>
                <h3 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">
                  Multiple languages supported
                </h3>
              </div>
              <div className="w-14 h-14 rounded-sm bg-teal-soft flex items-center justify-center border border-teal/20">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed font-light relative z-10">
              Names transliterated six different ways? No problem. All variations linked as aliases on a single entity.
            </p>
            
            {/* Language cards */}
            <div className="flex-1 flex items-center justify-center gap-5 relative z-10">
              <div className="bg-bg-cream rounded-sm p-6 border border-gray-200 hover:border-teal/30 transition-colors">
                <p className="text-xl font-bold text-charcoal mb-1.5 tracking-tight">Волков</p>
                <p className="text-xs text-gray-600 font-medium">Russian</p>
              </div>
              <span className="text-gray-400 text-2xl animate-language-link font-light">=</span>
              <div className="bg-bg-cream rounded-sm p-6 border border-gray-200 hover:border-teal/30 transition-colors">
                <p className="text-xl font-bold text-charcoal mb-1.5 tracking-tight">Volkov</p>
                <p className="text-xs text-gray-600 font-medium">English</p>
              </div>
              <span className="text-gray-400 text-2xl animate-language-link font-light" style={{ animationDelay: '1.2s' }}>=</span>
              <div className="bg-bg-cream rounded-sm p-6 border border-gray-200 hover:border-teal/30 transition-colors">
                <p className="text-xl font-bold text-charcoal mb-1.5 tracking-tight">Volkoff</p>
                <p className="text-xs text-gray-600 font-medium">French</p>
              </div>
            </div>
          </div>

          {/* Entity Discovery + Persistence */}
          <div className="flex flex-col gap-4">
            <EntityDiscoveryBento />

            <div className="bg-white rounded-2xl p-8 flex-1 border border-gray-100 card-hover">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-sm bg-teal-soft flex items-center justify-center flex-shrink-0 border border-teal/20">
                  <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal mb-2 tracking-tight">
                    Knowledge that persists
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed font-light">
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
    <section className="bg-bg-paper py-40 px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-teal"></div>
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">What Changes</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight max-w-3xl">
            Before vs. After
          </h2>
        </div>

        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-8 text-sm font-semibold text-gray-600 px-2 mb-4 border-b border-gray-200 pb-4">
            <div>Before</div>
            <div>After</div>
          </div>
          {comparisons.map((item, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-8">
              <div className="bg-bg-cream rounded-sm p-7 flex items-center border-l-4 border-red-300 transition-colors">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-base text-gray-700 leading-relaxed font-light">{item.before}</p>
                </div>
              </div>
              <div className="bg-bg-cream rounded-sm p-7 flex items-center border-l-4 border-teal transition-colors">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-base text-charcoal font-semibold leading-relaxed">{item.after}</p>
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
    <section className="bg-bg-cream py-40 px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-teal"></div>
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">How It Works</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight max-w-3xl">
            From document to intelligence
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[65%] w-[70%] h-px bg-gray-300"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-sm bg-bg-paper border-2 border-teal/30 flex items-center justify-center mb-6 text-teal">
                  {step.icon}
                </div>
                <span className="text-xs font-mono text-teal font-semibold mb-3 tracking-wider">{step.number}</span>
                <h3 className="text-xl font-bold text-charcoal mb-3 tracking-tight">{step.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed font-light">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal frame component for screenshot display
function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm overflow-hidden border border-gray-200 bg-gray-100">
      {/* Minimal top bar - just a subtle hint */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      {/* Screenshot content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Application Screenshots Section
function ApplicationScreenshots() {
  return (
    <section className="bg-bg-paper py-40 px-8 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/3 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-24 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-teal"></div>
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">See It In Action</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] mb-6 tracking-tight">
            The platform in action
          </h2>
          <p className="text-xl text-gray-700 font-light leading-relaxed">
            A seamless workflow from document upload to connection mapping.
          </p>
        </div>

        {/* Hero Screenshot - Full Width */}
        <div className="mb-16 relative">
          <div className="absolute -top-4 -left-4 text-8xl font-bold text-teal/10 select-none">01</div>
          <ScreenFrame>
            <div className="relative aspect-[16/10] bg-gray-50">
              <Image
                src="/doc-scan.jpg"
                alt="Document scanning interface"
                fill
                className="object-contain"
              />
            </div>
          </ScreenFrame>
          <div className="mt-8 max-w-xl">
            <h3 className="text-2xl font-bold text-charcoal mb-3 tracking-tight">Upload & Analyze</h3>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              Drop any document — PDFs, scanned images, court filings. The AI extracts entities automatically.
            </p>
          </div>
        </div>

        {/* Two-column layout for remaining screenshots */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Entity Extraction */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-8xl font-bold text-teal/10 select-none">02</div>
            <ScreenFrame>
              <div className="relative aspect-[16/10] bg-gray-50">
                <Image
                  src="/analyzed-doc.jpg"
                  alt="Analyzed document with extracted entities"
                  fill
                  className="object-contain"
                />
              </div>
            </ScreenFrame>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-charcoal mb-3 tracking-tight">Extract Entities</h3>
              <p className="text-base text-gray-700 leading-relaxed font-light">
                Names, companies, and relationships are highlighted and linked to your existing research.
              </p>
            </div>
          </div>

          {/* Connection Map */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-8xl font-bold text-teal/10 select-none">03</div>
            <ScreenFrame>
              <div className="relative aspect-[16/10] bg-gray-50">
                <Image
                  src="/map-linking.jpg"
                  alt="Connection map showing entity relationships"
                  fill
                  className="object-contain"
                />
              </div>
            </ScreenFrame>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-charcoal mb-3 tracking-tight">Map Connections</h3>
              <p className="text-base text-gray-700 leading-relaxed font-light">
                Visualize the network of relationships between entities across all your investigations.
              </p>
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
    <footer className="bg-bg-cream py-40 px-8 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Asymmetric layout matching the rest of the site */}
        <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
          {/* Left column - description */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-teal"></div>
              <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase">Corruption Disrespector</p>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl leading-relaxed font-light mb-8">
              AI-powered document intelligence for human rights organizations and investigative journalists.
            </p>
            <p className="text-base text-gray-600 leading-relaxed font-light italic">
              Expose corruption. Follow the money.
            </p>
          </div>

          {/* Right column - partner logos */}
          <div className="md:col-span-5">
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-6">Partners</p>
            <div className="flex flex-col gap-4">
              {/* HRF Logo - light background */}
              <a
                href="https://hrf.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bg-paper rounded-sm p-6 border border-gray-200 flex items-center justify-center hover:border-teal/30 transition-colors"
              >
                <Image
                  src="/hrf-logo.svg"
                  alt="Human Rights Foundation"
                  width={200}
                  height={80}
                  className="h-14 w-auto opacity-90 hover:opacity-100 transition-all duration-300"
                />
              </a>
              {/* AI Rights Logo - dark teal background */}
              <a
                href="https://hrf.org/program/ai-for-individual-rights/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm p-8 border border-teal-dark flex items-center justify-center hover:border-teal-light transition-colors"
                style={{ backgroundColor: '#0f766e' }}
              >
                <Image
                  src="/ai-rights-logo.svg"
                  alt="AI Rights"
                  width={200}
                  height={80}
                  className="h-20 w-auto opacity-95 hover:opacity-100 transition-all duration-300"
                />
              </a>
            </div>
          </div>
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
      <ApplicationScreenshots />
      <Footer />
    </main>
  );
}
