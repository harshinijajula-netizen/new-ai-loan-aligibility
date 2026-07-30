"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EligibilityForm } from "@/components/loan/eligibility-form";
import {
  ResultsDashboard,
  EligibilityResult,
} from "@/components/loan/results-dashboard";
import {
  HistoryPanel,
  HistoryItem,
} from "@/components/loan/history-panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Zap,
  BarChart3,
  Brain,
  Lock,
  RefreshCcw,
  ArrowDown,
  Menu,
  X,
  Scale,
  FileText,
  Eye,
  AlertTriangle,
  Database,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = {
  applicantName: string;
  monthlyIncome: string;
  creditScore: string;
  loanAmount: string;
  loanTenure: string;
  employmentType: string;
  existingDebt: string;
  loanPurpose: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("check");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const analysisResult = await res.json();
      setResult(analysisResult);
      setActiveTab("results");
      toast.success("AI analysis complete!");
      fetchHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast.success("Record deleted");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult({
      eligibilityScore: item.eligibilityScore,
      riskLevel: item.riskLevel,
      maxLoanAmount: item.maxLoanAmount,
      recommendedRate: item.recommendedRate,
      aiAnalysis: item.aiAnalysis,
      recommendations: item.recommendations,
      factors: {
        creditScore: Math.min(100, Math.round((item.creditScore / 900) * 100)),
        incomeStability: 0,
        debtToIncomeRatio: 0,
        loanToIncomeRatio: 0,
        employmentStability: 0,
      },
    });
    setActiveTab("results");
  };

  const handleReset = () => {
    setResult(null);
    setActiveTab("check");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Shield className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Loan<span className="text-primary">IQ</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => scrollTo("hero")} className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </button>
            <button onClick={() => scrollTo("check-section")} className="text-muted-foreground hover:text-foreground transition-colors">
              Check Eligibility
            </button>
            <button onClick={() => scrollTo("features-section")} className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo("rules-section")} className="text-muted-foreground hover:text-foreground transition-colors">
              Rules & Regulations
            </button>
          </nav>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-2">
            <button onClick={() => scrollTo("hero")} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">Home</button>
            <button onClick={() => scrollTo("check-section")} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">Check Eligibility</button>
            <button onClick={() => scrollTo("features-section")} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">How It Works</button>
            <button onClick={() => scrollTo("rules-section")} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">Rules & Regulations</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-amber-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(217,119,6,0.1),transparent)]" />
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
                <Zap className="size-3" />
                AI-Powered Financial Analysis
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Know Your Loan{" "}
                <span className="text-primary relative">
                  Eligibility
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none"><path d="M1 5.5C47 2 153 2 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/40" /></svg>
                </span>{" "}
                in Seconds
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-5 max-w-lg leading-relaxed">
                Our advanced AI analyzes your financial profile to provide
                instant, personalized loan eligibility assessments with
                actionable recommendations.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button
                  size="lg"
                  className="font-semibold shadow-md"
                  onClick={() => scrollTo("check-section")}
                >
                  Check Now
                  <ArrowDown className="size-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollTo("rules-section")}
                >
                  View Regulations
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="size-4 text-primary" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10">
                <img
                  src="/hero-loan.png"
                  alt="AI Loan Analysis Visualization"
                  className="w-full h-auto object-cover"
                />\n                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-primary/10 rounded-xl shadow-lg p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approval Rate</p>
                  <p className="text-lg font-bold text-primary">94.7%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content: Eligibility Checker */}
      <section id="check-section" className="py-12 sm:py-16 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/15">
              <Scale className="size-3" />
              Eligibility Assessment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Check Your Eligibility
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
              Enter your details below and our AI will analyze your loan eligibility in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="check">Eligibility Form</TabsTrigger>
                  <TabsTrigger value="results" disabled={!result}>
                    Results
                    {result && (
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                        {result.eligibilityScore}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="check">
                  <EligibilityForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="results">
                  <AnimatePresence>
                    {result && (
                      <ResultsDashboard
                        result={result}
                        onReset={handleReset}
                      />
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <HistoryPanel
                items={history}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features-section" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/15">
              <Zap className="size-3" />
              Simple Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
              Three simple steps to get your personalized loan eligibility report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Enter Your Details",
                description:
                  "Provide your income, credit score, employment info, and desired loan amount through our secure form.",
                step: "01",
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description:
                  "Our AI engine evaluates multiple financial factors including debt ratios, income stability, and creditworthiness.",
                step: "02",
              },
              {
                icon: Zap,
                title: "Get Your Report",
                description:
                  "Receive a detailed eligibility score, risk assessment, maximum loan amount, interest rate, and personalized tips.",
                step: "03",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="h-full hover:shadow-md hover:border-primary/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/10">
                        <feature.icon className="size-5 text-primary" />
                      </div>
                      <span className="text-3xl font-bold text-primary/8">
                        {feature.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules & Regulations Section */}
      <section id="rules-section" className="py-16 sm:py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/15">
              <Scale className="size-3" />
              Legal & Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Rules & Regulations
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
              Please review our policies carefully before using LoanIQ. By using this platform, you agree to the following terms and conditions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Accordion */}
            <div className="lg:col-span-3">
              <Card className="border-primary/10">
                <CardContent className="p-0">
                  <Accordion type="multiple" className="px-6">
                    <AccordionItem value="terms">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <FileText className="size-3.5 text-primary" />
                          </div>
                          Terms of Service
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>By accessing and using LoanIQ ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.</p>
                        <p><strong className="text-foreground">1. Eligibility:</strong> You must be at least 18 years of age and have the legal capacity to enter into binding agreements. You are responsible for ensuring that your use of the Platform complies with all applicable local, state, national, and international laws.</p>
                        <p><strong className="text-foreground">2. Purpose of Use:</strong> LoanIQ provides AI-generated loan eligibility assessments for informational and educational purposes only. The Platform does not guarantee loan approval, offer loans, or act as a licensed financial advisor, lender, or broker.</p>
                        <p><strong className="text-foreground">3. Accuracy of Information:</strong> You are solely responsible for the accuracy and completeness of the information you provide. Inaccurate, incomplete, or misleading data will result in unreliable assessments.</p>
                        <p><strong className="text-foreground">4. Modification of Terms:</strong> We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised terms.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="privacy">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Lock className="size-3.5 text-primary" />
                          </div>
                          Privacy & Data Protection
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>LoanIQ is committed to protecting your personal and financial information. Our data practices comply with applicable data protection regulations.</p>
                        <p><strong className="text-foreground">1. Data Collection:</strong> We collect only the information you voluntarily provide through the eligibility form, including name, income details, credit score, employment information, and loan preferences. No data is collected without your explicit input.</p>
                        <p><strong className="text-foreground">2. Data Storage:</strong> All data is stored locally on our secure servers with industry-standard encryption. Your information is never sold, rented, or shared with third parties for marketing purposes.</p>
                        <p><strong className="text-foreground">3. Data Retention:</strong> Your eligibility check history is retained on our servers for a maximum of 90 days, after which it is automatically and permanently deleted. You may request immediate deletion at any time.</p>
                        <p><strong className="text-foreground">4. Cookies & Tracking:</strong> We use minimal, essential cookies for platform functionality only. We do not use tracking cookies, analytics trackers, or third-party advertising pixels.</p>
                        <p><strong className="text-foreground">5. Your Rights:</strong> You have the right to access, correct, delete, or export your personal data at any time by contacting us or using the in-platform delete functionality.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="disclaimer">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <AlertTriangle className="size-3.5 text-primary" />
                          </div>
                          Disclaimer & Limitations
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>The information provided by LoanIQ is generated by artificial intelligence and is intended solely for general informational purposes.</p>
                        <p><strong className="text-foreground">1. Not Financial Advice:</strong> LoanIQ does not provide financial advice, credit counseling, or loan brokerage services. The eligibility assessment should not be used as the sole basis for any financial decision.</p>
                        <p><strong className="text-foreground">2. No Guarantee of Approval:</strong> An eligibility score from LoanIQ does not guarantee that any financial institution will approve your loan application. Actual approval depends on the lender&apos;s specific criteria, verification processes, and current policies.</p>
                        <p><strong className="text-foreground">3. Accuracy Limitations:</strong> While we strive for accuracy, AI-generated assessments may contain errors or may not reflect the most current lending standards. Interest rates and maximum loan amounts are estimates only.</p>
                        <p><strong className="text-foreground">4. Liability:</strong> LoanIQ, its developers, and affiliates shall not be held liable for any financial losses, missed opportunities, or decisions made based on the information provided by this Platform.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="ai-methodology">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Brain className="size-3.5 text-primary" />
                          </div>
                          AI Analysis Methodology
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>Understanding how our AI evaluates your loan eligibility helps you interpret results accurately.</p>
                        <p><strong className="text-foreground">1. Factors Evaluated:</strong> Our AI analyzes five key factors: Credit Score quality, Income Stability, Debt-to-Income Ratio (DTI), Loan-to-Income Ratio, and Employment Stability. Each factor is scored 0-100.</p>
                        <p><strong className="text-foreground">2. Scoring Model:</strong> The overall eligibility score (0-100) is a weighted composite of all individual factor scores. The weighting considers industry-standard lending practices but may differ from any specific lender&apos;s model.</p>
                        <p><strong className="text-foreground">3. Risk Classification:</strong> Scores are categorized as Low Risk (80-100), Medium Risk (60-79), High Risk (40-59), and Very High Risk (0-39). These categories are for guidance only.</p>
                        <p><strong className="text-foreground">4. Rate Estimation:</strong> Recommended interest rates are approximate estimates based on the AI&apos;s assessment. Actual rates depend on the lender, prevailing market conditions, and your complete application.</p>
                        <p><strong className="text-foreground">5. Continuous Improvement:</strong> Our AI model is regularly updated to reflect changing financial regulations and lending standards. However, there may be a lag between industry changes and model updates.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="user-responsibilities">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Users className="size-3.5 text-primary" />
                          </div>
                          User Responsibilities
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>As a user of LoanIQ, you acknowledge and accept the following responsibilities.</p>
                        <p><strong className="text-foreground">1. Honest Disclosure:</strong> You must provide accurate, current, and complete information. Deliberately providing false information undermines the reliability of the assessment.</p>
                        <p><strong className="text-foreground">2. Professional Consultation:</strong> You are strongly encouraged to consult with a licensed financial advisor, loan officer, or credit counselor before making any loan-related decisions based on our assessments.</p>
                        <p><strong className="text-foreground">3. Account Security:</strong> You are responsible for maintaining the confidentiality of your session and device. Do not share your eligibility results with unauthorized parties.</p>
                        <p><strong className="text-foreground">4. Fair Use:</strong> The Platform is designed for personal, non-commercial use. Automated or systematic use of the Platform, including API scraping or bulk submissions, is strictly prohibited.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="third-party">
                      <AccordionTrigger className="text-base font-semibold gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Globe className="size-3.5 text-primary" />
                          </div>
                          Third-Party Disclosures
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                        <p>We are transparent about any circumstances under which your data may be shared.</p>
                        <p><strong className="text-foreground">1. No Selling of Data:</strong> LoanIQ does not sell, trade, or monetize your personal or financial data under any circumstances.</p>
                        <p><strong className="text-foreground">2. Legal Requirements:</strong> We may disclose information if required by law, regulation, legal process, or governmental request. We will notify you to the extent legally permissible.</p>
                        <p><strong className="text-foreground">3. Platform Providers:</strong> Data may be shared with our infrastructure and AI service providers solely for the purpose of delivering the Platform&apos;s functionality. These providers are contractually bound to maintain data confidentiality.</p>
                        <p><strong className="text-foreground">4. Aggregate Statistics:</strong> Anonymized, aggregated data may be used for platform improvement, research, and statistical analysis. No individual user can be identified from such data.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Side Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/10">
                        <Shield className="size-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Compliance Standards</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Compliant with general data protection principles
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        AES-256 encryption for data at rest
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        TLS 1.3 for data in transit
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Automated data purging after 90 days
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        No third-party data sharing for marketing
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/10">
                        <Eye className="size-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Your Rights</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Right to access your stored data
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Right to request immediate data deletion
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Right to correct inaccurate information
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Right to export your check history
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Right to opt out at any time
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/10">
                        <Database className="size-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Data Handling</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Data stored locally on encrypted servers
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        No cloud-based third-party storage
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Session-based processing, no persistent cookies
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        Minimal data collection principle applied
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary text-primary-foreground">
                <Shield className="size-3.5" />
              </div>
              <span className="text-sm font-semibold">
                Loan<span className="text-primary">IQ</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              AI-powered loan eligibility analysis. Results are for informational purposes only and do not constitute financial advice or guarantee loan approval.
            </p>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} LoanIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
