"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibilityForm } from "@/components/loan/eligibility-form";
import { ResultsDashboard, type EligibilityResult } from "@/components/loan/results-dashboard";
import { HistoryPanel, type HistoryItem } from "@/components/loan/history-panel";
import { Chatbot } from "@/components/chat/chatbot";
import { EMICalculator } from "@/components/tools/emi-calculator";
import { LocaleProvider, useLocale } from "@/contexts/locale-context";
import { useAuthStore } from "@/stores/auth-store";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Zap, BarChart3, Brain, Lock, RefreshCcw, ArrowDown, Menu, X,
  Scale, FileText, Eye, AlertTriangle, Database, Users, Globe, House,
  GraduationCap, Car, Building2, Landmark, Wheat, Heart, Star, Calculator,
  TrendingUp, Target, ShieldCheck, Sparkles, MessageSquareText, Lightbulb,
  BadgeDollarSign, Quote, LogOut, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = {
  applicantName: string; monthlyIncome: string; creditScore: string;
  loanAmount: string; loanTenure: string; employmentType: string;
  existingDebt: string; loanPurpose: string;
};

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = Date.now();
          const tick = () => {
            const p = Math.min((Date.now() - t0) / duration, 1);
            setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

const CYAN = "oklch(0.75 0.18 200)";
const GOLD = "oklch(0.82 0.16 85)";
const MUTED = "oklch(0.60 0.02 220)";
const DIM = "oklch(0.55 0.02 220)";
const BORDER_SUBTLE = "oklch(0.30 0.04 265 / 0.5)";

const badgeStyle = (bg: string, color: string, border: string) => ({
  background: `${bg} / 0.1`, color, border: `1px solid ${border} / 0.15`,
});

function MainContent() {
  const { locale, setLocale, t } = useLocale();
  const { user, isAuthenticated, login, register, logout, checkAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("check");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialog, setAuthDialog] = useState<"login" | "register" | null>(null);
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) setHistory(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Analysis failed"); }
      const analysisResult = await res.json();
      setResult(analysisResult);
      setActiveTab("results");
      toast.success("AI analysis complete!");
      fetchHistory();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setIsLoading(false); }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast.success("Record deleted");
      }
    } catch { toast.error("Failed to delete"); }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult({
      eligibilityScore: item.eligibilityScore, riskLevel: item.riskLevel,
      maxLoanAmount: item.maxLoanAmount, recommendedRate: item.recommendedRate,
      aiAnalysis: item.aiAnalysis, recommendations: item.recommendations,
      factors: {
        creditScore: Math.min(100, Math.round((item.creditScore / 900) * 100)),
        incomeStability: 0, debtToIncomeRatio: 0, loanToIncomeRatio: 0, employmentStability: 0,
      },
    });
    setActiveTab("results");
  };

  const handleReset = () => { setResult(null); setActiveTab("check"); };
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };

  // Auth handlers
  const handleLogin = async () => {
    setAuthError("");
    if (!loginEmail.trim() || !loginPassword.trim()) { setAuthError("Email and password are required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) { setAuthError("Please enter a valid email"); return; }
    setAuthSubmitting(true);
    const err = await login(loginEmail, loginPassword);
    setAuthSubmitting(false);
    if (err) { setAuthError(err); } else { setAuthDialog(null); setLoginEmail(""); setLoginPassword(""); toast.success(`Welcome back, ${user?.name || "User"}!`); }
  };

  const handleRegister = async () => {
    setAuthError("");
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirm.trim()) { setAuthError("All fields are required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) { setAuthError("Please enter a valid email"); return; }
    if (regPassword.length < 6) { setAuthError("Password must be at least 6 characters"); return; }
    if (regPassword !== regConfirm) { setAuthError("Passwords do not match"); return; }
    setAuthSubmitting(true);
    const err = await register(regName, regEmail, regPassword, regConfirm);
    setAuthSubmitting(false);
    if (err) { setAuthError(err); } else { setAuthDialog(null); setRegName(""); setRegEmail(""); setRegPassword(""); setRegConfirm(""); toast.success(`Welcome, ${user?.name || "User"}! Account created.`); }
  };

  const handleLogout = () => { logout(); toast.success("Logged out successfully"); };

  const stats = useCountUp(50000, 2500);
  const approvalRate = useCountUp(947, 2500);
  const loanTypesCount = useCountUp(8, 1500);
  const aiAccuracy = useCountUp(973, 2500);

  const lang = locale === "en" ? "EN" : locale === "hi" ? "HI" : "TE";
  const langToLocale = (l: string) => (l === "EN" ? "en" : l === "HI" ? "hi" : "te") as "en" | "hi" | "te";

  const navLinks = [
    { label: t("nav.home"), id: "hero" },
    { label: t("nav.check"), id: "check-section" },
    { label: t("nav.howItWorks"), id: "features-section" },
    { label: t("nav.loanTypes"), id: "loan-types" },
    { label: t("nav.tools"), id: "tools-section" },
    { label: t("nav.rules"), id: "rules-section" },
  ];

  const benefits = [
    { icon: Brain, title: t("benefit.aiAccuracy.title"), desc: t("benefit.aiAccuracy.desc") },
    { icon: Zap, title: t("benefit.instant.title"), desc: t("benefit.instant.desc") },
    { icon: ShieldCheck, title: t("benefit.security.title"), desc: t("benefit.security.desc") },
    { icon: Globe, title: t("benefit.multilang.title"), desc: t("benefit.multilang.desc") },
    { icon: Lightbulb, title: t("benefit.insights.title"), desc: t("benefit.insights.desc") },
    { icon: BadgeDollarSign, title: t("benefit.free.title"), desc: t("benefit.free.desc") },
  ];

  const loanTypesList = [
    { icon: House, title: t("loantypes.home"), desc: t("loantypes.home.desc") },
    { icon: Users, title: t("loantypes.personal"), desc: t("loantypes.personal.desc") },
    { icon: GraduationCap, title: t("loantypes.education"), desc: t("loantypes.education.desc") },
    { icon: Car, title: t("loantypes.vehicle"), desc: t("loantypes.vehicle.desc") },
    { icon: Building2, title: t("loantypes.business"), desc: t("loantypes.business.desc") },
    { icon: Landmark, title: t("loantypes.gold"), desc: t("loantypes.gold.desc") },
    { icon: Wheat, title: t("loantypes.agriculture"), desc: t("loantypes.agriculture.desc") },
    { icon: Heart, title: t("loantypes.medical"), desc: t("loantypes.medical.desc") },
  ];

  const howItWorks = [
    { icon: BarChart3, title: t("how.step1.title"), desc: t("how.step1.desc"), step: "01" },
    { icon: Brain, title: t("how.step2.title"), desc: t("how.step2.desc"), step: "02" },
    { icon: Zap, title: t("how.step3.title"), desc: t("how.step3.desc"), step: "03" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Software Engineer, Bangalore", initials: "PS", color: "oklch(0.75 0.18 200 / 0.2)", textColor: "oklch(0.75 0.18 200)", quote: "LoanIQ gave me a clear picture of my home loan eligibility in under 10 seconds. The AI recommendations helped me improve my credit profile before applying. Highly recommended!" },
    { name: "Rahul Verma", role: "Business Owner, Mumbai", initials: "RV", color: "oklch(0.82 0.16 85 / 0.2)", textColor: "oklch(0.82 0.16 85)", quote: "As a small business owner, understanding loan eligibility was always confusing. LoanIQ simplified everything with its AI analysis. The EMI calculator is a great bonus!" },
    { name: "Anitha Reddy", role: "Student, Hyderabad", initials: "AR", color: "oklch(0.60 0.14 280 / 0.2)", textColor: "oklch(0.70 0.14 280)", quote: "I used LoanIQ to check my education loan eligibility before applying to banks. The detailed factor breakdown showed me exactly what to improve. Got approved on my first application!" },
  ];

  const comparisonRows = [
    [t("tools.comparison.feature"), "8.5% - 10.5%", "10.5% - 18%"],
    ["Max Tenure", "30 Years", "5 Years"],
    ["Max Amount", "\u20B95 Crore", "\u20B940 Lakh"],
    ["Processing Fee", "0.5% - 1%", "1% - 3%"],
    ["Collateral", "Required", "Not Required"],
    ["Disbursal", "7-15 Days", "1-3 Days"],
  ];

  const rules = [
    { value: "terms", icon: FileText, label: t("rules.terms"), content: [
      "By accessing and using LoanIQ (\"the Platform\"), you accept and agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.",
      "1. Eligibility: You must be at least 18 years of age and have the legal capacity to enter into binding agreements.",
      "2. Purpose of Use: LoanIQ provides AI-generated loan eligibility assessments for informational and educational purposes only.",
      "3. Accuracy of Information: You are solely responsible for the accuracy and completeness of the information you provide.",
      "4. Modification of Terms: We reserve the right to modify these terms at any time.",
    ]},
    { value: "privacy", icon: Lock, label: t("rules.privacy"), content: [
      "LoanIQ is committed to protecting your personal and financial information.",
      "1. Data Collection: We collect only the information you voluntarily provide through the eligibility form.",
      "2. Data Storage: All data is stored locally on our secure servers with industry-standard encryption.",
      "3. Data Retention: Your eligibility check history is retained for a maximum of 90 days.",
      "4. Cookies & Tracking: We use minimal, essential cookies for platform functionality only.",
      "5. Your Rights: You have the right to access, correct, delete, or export your personal data.",
    ]},
    { value: "disclaimer", icon: AlertTriangle, label: t("rules.disclaimer"), content: [
      "The information provided by LoanIQ is generated by artificial intelligence and is intended solely for general informational purposes.",
      "1. Not Financial Advice: LoanIQ does not provide financial advice, credit counseling, or loan brokerage services.",
      "2. No Guarantee of Approval: An eligibility score does not guarantee that any financial institution will approve your loan.",
      "3. Accuracy Limitations: AI-generated assessments may contain errors. Interest rates are estimates only.",
      "4. Liability: LoanIQ shall not be held liable for any financial losses or decisions made based on the information provided.",
    ]},
    { value: "ai-methodology", icon: Brain, label: t("rules.aiMethod"), content: [
      "Understanding how our AI evaluates your loan eligibility helps you interpret results accurately.",
      "1. Factors Evaluated: Credit Score, Income Stability, DTI, Loan-to-Income Ratio, and Employment Stability.",
      "2. Scoring Model: The overall eligibility score (0-100) is a weighted composite of all individual factor scores.",
      "3. Risk Classification: Low Risk (80-100), Medium Risk (60-79), High Risk (40-59), Very High Risk (0-39).",
      "4. Rate Estimation: Recommended interest rates are approximate estimates based on the AI assessment.",
    ]},
    { value: "user-responsibilities", icon: Users, label: t("rules.userResp"), content: [
      "As a user of LoanIQ, you acknowledge and accept the following responsibilities.",
      "1. Honest Disclosure: You must provide accurate, current, and complete information.",
      "2. Professional Consultation: You are strongly encouraged to consult with a licensed financial advisor.",
      "3. Account Security: You are responsible for maintaining the confidentiality of your session and device.",
      "4. Fair Use: The Platform is designed for personal, non-commercial use.",
    ]},
    { value: "third-party", icon: Globe, label: t("rules.thirdParty"), content: [
      "We are transparent about any circumstances under which your data may be shared.",
      "1. No Selling of Data: LoanIQ does not sell, trade, or monetize your personal or financial data.",
      "2. Legal Requirements: We may disclose information if required by law or regulation.",
      "3. Platform Providers: Data may be shared with our infrastructure and AI service providers solely for platform functionality.",
      "4. Aggregate Statistics: Anonymized, aggregated data may be used for platform improvement and research.",
    ]},
  ];

  const sideCards = [
    { icon: Shield, title: t("rules.side.compliance"), items: ["Compliant with general data protection principles", "AES-256 encryption for data at rest", "TLS 1.3 for data in transit", "Automated data purging after 90 days", "No third-party data sharing for marketing"] },
    { icon: Eye, title: t("rules.side.rights"), items: ["Right to access your stored data", "Right to request immediate data deletion", "Right to correct inaccurate information", "Right to export your check history", "Right to opt out at any time"] },
    { icon: Database, title: t("rules.side.dataHandling"), items: ["Data stored locally on encrypted servers", "No cloud-based third-party storage", "Session-based processing, no persistent cookies", "Minimal data collection principle applied"] },
  ];

  // Auth dialog shared styles
  const inputStyle = { background: "oklch(0.22 0.035 265)", border: "1px solid oklch(0.30 0.04 265 / 0.4)" };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg glow-cyan" style={{ background: CYAN }}>
              <Shield className="size-5" style={{ color: "oklch(0.13 0.04 265)" }} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Loan<span style={{ color: CYAN }}>IQ</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="transition-colors hover:text-foreground" style={{ color: "oklch(0.65 0.02 220)" }}>
                {link.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER_SUBTLE}` }}>
              {(["EN", "HI", "TE"] as const).map((l) => (
                <button key={l} onClick={() => setLocale(langToLocale(l))} className="px-2.5 py-1 text-xs font-semibold transition-all"
                  style={{ background: lang === l ? `${CYAN} / 0.15` : "transparent", color: lang === l ? CYAN : DIM }}>
                  {l}
                </button>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("nav.welcome")}, {user?.name}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                  style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setAuthDialog("login")} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                  style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>{t("nav.login")}</button>
                <button onClick={() => setAuthDialog("register")} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                  style={{ background: CYAN, color: "oklch(0.13 0.04 265)" }}>{t("nav.register")}</button>
              </>
            )}
          </div>
          <button className="md:hidden p-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden" style={{ borderTop: `1px solid ${BORDER_SUBTLE}` }}>
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <button key={link.id} onClick={() => scrollTo(link.id)} className="block w-full text-left py-2.5 px-3 text-sm rounded-lg transition-colors hover:bg-accent" style={{ color: "oklch(0.65 0.02 220)" }}>
                    {link.label}
                  </button>
                ))}
                <div className="flex items-center gap-2 pt-3 px-3">
                  {(["EN", "HI", "TE"] as const).map((l) => (
                    <button key={l} onClick={() => setLocale(langToLocale(l))} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                      style={{ background: lang === l ? `${CYAN} / 0.15` : "oklch(0.22 0.035 265)", color: lang === l ? CYAN : DIM, border: `1px solid ${lang === l ? `${CYAN} / 0.3` : BORDER_SUBTLE}` }}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 px-3">
                  {isAuthenticated ? (
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-semibold rounded-lg" style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>{t("nav.logout")}</button>
                  ) : (
                    <>
                      <button onClick={() => { setAuthDialog("login"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-semibold rounded-lg" style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>{t("nav.login")}</button>
                      <button onClick={() => { setAuthDialog("register"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-semibold rounded-lg" style={{ background: CYAN, color: "oklch(0.13 0.04 265)" }}>{t("nav.register")}</button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(oklch(0.75_0.18_200/0.03)_1px,transparent_1px),linear-gradient(90deg,oklch(0.75_0.18_200/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.18_200/0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,oklch(0.82_0.16_85/0.05),transparent)]" />
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full animate-float opacity-20" style={{ background: `radial-gradient(circle, ${CYAN} / 0.3, transparent 70%)` }} />
        <div className="absolute bottom-10 right-[15%] w-48 h-48 rounded-full animate-float-delayed opacity-15" style={{ background: `radial-gradient(circle, ${GOLD} / 0.3, transparent 70%)` }} />
        <div className="absolute top-[60%] left-[5%] w-32 h-32 rounded-full animate-pulse-glow opacity-10" style={{ background: "radial-gradient(circle, oklch(0.60 0.14 280 / 0.3), transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-pulse-glow"
                style={{ background: `${CYAN} / 0.1`, color: CYAN, border: `1px solid ${CYAN} / 0.2` }}>
                <Zap className="size-3" />{t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                {t("hero.title1")}{" "}
                <span className="relative text-glow-cyan" style={{ color: CYAN }}>
                  {t("hero.titleHighlight")}
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C47 2 153 2 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ stroke: `${CYAN} / 0.4` }} />
                  </svg>
                </span>{" "}
                {t("hero.title2")}
              </h1>
              <p className="text-base sm:text-lg mt-5 max-w-lg leading-relaxed" style={{ color: "oklch(0.65 0.02 220)" }}>
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button size="lg" className="font-semibold glow-cyan" style={{ background: CYAN, color: "white" }} onClick={() => scrollTo("check-section")}>
                  {t("hero.cta")} <ArrowDown className="size-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="font-semibold" style={{ borderColor: `${CYAN} / 0.3`, color: CYAN }} onClick={() => scrollTo("loan-types")}>
                  {t("hero.learn")}
                </Button>
              </div>
              {isAuthenticated && (
                <div className="mt-6 glass rounded-xl p-4 flex items-center gap-3 max-w-md">
                  <div className="p-2 rounded-lg" style={{ background: `${GOLD} / 0.15` }}>
                    <Sparkles className="size-5" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t("dash.greeting")}, {user?.name}!</p>
                    <p className="text-xs" style={{ color: MUTED }}>{t("dash.startCheck")}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10 text-sm" style={{ color: MUTED }}>
                {[[Lock, t("hero.secure")], [RefreshCcw, t("hero.instant")], [Brain, t("hero.ai")]].map(([Ic, txt]) => (
                  <div key={txt} className="flex items-center gap-2">
                    <Ic className="size-4" style={{ color: CYAN }} /><span>{txt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl glow-cyan">
                <div style={{ border: `1px solid ${CYAN} / 0.15` }} className="rounded-2xl overflow-hidden">
                  <img src="/hero-loan.png" alt="AI Loan Analysis Visualization" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 glass-strong glow-gold rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${GOLD} / 0.15` }}>
                  <TrendingUp className="size-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: MUTED }}>{t("stat.approval")}</p>
                  <p className="text-lg font-bold text-glow-gold" style={{ color: GOLD }}>94.7%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={stats.ref} className="glass rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                [Users, `${stats.count.toLocaleString()}+`, t("stat.users")],
                [TrendingUp, `${(approvalRate.count / 10).toFixed(1)}%`, t("stat.approval")],
                [BarChart3, `${loanTypesCount.count}+`, t("stat.loanTypes")],
                [Target, `${(aiAccuracy.count / 10).toFixed(1)}%`, t("stat.aiAccuracy")],
              ].map(([Ic, val, label]) => (
                <div key={label} className="text-center">
                  <Ic className="size-6 mx-auto mb-2" style={{ color: CYAN }} />
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-glow-cyan" style={{ color: CYAN }}>{val}</p>
                  <p className="text-xs mt-1" style={{ color: DIM }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(CYAN, CYAN, CYAN)}>
              <Sparkles className="size-3" />{t("benefits.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("benefits.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("benefits.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass gradient-border rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: `${CYAN} / 0.1`, border: `1px solid ${CYAN} / 0.15` }}>
                  <item.icon className="size-5" style={{ color: CYAN }} />
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY CHECKER */}
      <section id="check-section" className="py-16 sm:py-20" style={{ background: "oklch(0.15 0.035 265 / 0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(CYAN, CYAN, CYAN)}>
              <Scale className="size-3" />{t("elig.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("elig.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("elig.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="check">{t("elig.tab.form")}</TabsTrigger>
                  <TabsTrigger value="results" disabled={!result}>
                    {t("elig.tab.results")}
                    {result && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: CYAN, color: "oklch(0.13 0.04 265)" }}>{result.eligibilityScore}</span>}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="check">
                  <EligibilityForm onSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="results">
                  <AnimatePresence>{result && <ResultsDashboard result={result} onReset={handleReset} />}</AnimatePresence>
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:col-span-1">
              <HistoryPanel items={history} onSelect={handleSelectHistory} onDelete={handleDeleteHistory} />
            </div>
          </div>
        </div>
      </section>

      {/* LOAN TYPES */}
      <section id="loan-types" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(GOLD, GOLD, GOLD)}>
              <Landmark className="size-3" />{t("loantypes.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("loantypes.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("loantypes.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loanTypesList.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5 group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${CYAN} / 0.15, 0 0 40px ${CYAN} / 0.05`; e.currentTarget.style.borderColor = `${CYAN} / 0.3`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "oklch(0.45 0.15 200 / 0.12)"; }}>
                <div className="p-2.5 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform" style={{ background: `${CYAN} / 0.1`, border: `1px solid ${CYAN} / 0.12` }}>
                  <item.icon className="size-5" style={{ color: CYAN }} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: DIM }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCE TOOLS */}
      <section id="tools-section" className="py-16 sm:py-20" style={{ background: "oklch(0.15 0.035 265 / 0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(CYAN, CYAN, CYAN)}>
              <Calculator className="size-3" />{t("tools.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("tools.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("tools.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <EMICalculator />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="glass gradient-border h-full">
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 rounded-xl" style={{ background: `${GOLD} / 0.1`, border: `1px solid ${GOLD} / 0.15` }}>
                      <BarChart3 className="size-5" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t("tools.comparison.title")}</h3>
                      <p className="text-[11px]" style={{ color: MUTED }}>{t("tools.comparison.subtitle")}</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER_SUBTLE}` }}>
                          <th className="text-left py-2.5 px-3 font-semibold" style={{ color: "oklch(0.65 0.02 220)" }}>{t("tools.comparison.feature")}</th>
                          <th className="text-center py-2.5 px-3 font-semibold" style={{ color: CYAN }}>{t("loantypes.home")}</th>
                          <th className="text-center py-2.5 px-3 font-semibold" style={{ color: GOLD }}>{t("loantypes.personal")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map(([feature, home, personal], idx) => (
                          <tr key={String(feature)} style={{ borderBottom: idx < 5 ? "1px solid oklch(0.30 0.04 265 / 0.3)" : "none" }}>
                            <td className="py-2.5 px-3 font-medium" style={{ color: "oklch(0.75 0.01 200)" }}>{feature}</td>
                            <td className="py-2.5 px-3 text-center" style={{ color: MUTED }}>{home}</td>
                            <td className="py-2.5 px-3 text-center" style={{ color: MUTED }}>{personal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {[CYAN, GOLD].map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        <span className="text-[10px]" style={{ color: DIM }}>{i === 0 ? t("loantypes.home") : t("loantypes.personal")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features-section" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(CYAN, CYAN, CYAN)}>
              <Zap className="size-3" />{t("how.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("how.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("how.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((f, i) => (
              <motion.div key={f.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <Card className="glass gradient-border h-full hover:scale-[1.02] transition-transform duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl" style={{ background: `${CYAN} / 0.1`, border: `1px solid ${CYAN} / 0.12` }}>
                        <f.icon className="size-5" style={{ color: CYAN }} />
                      </div>
                      <span className="text-3xl font-bold" style={{ color: `${CYAN} / 0.08` }}>{f.step}</span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20" style={{ background: "oklch(0.15 0.035 265 / 0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(GOLD, GOLD, GOLD)}>
              <MessageSquareText className="size-3" />{t("testimonials.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("testimonials.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("testimonials.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <motion.div key={tm.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass gradient-border rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="size-4 fill-current" style={{ color: GOLD }} />
                  ))}
                </div>
                <Quote className="size-6 mb-3 opacity-30" style={{ color: CYAN }} />
                <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.70 0.01 200)" }}>{tm.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: tm.color, color: tm.textColor }}>{tm.initials}</div>
                  <div>
                    <p className="text-sm font-semibold">{tm.name}</p>
                    <p className="text-xs" style={{ color: DIM }}>{tm.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES & REGULATIONS */}
      <section id="rules-section" className="py-16 sm:py-20" style={{ background: "oklch(0.15 0.035 265 / 0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={badgeStyle(CYAN, CYAN, CYAN)}>
              <Scale className="size-3" />{t("rules.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("rules.title")}</h2>
            <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{t("rules.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card className="glass">
                <CardContent className="p-0">
                  <Accordion type="multiple" className="px-6">
                    {rules.map((rule) => (
                      <AccordionItem key={rule.value} value={rule.value}>
                        <AccordionTrigger className="text-base font-semibold gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md" style={{ background: `${CYAN} / 0.1` }}>
                              <rule.icon className="size-3.5" style={{ color: CYAN }} />
                            </div>
                            {rule.label}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="leading-relaxed space-y-3" style={{ color: MUTED }}>
                          {rule.content.map((p, pi) => {
                            const bold = p.split(": ");
                            const isBold = bold.length > 1 && bold[0].match(/^\d+\.\s/);
                            return <p key={pi}>{isBold ? <><strong className="text-foreground">{bold[0]}:</strong>{bold.slice(1).join(": ")}</> : p}</p>;
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {sideCards.map((sc, i) => (
                <motion.div key={sc.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass hover:scale-[1.01] transition-transform duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl" style={{ background: `${CYAN} / 0.1`, border: `1px solid ${CYAN} / 0.12` }}>
                          <sc.icon className="size-5" style={{ color: CYAN }} />
                        </div>
                        <h3 className="font-semibold">{sc.title}</h3>
                      </div>
                      <ul className="space-y-2.5 text-sm" style={{ color: MUTED }}>
                        {sc.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: CYAN }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass-strong mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md" style={{ background: CYAN }}>
                <Shield className="size-3.5" style={{ color: "oklch(0.13 0.04 265)" }} />
              </div>
              <span className="text-sm font-semibold">Loan<span style={{ color: CYAN }}>IQ</span></span>
            </div>
            <p className="text-xs text-center max-w-sm" style={{ color: "oklch(0.50 0.02 220)" }}>
              {t("footer.disclaimer")}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.50 0.02 220)" }}>
              &copy; {new Date().getFullYear()} LoanIQ. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>

      {/* LOGIN DIALOG */}
      <Dialog open={authDialog === "login"} onOpenChange={(open) => { if (!open) { setAuthDialog(null); setAuthError(""); } }}>
        <DialogContent className="sm:max-w-md" style={{ background: "oklch(0.16 0.04 265)", border: `1px solid ${BORDER_SUBTLE}` }}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{ color: CYAN }}>{t("auth.loginTitle")}</DialogTitle>
            <DialogDescription className="text-sm" style={{ color: MUTED }}>{t("auth.loginSubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {authError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "oklch(0.5 0.18 25 / 0.15)", color: "oklch(0.75 0.18 25)" }}>{authError}</p>}
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.email")}</Label>
              <Input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")} className="h-10 text-sm" style={inputStyle}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.password")}</Label>
              <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")} className="h-10 text-sm" style={inputStyle}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
            </div>
            <Button onClick={handleLogin} disabled={authSubmitting} className="w-full h-10 font-semibold mt-2"
              style={{ background: CYAN, color: "white" }}>
              {authSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" />{t("auth.loginLoading")}</> : t("auth.loginBtn")}
            </Button>
            <p className="text-xs text-center" style={{ color: DIM }}>
              {t("auth.noAccount")} {" "}
              <button onClick={() => { setAuthDialog("register"); setAuthError(""); }} className="font-semibold underline" style={{ color: CYAN }}>{t("auth.registerLink")}</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* REGISTER DIALOG */}
      <Dialog open={authDialog === "register"} onOpenChange={(open) => { if (!open) { setAuthDialog(null); setAuthError(""); } }}>
        <DialogContent className="sm:max-w-md" style={{ background: "oklch(0.16 0.04 265)", border: `1px solid ${BORDER_SUBTLE}` }}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{ color: CYAN }}>{t("auth.registerTitle")}</DialogTitle>
            <DialogDescription className="text-sm" style={{ color: MUTED }}>{t("auth.registerSubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {authError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "oklch(0.5 0.18 25 / 0.15)", color: "oklch(0.75 0.18 25)" }}>{authError}</p>}
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.name")}</Label>
              <Input value={regName} onChange={(e) => setRegName(e.target.value)}
                placeholder={t("auth.namePlaceholder")} className="h-10 text-sm" style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.email")}</Label>
              <Input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")} className="h-10 text-sm" style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.password")}</Label>
              <Input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")} className="h-10 text-sm" style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: "oklch(0.70 0.01 200)" }}>{t("auth.confirmPassword")}</Label>
              <Input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                placeholder={t("auth.confirmPasswordPlaceholder")} className="h-10 text-sm" style={inputStyle}
                onKeyDown={(e) => { if (e.key === "Enter") handleRegister(); }} />
            </div>
            <Button onClick={handleRegister} disabled={authSubmitting} className="w-full h-10 font-semibold mt-2"
              style={{ background: CYAN, color: "white" }}>
              {authSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" />{t("auth.registerLoading")}</> : t("auth.registerBtn")}
            </Button>
            <p className="text-xs text-center" style={{ color: DIM }}>
              {t("auth.hasAccount")} {" "}
              <button onClick={() => { setAuthDialog("login"); setAuthError(""); }} className="font-semibold underline" style={{ color: CYAN }}>{t("auth.loginLink")}</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Chatbot />
    </div>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <MainContent />
    </LocaleProvider>
  );
}
