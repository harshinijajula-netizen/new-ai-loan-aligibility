"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Trash2,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";

export interface HistoryItem {
  id: string;
  applicantName: string;
  monthlyIncome: number;
  creditScore: number;
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  existingDebt: number;
  loanPurpose: string;
  eligibilityScore: number;
  riskLevel: string;
  maxLoanAmount: number;
  recommendedRate: number;
  aiAnalysis: string;
  recommendations: string;
  createdAt: string;
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ items, onSelect, onDelete }: HistoryPanelProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <History className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm">No Check History</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your eligibility check results will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <History className="size-4 text-primary" />
          Recent Checks
        </CardTitle>
        <CardDescription>
          {items.length} check{items.length !== 1 ? "s" : ""} performed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-96">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/50 transition-colors border-b last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">
                        {item.applicantName}
                      </span>
                      <RiskBadge riskLevel={item.riskLevel} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>${item.loanAmount.toLocaleString()}</span>
                      <span className="capitalize">{item.loanPurpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tabular-nums">
                      {item.eligibilityScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      /100
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => onSelect(item)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function RiskBadge({ riskLevel }: { riskLevel: string }) {
  const cls =
    riskLevel === "Low"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : riskLevel === "Medium"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : riskLevel === "High"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <Badge variant="secondary" className={`${cls} text-[10px] px-1.5 py-0 font-semibold`}>
      {riskLevel}
    </Badge>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
