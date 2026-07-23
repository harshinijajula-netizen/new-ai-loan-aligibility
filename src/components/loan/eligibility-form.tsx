"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  User,
  DollarSign,
  CreditCard,
  Calendar,
  Briefcase,
  Target,
  Loader2,
  Sparkles,
} from "lucide-react";
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

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  applicantName: "",
  monthlyIncome: "",
  creditScore: "",
  loanAmount: "",
  loanTenure: "",
  employmentType: "",
  existingDebt: "",
  loanPurpose: "",
};

interface EligibilityFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function EligibilityForm({ onSubmit, isLoading }: EligibilityFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.applicantName.trim()) {
      newErrors.applicantName = "Name is required";
    }
    if (
      !formData.monthlyIncome ||
      parseFloat(formData.monthlyIncome) <= 0
    ) {
      newErrors.monthlyIncome = "Enter a valid income amount";
    }
    if (
      !formData.creditScore ||
      parseInt(formData.creditScore) < 300 ||
      parseInt(formData.creditScore) > 900
    ) {
      newErrors.creditScore = "Credit score must be 300-900";
    }
    if (
      !formData.loanAmount ||
      parseFloat(formData.loanAmount) <= 0
    ) {
      newErrors.loanAmount = "Enter a valid loan amount";
    }
    if (
      !formData.loanTenure ||
      parseInt(formData.loanTenure) < 1 ||
      parseInt(formData.loanTenure) > 30
    ) {
      newErrors.loanTenure = "Tenure must be 1-30 years";
    }
    if (!formData.employmentType) {
      newErrors.employmentType = "Select employment type";
    }
    if (
      !formData.existingDebt ||
      parseFloat(formData.existingDebt) < 0
    ) {
      newErrors.existingDebt = "Enter valid debt amount";
    }
    if (!formData.loanPurpose) {
      newErrors.loanPurpose = "Select loan purpose";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const inputFields = [
    {
      key: "applicantName" as const,
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: User,
      type: "text",
    },
    {
      key: "monthlyIncome" as const,
      label: "Monthly Income ($)",
      placeholder: "e.g. 5000",
      icon: DollarSign,
      type: "number",
    },
    {
      key: "creditScore" as const,
      label: "Credit Score (300-900)",
      placeholder: "e.g. 720",
      icon: CreditCard,
      type: "number",
    },
    {
      key: "loanAmount" as const,
      label: "Desired Loan Amount ($)",
      placeholder: "e.g. 50000",
      icon: DollarSign,
      type: "number",
    },
    {
      key: "loanTenure" as const,
      label: "Loan Tenure (Years)",
      placeholder: "e.g. 5",
      icon: Calendar,
      type: "number",
    },
    {
      key: "existingDebt" as const,
      label: "Existing Monthly Debt ($)",
      placeholder: "e.g. 1500",
      icon: DollarSign,
      type: "number",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            Loan Eligibility Checker
          </CardTitle>
          <CardDescription>
            Fill in your financial details and let our AI analyze your loan
            eligibility instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.key} className={field.key === "applicantName" ? "sm:col-span-2" : ""}>
                  <Label
                    htmlFor={field.key}
                    className="text-sm font-medium mb-1.5 flex items-center gap-1.5"
                  >
                    <field.icon className="size-3.5 text-muted-foreground" />
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className={`h-10 ${errors[field.key] ? "border-destructive" : ""}`}
                  />
                  {errors[field.key] && (
                    <p className="text-xs text-destructive mt-1">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="size-3.5 text-muted-foreground" />
                  Employment Type
                </Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(val) => updateField("employmentType", val)}
                >
                  <SelectTrigger className={`w-full h-10 ${errors.employmentType ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.employmentType}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Target className="size-3.5 text-muted-foreground" />
                  Loan Purpose
                </Label>
                <Select
                  value={formData.loanPurpose}
                  onValueChange={(val) => updateField("loanPurpose", val)}
                >
                  <SelectTrigger className={`w-full h-10 ${errors.loanPurpose ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Purchase</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="debt-consolidation">
                      Debt Consolidation
                    </SelectItem>
                    <SelectItem value="medical">Medical Expenses</SelectItem>
                    <SelectItem value="renovation">Home Renovation</SelectItem>
                  </SelectContent>
                </Select>
                {errors.loanPurpose && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.loanPurpose}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Check Eligibility
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
