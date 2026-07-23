import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      applicantName,
      monthlyIncome,
      creditScore,
      loanAmount,
      loanTenure,
      employmentType,
      existingDebt,
      loanPurpose,
    } = body;

    // Validate required fields
    if (!applicantName || !monthlyIncome || !creditScore || !loanAmount || !loanTenure || !employmentType || !loanPurpose) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const income = parseFloat(monthlyIncome);
    const credit = parseInt(creditScore);
    const loan = parseFloat(loanAmount);
    const tenure = parseInt(loanTenure);
    const debt = parseFloat(existingDebt) || 0;

    // Pre-compute financial metrics
    const dti = ((debt / income) * 100).toFixed(1);
    const lti = ((loan / (income * 12)) * 100).toFixed(1);
    const r = 0.1 / 12;
    const n = tenure * 12;
    const emiFactor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const estimatedEmi = (loan * emiFactor).toFixed(0);
    const totalDebt = (debt + loan * emiFactor).toFixed(0);

    // Call AI for analysis
    const zai = await ZAI.create();

    const prompt = `You are a senior loan underwriter and financial analyst AI. Analyze the following loan application and provide a comprehensive eligibility assessment.

**Applicant Details:**
- Name: ${applicantName}
- Monthly Income: $${income.toLocaleString()}
- Credit Score: ${credit}
- Desired Loan Amount: $${loan.toLocaleString()}
- Loan Tenure: ${tenure} years
- Employment Type: ${employmentType}
- Existing Monthly Debt: $${debt.toLocaleString()}
- Loan Purpose: ${loanPurpose}

**Calculations you should consider:**
- Debt-to-Income Ratio (DTI): ${dti}%
- Loan-to-Income Ratio: ${lti}%
- Monthly EMI estimate (at ~10% rate): $${estimatedEmi}
- Total debt with new loan: $${totalDebt}

Respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text). The JSON must have this exact structure:
{
  "eligibilityScore": <number 0-100>,
  "riskLevel": "Low" | "Medium" | "High" | "Very High",
  "maxLoanAmount": <max approved amount in dollars, number>,
  "recommendedRate": <interest rate percentage, number with 2 decimals>,
  "aiAnalysis": "<detailed 3-4 sentence analysis of the applicant's financial health, creditworthiness, and loan feasibility. Be specific about their numbers.>",
  "recommendations": "<3-4 specific, actionable recommendations to improve eligibility or get better terms. Use bullet points with -.>",
  "factors": {
    "creditScore": <number 0-100 based on their credit score quality>,
    "incomeStability": <number 0-100 based on income and employment type>,
    "debtToIncomeRatio": <number 0-100 based on DTI health>,
    "loanToIncomeRatio": <number 0-100 based on loan amount vs income>,
    "employmentStability": <number 0-100 based on employment type>
  }
}

Scoring guidelines:
- Credit Score factor: 300-579=Very Poor(0-20), 580-669=Fair(20-45), 670-739=Good(45-70), 740-799=Very Good(70-90), 800-900=Excellent(90-100)
- Income Stability: salaried gets boost, freelancer/self-employed moderate, factor in income level
- DTI: <20%=90-100, 20-35%=60-90, 35-50%=30-60, >50%=0-30
- Loan-to-Income: lower is better, assess if loan is reasonable for income
- Employment: salaried=80-100, self-employed=60-85, business=55-80, freelancer=50-75, retired=40-70

Overall eligibility score should be a weighted average considering all factors. Be realistic and data-driven.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "You are a senior loan underwriter AI. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content || "";
    // Clean the response - remove markdown code blocks if present
    let cleaned = raw.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const analysisResult = JSON.parse(cleaned);

    // Save to database
    await db.loanCheck.create({
      data: {
        applicantName,
        monthlyIncome: income,
        creditScore: credit,
        loanAmount: loan,
        loanTenure: tenure,
        employmentType,
        existingDebt: debt,
        loanPurpose,
        eligibilityScore: analysisResult.eligibilityScore,
        riskLevel: analysisResult.riskLevel,
        maxLoanAmount: analysisResult.maxLoanAmount,
        recommendedRate: analysisResult.recommendedRate,
        aiAnalysis: analysisResult.aiAnalysis,
        recommendations: analysisResult.recommendations,
      },
    });

    return NextResponse.json(analysisResult);
  } catch (error: unknown) {
    console.error("Eligibility check error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
