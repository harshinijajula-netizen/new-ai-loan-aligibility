"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  EligibilityScoreRing,
} from "./eligibility-score-ring";
import {
  Banknote,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EligibilityResult {
  eligibilityScore: number;
  riskLevel: string;
  maxLoanAmount: number;
  recommendedRate: number;
  aiAnalysis: string;
  recommendations: string;
  factors: {
    creditScore: number;
    incomeStability: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    employmentStability: number;
  };
}

interface ResultsDashboardProps {
  result: EligibilityResult;
  onReset: () => void;
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            AI Analysis Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized assessment based on your financial profile
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <X className="size-4 mr-1.5" />
          New Check
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex items-center justify-center">
            <EligibilityScoreRing
              score={result.eligibilityScore}
              riskLevel={result.riskLevel}
            />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Key Financial Metrics
            </CardTitle>
            <CardDescription>
              AI-recommended parameters for your loan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                icon={CheckCircle2}
                label="Max Eligible Amount"
                value={`$${(result.maxLoanAmount || 0).toLocaleString()}`}
                color="emerald"
              />
              <MetricCard
                icon={TrendingDown}
                label="Recommended Rate"
                value={`${(result.recommendedRate || 0).toFixed(2)}%`}
                color="sky"
              />
              <MetricCard
                icon={AlertTriangle}
                label="Risk Level"
                value={result.riskLevel}
                color={
                  result.riskLevel === "Low"
                    ? "emerald"
                    : result.riskLevel === "Medium"
                    ? "amber"
                    : "red"
                }
              />
            </div>

            <Separator />

            {/* Factor Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Factor Breakdown</h4>
              {result.factors && (
                <div className="space-y-2.5">
                  <FactorBar
                    label="Credit Score"
                    value={result.factors.creditScore}
                  />
                  <FactorBar
                    label="Income Stability"
                    value={result.factors.incomeStability}
                  />
                  <FactorBar
                    label="Debt-to-Income Ratio"
                    value={result.factors.debtToIncomeRatio}
                  />
                  <FactorBar
                    label="Loan-to-Income Ratio"
                    value={result.factors.loanToIncomeRatio}
                  />
                  <FactorBar
                    label="Employment Stability"
                    value={result.factors.employmentStability}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Banknote className="size-4 text-primary" />
              </div>
              AI Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {result.aiAnalysis}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <ArrowRight className="size-4 text-primary" />
              </div>
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {result.recommendations}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.emerald}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold mt-0.5 tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function FactorBar({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v >= 80) return "bg-emerald-500";
    if (v >= 60) return "bg-amber-500";
    if (v >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-semibold tabular-nums">{value}/100</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}
