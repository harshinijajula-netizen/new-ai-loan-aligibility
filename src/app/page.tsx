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
  Shield,
  Zap,
  BarChart3,
  Brain,
  Lock,
  RefreshCcw,
  ArrowDown,
  Menu,
  X,
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Loan<span className="text-primary">IQ</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => document.getElementById("check-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Check Eligibility
            </button>
            <button
              onClick={() => document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
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
            <button onClick={() => { document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">Home</button>
            <button onClick={() => { document.getElementById("check-section")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">Check Eligibility</button>
            <button onClick={() => { document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground">How It Works</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                <Zap className="size-3" />
                AI-Powered Financial Analysis
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Know Your Loan{" "}
                <span className="text-primary">Eligibility</span>{" "}
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
                  className="font-semibold"
                  onClick={() =>
                    document
                      .getElementById("check-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Check Now
                  <ArrowDown className="size-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("features-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  <span>100% Secure</span>
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
                <img
                  src="/hero-loan.png"
                  alt="AI Loan Analysis Visualization"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border rounded-xl shadow-lg p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <BarChart3 className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approval Rate</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">94.7%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content: Eligibility Checker */}
      <section id="check-section" className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
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

      {/* Features Section */}
      <section id="features-section" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <feature.icon className="size-5 text-primary" />
                      </div>
                      <span className="text-3xl font-bold text-primary/10">
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
            <p className="text-xs text-muted-foreground text-center">
              AI-powered loan eligibility analysis. Results are for informational purposes only and do not guarantee loan approval.
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
