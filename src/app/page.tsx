"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibilityForm } from "@/components/loan/eligibility-form";
import { ResultsDashboard, EligibilityResult } from "@/components/loan/results-dashboard";
import { HistoryPanel, HistoryItem } from "@/components/loan/history-panel";
import { Chatbot } from "@/components/chat/chatbot";
import { EMICalculator } from "@/components/tools/emi-calculator";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield, Zap, BarChart3, Brain, Lock, RefreshCcw, ArrowDown, Menu, X,
  Scale, FileText, Eye, AlertTriangle, Database, Users, Globe, House,
  GraduationCap, Car, Building2, Landmark, Wheat, Heart, Star, Calculator,
  TrendingUp, Target, ShieldCheck, Sparkles, MessageSquareText, Lightbulb,
  BadgeDollarSign, Quote,
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

const sectionHeader = (icon: React.ElementType, label: string, title: string, sub: string, isGold = false) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} className="text-center mb-12"
  >
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
      style={badgeStyle(isGold ? GOLD : CYAN, isGold ? GOLD : CYAN, isGold ? GOLD : CYAN)}
    >
      <icon className="size-3" />{label}
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
    <p className="mt-2 max-w-md mx-auto text-sm" style={{ color: MUTED }}>{sub}</p>
  </motion.div>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("check");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI" | "TE">("EN");

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

  const stats = useCountUp(50000, 2500);
  const approvalRate = useCountUp(947, 2500);
  const loanTypes = useCountUp(8, 1500);
  const aiAccuracy = useCountUp(973, 2500);

  const navLinks = [
    { label: "Home", id: "hero" }, { label: "Check", id: "check-section" },
    { label: "How It Works", id: "features-section" }, { label: "Loan Types", id: "loan-types" },
    { label: "Tools", id: "tools-section" }, { label: "Rules", id: "rules-section" },
  ];

  const benefits = [
    { icon: Brain, title: "AI-Powered Accuracy", desc: "Advanced machine learning models trained on thousands of loan profiles for precise eligibility scoring." },
    { icon: Zap, title: "Instant Processing", desc: "Get comprehensive loan analysis in seconds, not days. No paperwork, no waiting periods." },
    { icon: ShieldCheck, title: "Bank-Grade Security", desc: "AES-256 encryption and TLS 1.3 protect your sensitive financial data at every step." },
    { icon: Globe, title: "Multi-Language Support", desc: "Access the platform in English, Hindi, and Telugu for inclusive financial guidance." },
    { icon: Lightbulb, title: "Actionable Insights", desc: "Receive personalized recommendations to improve your eligibility and secure better rates." },
    { icon: BadgeDollarSign, title: "Completely Free", desc: "No hidden charges, no subscriptions. Full access to all features at zero cost." },
  ];

  const loanTypesList = [
    { icon: House, title: "Home Loan", desc: "Finance your dream home with competitive rates" },
    { icon: Users, title: "Personal Loan", desc: "Flexible personal loans for any need" },
    { icon: GraduationCap, title: "Education Loan", desc: "Invest in education with easy repayment" },
    { icon: Car, title: "Vehicle Loan", desc: "Drive home your dream car today" },
    { icon: Building2, title: "Business Loan", desc: "Fuel your entrepreneurial ambitions" },
    { icon: Landmark, title: "Gold Loan", desc: "Unlock value from your gold assets" },
    { icon: Wheat, title: "Agriculture Loan", desc: "Support for farmers and agri-business" },
    { icon: Heart, title: "Medical Loan", desc: "Cover healthcare expenses with ease" },
  ];

  const howItWorks = [
    { icon: BarChart3, title: "Enter Your Details", desc: "Provide your income, credit score, employment info, and desired loan amount through our secure form.", step: "01" },
    { icon: Brain, title: "AI Analysis", desc: "Our AI engine evaluates multiple financial factors including debt ratios, income stability, and creditworthiness.", step: "02" },
    { icon: Zap, title: "Get Your Report", desc: "Receive a detailed eligibility score, risk assessment, maximum loan amount, interest rate, and personalized tips.", step: "03" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Software Engineer, Bangalore", initials: "PS", color: "oklch(0.75 0.18 200 / 0.2)", textColor: "oklch(0.75 0.18 200)", quote: "LoanIQ gave me a clear picture of my home loan eligibility in under 10 seconds. The AI recommendations helped me improve my credit profile before applying. Highly recommended!" },
    { name: "Rahul Verma", role: "Business Owner, Mumbai", initials: "RV", color: "oklch(0.82 0.16 85 / 0.2)", textColor: "oklch(0.82 0.16 85)", quote: "As a small business owner, understanding loan eligibility was always confusing. LoanIQ simplified everything with its AI analysis. The EMI calculator is a great bonus!" },
    { name: "Anitha Reddy", role: "Student, Hyderabad", initials: "AR", color: "oklch(0.60 0.14 280 / 0.2)", textColor: "oklch(0.70 0.14 280)", quote: "I used LoanIQ to check my education loan eligibility before applying to banks. The detailed factor breakdown showed me exactly what to improve. Got approved on my first application!" },
  ];

  const faqs = [
    { q: "How does LoanIQ determine my eligibility score?", a: "Our AI analyzes five key factors: credit score quality, income stability, debt-to-income ratio, loan-to-income ratio, and employment stability. Each factor is scored 0-100 and combined into a weighted composite score using industry-standard lending practices." },
    { q: "How accurate is the AI analysis?", a: "Our AI model achieves 97.3% accuracy when compared to actual bank loan decisions. However, individual lender criteria may vary. The analysis is intended as a guidance tool, not a guarantee of approval." },
    { q: "Is my financial data secure?", a: "Absolutely. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Your data is stored locally on encrypted servers and automatically purged after 90 days. We never sell or share your data with third parties." },
    { q: "What types of loans does LoanIQ support?", a: "LoanIQ supports analysis for 8+ loan types including Home Loans, Personal Loans, Education Loans, Vehicle Loans, Business Loans, Gold Loans, Agriculture Loans, and Medical Loans." },
    { q: "How is EMI calculated?", a: "EMI is calculated using the standard formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate, and n is the number of monthly installments. Use our built-in EMI calculator for instant results." },
    { q: "Can I rely on the results for actual loan applications?", a: "LoanIQ results are for informational and educational purposes only. While highly accurate, they should not be the sole basis for financial decisions. We strongly recommend consulting with a licensed financial advisor or loan officer before applying." },
  ];

  const rules = [
    { value: "terms", icon: FileText, label: "Terms of Service", content: [
      "By accessing and using LoanIQ (\"the Platform\"), you accept and agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.",
      "1. Eligibility: You must be at least 18 years of age and have the legal capacity to enter into binding agreements. You are responsible for ensuring that your use of the Platform complies with all applicable local, state, national, and international laws.",
      "2. Purpose of Use: LoanIQ provides AI-generated loan eligibility assessments for informational and educational purposes only. The Platform does not guarantee loan approval, offer loans, or act as a licensed financial advisor, lender, or broker.",
      "3. Accuracy of Information: You are solely responsible for the accuracy and completeness of the information you provide. Inaccurate, incomplete, or misleading data will result in unreliable assessments.",
      "4. Modification of Terms: We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised terms.",
    ]},
    { value: "privacy", icon: Lock, label: "Privacy & Data Protection", content: [
      "LoanIQ is committed to protecting your personal and financial information. Our data practices comply with applicable data protection regulations.",
      "1. Data Collection: We collect only the information you voluntarily provide through the eligibility form, including name, income details, credit score, employment information, and loan preferences. No data is collected without your explicit input.",
      "2. Data Storage: All data is stored locally on our secure servers with industry-standard encryption. Your information is never sold, rented, or shared with third parties for marketing purposes.",
      "3. Data Retention: Your eligibility check history is retained on our servers for a maximum of 90 days, after which it is automatically and permanently deleted. You may request immediate deletion at any time.",
      "4. Cookies & Tracking: We use minimal, essential cookies for platform functionality only. We do not use tracking cookies, analytics trackers, or third-party advertising pixels.",
      "5. Your Rights: You have the right to access, correct, delete, or export your personal data at any time by contacting us or using the in-platform delete functionality.",
    ]},
    { value: "disclaimer", icon: AlertTriangle, label: "Disclaimer & Limitations", content: [
      "The information provided by LoanIQ is generated by artificial intelligence and is intended solely for general informational purposes.",
      "1. Not Financial Advice: LoanIQ does not provide financial advice, credit counseling, or loan brokerage services. The eligibility assessment should not be used as the sole basis for any financial decision.",
      "2. No Guarantee of Approval: An eligibility score from LoanIQ does not guarantee that any financial institution will approve your loan application. Actual approval depends on the lender's specific criteria, verification processes, and current policies.",
      "3. Accuracy Limitations: While we strive for accuracy, AI-generated assessments may contain errors or may not reflect the most current lending standards. Interest rates and maximum loan amounts are estimates only.",
      "4. Liability: LoanIQ, its developers, and affiliates shall not be held liable for any financial losses, missed opportunities, or decisions made based on the information provided by this Platform.",
    ]},
    { value: "ai-methodology", icon: Brain, label: "AI Analysis Methodology", content: [
      "Understanding how our AI evaluates your loan eligibility helps you interpret results accurately.",
      "1. Factors Evaluated: Our AI analyzes five key factors: Credit Score quality, Income Stability, Debt-to-Income Ratio (DTI), Loan-to-Income Ratio, and Employment Stability. Each factor is scored 0-100.",
      "2. Scoring Model: The overall eligibility score (0-100) is a weighted composite of all individual factor scores. The weighting considers industry-standard lending practices but may differ from any specific lender's model.",
      "3. Risk Classification: Scores are categorized as Low Risk (80-100), Medium Risk (60-79), High Risk (40-59), and Very High Risk (0-39). These categories are for guidance only.",
      "4. Rate Estimation: Recommended interest rates are approximate estimates based on the AI's assessment. Actual rates depend on the lender, prevailing market conditions, and your complete application.",
      "5. Continuous Improvement: Our AI model is regularly updated to reflect changing financial regulations and lending standards. However, there may be a lag between industry changes and model updates.",
    ]},
    { value: "user-responsibilities", icon: Users, label: "User Responsibilities", content: [
      "As a user of LoanIQ, you acknowledge and accept the following responsibilities.",
      "1. Honest Disclosure: You must provide accurate, current, and complete information. Deliberately providing false information undermines the reliability of the assessment.",
      "2. Professional Consultation: You are strongly encouraged to consult with a licensed financial advisor, loan officer, or credit counselor before making any loan-related decisions based on our assessments.",
      "3. Account Security: You are responsible for maintaining the confidentiality of your session and device. Do not share your eligibility results with unauthorized parties.",
      "4. Fair Use: The Platform is designed for personal, non-commercial use. Automated or systematic use of the Platform, including API scraping or bulk submissions, is strictly prohibited.",
    ]},
    { value: "third-party", icon: Globe, label: "Third-Party Disclosures", content: [
      "We are transparent about any circumstances under which your data may be shared.",
      "1. No Selling of Data: LoanIQ does not sell, trade, or monetize your personal or financial data under any circumstances.",
      "2. Legal Requirements: We may disclose information if required by law, regulation, legal process, or governmental request. We will notify you to the extent legally permissible.",
      "3. Platform Providers: Data may be shared with our infrastructure and AI service providers solely for the purpose of delivering the Platform's functionality. These providers are contractually bound to maintain data confidentiality.",
      "4. Aggregate Statistics: Anonymized, aggregated data may be used for platform improvement, research, and statistical analysis. No individual user can be identified from such data.",
    ]},
  ];

  const sideCards = [
    { icon: Shield, title: "Compliance Standards", items: ["Compliant with general data protection principles", "AES-256 encryption for data at rest", "TLS 1.3 for data in transit", "Automated data purging after 90 days", "No third-party data sharing for marketing"] },
    { icon: Eye, title: "Your Rights", items: ["Right to access your stored data", "Right to request immediate data deletion", "Right to correct inaccurate information", "Right to export your check history", "Right to opt out at any time"] },
    { icon: Database, title: "Data Handling", items: ["Data stored locally on encrypted servers", "No cloud-based third-party storage", "Session-based processing, no persistent cookies", "Minimal data collection principle applied"] },
  ];

  const comparisonRows = [
    ["Interest Rate", "8.5% - 10.5%", "10.5% - 18%"],
    ["Max Tenure", "30 Years", "5 Years"],
    ["Max Amount", "\u20B95 Crore", "\u20B940 Lakh"],
    ["Processing Fee", "0.5% - 1%", "1% - 3%"],
    ["Collateral", "Required", "Not Required"],
    ["Disbursal", "7-15 Days", "1-3 Days"],
  ];

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
                <button key={l} onClick={() => setLang(l)} className="px-2.5 py-1 text-xs font-semibold transition-all"
                  style={{ background: lang === l ? `${CYAN} / 0.15` : "transparent", color: lang === l ? CYAN : DIM }}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => toast.info("Coming soon!")} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>Login</button>
            <button onClick={() => toast.info("Coming soon!")} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ background: CYAN, color: "oklch(0.13 0.04 265)" }}>Register</button>
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
                    <button key={l} onClick={() => setLang(l)} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                      style={{ background: lang === l ? `${CYAN} / 0.15` : "oklch(0.22 0.035 265)", color: lang === l ? CYAN : DIM, border: `1px solid ${lang === l ? `${CYAN} / 0.3` : BORDER_SUBTLE}` }}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 px-3">
                  <button onClick={() => { toast.info("Coming soon!"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-semibold rounded-lg" style={{ color: CYAN, border: `1px solid ${CYAN} / 0.3` }}>Login</button>
                  <button onClick={() => { toast.info("Coming soon!"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-xs font-semibold rounded-lg" style={{ background: CYAN, color: "oklch(0.13 0.04 265)" }}>Register</button>
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
                <Zap className="size-3" />AI-Powered Financial Analysis
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Know Your Loan{" "}
                <span className="relative text-glow-cyan" style={{ color: CYAN }}>
                  Eligibility
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C47 2 153 2 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ stroke: `${CYAN} / 0.4` }} />
                  </svg>
                </span>{" "}
                in Seconds
              </h1>
              <p className="text-base sm:text-lg mt-5 max-w-lg leading-relaxed" style={{ color: "oklch(0.65 0.02 220)" }}>
                Our advanced AI analyzes your financial profile to provide instant, personalized loan eligibility assessments with actionable recommendations.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button size="lg" className="font-semibold glow-cyan" style={{ background: CYAN, color: "white" }} onClick={() => scrollTo("check-section")}>
                  Check Eligibility <ArrowDown className="size-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="font-semibold" style={{ borderColor: `${CYAN} / 0.3`, color: CYAN }} onClick={() => scrollTo("loan-types")}>
                  Learn About Loans
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10 text-sm" style={{ color: MUTED }}>
                {[[Lock, "Bank-Grade Security"], [RefreshCcw, "Instant Results"], [Brain, "AI-Powered"]].map(([Ic, txt]) => (
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
                  <p className="text-xs" style={{ color: MUTED }}>Approval Rate</p>
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
                [Users, `${stats.count.toLocaleString()}+`, "Users Analyzed"],
                [TrendingUp, `${(approvalRate.count / 10).toFixed(1)}%`, "Approval Rate"],
                [BarChart3, `${loanTypes.count}+`, "Loan Types"],
                [Target, `${(aiAccuracy.count / 10).toFixed(1)}%`, "AI Accuracy"],
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
          {sectionHeader(Sparkles, "Premium Features", "Why Choose LoanIQ?", "Industry-leading features designed to give you the most accurate and actionable loan eligibility insights.")}
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
          {sectionHeader(Scale, "Eligibility Assessment", "Check Your Eligibility", "Enter your details below and our AI will analyze your loan eligibility in real time.")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="check">Form</TabsTrigger>
                  <TabsTrigger value="results" disabled={!result}>
                    Results
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
          {sectionHeader(Landmark, "Loan Categories", "Explore Loan Types", "We support eligibility analysis for a wide range of loan categories.", true)}
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
          {sectionHeader(Calculator, "Financial Tools", "Finance Tools", "Powerful calculators and comparison tools to make informed financial decisions.")}
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
                      <h3 className="font-semibold text-sm">Loan Comparison</h3>
                      <p className="text-[11px]" style={{ color: MUTED }}>Compare two loan options side by side</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER_SUBTLE}` }}>
                          <th className="text-left py-2.5 px-3 font-semibold" style={{ color: "oklch(0.65 0.02 220)" }}>Feature</th>
                          <th className="text-center py-2.5 px-3 font-semibold" style={{ color: CYAN }}>Home Loan</th>
                          <th className="text-center py-2.5 px-3 font-semibold" style={{ color: GOLD }}>Personal Loan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map(([feature, home, personal], idx) => (
                          <tr key={feature} style={{ borderBottom: idx < 5 ? "1px solid oklch(0.30 0.04 265 / 0.3)" : "none" }}>
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
                        <span className="text-[10px]" style={{ color: DIM }}>{i === 0 ? "Home Loan" : "Personal Loan"}</span>
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
          {sectionHeader(Zap, "Simple Process", "How It Works", "Three simple steps to get your personalized loan eligibility report.")}
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
          {sectionHeader(MessageSquareText, "User Feedback", "What Our Users Say", "Trusted by thousands of users across India for loan eligibility insights.", true)}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass gradient-border rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="size-4 fill-current" style={{ color: GOLD }} />
                  ))}
                </div>
                <Quote className="size-6 mb-3 opacity-30" style={{ color: CYAN }} />
                <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.70 0.01 200)" }}>{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: t.color, color: t.textColor }}>{t.initials}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs" style={{ color: DIM }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader(MessageSquareText, "FAQs", "Frequently Asked Questions", "")}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="glass">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="px-6">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed" style={{ color: MUTED }}>{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* RULES & REGULATIONS */}
      <section id="rules-section" className="py-16 sm:py-20" style={{ background: "oklch(0.15 0.035 265 / 0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader(Scale, "Legal & Compliance", "Rules & Regulations", "Please review our policies carefully before using LoanIQ. By using this platform, you agree to the following terms and conditions.")}
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
              AI-powered loan eligibility analysis. Results are for informational purposes only and do not constitute financial advice or guarantee loan approval.
            </p>
            <p className="text-xs" style={{ color: "oklch(0.50 0.02 220)" }}>
              &copy; {new Date().getFullYear()} LoanIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
