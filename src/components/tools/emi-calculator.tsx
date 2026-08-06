"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react";

export function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{ emi: string; totalInterest: string; totalPayment: string } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(years) * 12;
    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setResult({
      emi: emi.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      totalInterest: (total - p).toLocaleString("en-US", { maximumFractionDigits: 0 }),
      totalPayment: total.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    });
  };

  return (
    <Card className="glass gradient-border">
      <CardContent className="pt-6 space-y-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl" style={{ background: "oklch(0.75 0.18 200 / 0.1)", border: "1px solid oklch(0.75 0.18 200 / 0.15)" }}>
            <Calculator className="size-5" style={{ color: "oklch(0.75 0.18 200)" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">EMI Calculator</h3>
            <p className="text-[11px]" style={{ color: "oklch(0.60 0.02 220)" }}>Calculate your monthly installment</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs flex items-center gap-1.5 mb-1.5"><DollarSign className="size-3" /> Loan Amount ($)</Label>
            <Input type="number" placeholder="e.g. 500000" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1.5 mb-1.5"><Percent className="size-3" /> Interest Rate (% p.a.)</Label>
            <Input type="number" step="0.1" placeholder="e.g. 10.5" value={rate} onChange={(e) => setRate(e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1.5 mb-1.5"><Calendar className="size-3" /> Tenure (Years)</Label>
            <Input type="number" placeholder="e.g. 20" value={years} onChange={(e) => setYears(e.target.value)} className="h-9 text-sm" />
          </div>
          <Button onClick={calculate} className="w-full h-9 text-sm font-semibold" style={{ background: "oklch(0.75 0.18 200)", color: "white" }}>Calculate EMI</Button>
        </div>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-2">
            {[
              { label: "Monthly EMI", value: `$${result.emi}`, color: "oklch(0.75 0.18 200)" },
              { label: "Total Interest", value: `$${result.totalInterest}`, color: "oklch(0.82 0.16 85)" },
              { label: "Total Payment", value: `$${result.totalPayment}`, color: "oklch(0.60 0.14 280 / 0.9)" },
            ].map((item) => (
              <div key={item.label} className="text-center p-2.5 rounded-xl" style={{ background: `oklch(0.22 0.035 265)` }}>
                <p className="text-[9px] mb-0.5" style={{ color: "oklch(0.50 0.02 220)" }}>{item.label}</p>
                <p className="text-xs font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
