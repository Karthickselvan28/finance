import { useState } from "react";
import { toast } from "sonner";
import { LoanForm } from "@/components/LoanForm";
import { EMISummaryCard } from "@/components/EMISummaryCard";
import { PrepaymentCard } from "@/components/PrepaymentCard";
import { InvestmentRecommendationCard } from "@/components/InvestmentRecommendationCard";
import { VisualizationCard } from "@/components/VisualizationCard";
import { LoanInputs, CalculationResults } from "@/types/loan";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_BASE_URL = "http://localhost:8000";

const Index = () => {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loanDetails, setLoanDetails] = useState<LoanInputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateResults = async (inputs: LoanInputs) => {
    setLoanDetails(inputs);
    setIsLoading(true);
    const errors: string[] = [];
    const newResults: CalculationResults = { errors: [] };

    try {
      // Calculate EMI (always available)
      const emiResponse = await fetch(`${API_BASE_URL}/calculate-emi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principal: inputs.principal,
          annual_rate: inputs.annual_rate,
          tenure_months: inputs.tenure_months,
        }),
      });

      if (emiResponse.ok) {
        newResults.emi = await emiResponse.json();
        toast.success("EMI calculated successfully!");
      } else {
        errors.push("Failed to calculate EMI");
      }

      // Calculate Prepayment (if extra_monthly is provided)
      if (inputs.extra_monthly && inputs.extra_monthly > 0) {
        const prepaymentResponse = await fetch(`${API_BASE_URL}/prepayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            principal: inputs.principal,
            annual_rate: inputs.annual_rate,
            tenure_months: inputs.tenure_months,
            extra_monthly: inputs.extra_monthly,
          }),
        });

        if (prepaymentResponse.ok) {
          newResults.prepayment = await prepaymentResponse.json();
        } else {
          errors.push("Failed to calculate prepayment impact");
        }
      } else if (inputs.extra_monthly === undefined || inputs.extra_monthly === 0) {
        errors.push("Extra monthly payment not provided - skipping prepayment analysis");
      }

      // Calculate Investment Comparison (if all optional params are provided)
      if (
        inputs.extra_monthly &&
        inputs.extra_monthly > 0 &&
        inputs.investment_return_annual &&
        inputs.inflation_annual !== undefined
      ) {
        const investmentResponse = await fetch(`${API_BASE_URL}/prepay-vs-invest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            principal: inputs.principal,
            annual_rate: inputs.annual_rate,
            tenure_months: inputs.tenure_months,
            extra_monthly: inputs.extra_monthly,
            investment_return_annual: inputs.investment_return_annual,
            inflation_annual: inputs.inflation_annual,
          }),
        });

        if (investmentResponse.ok) {
          newResults.investment = await investmentResponse.json();
        } else {
          errors.push("Failed to calculate investment comparison");
        }
      } else if (
        !inputs.investment_return_annual ||
        inputs.inflation_annual === undefined
      ) {
        errors.push("Investment return or inflation rate not provided - skipping investment analysis");
      }

      newResults.errors = errors;
      setResults(newResults);
    } catch (error) {
      toast.error("Connection error. Please ensure the backend server is running.");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EMI Calculator & Financial Advisor
          </h1>
          <p className="text-muted-foreground mt-1">
            Make informed decisions about your loan prepayments and investments
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Input Form */}
          <div className="lg:sticky lg:top-24">
            <LoanForm onCalculate={calculateResults} isLoading={isLoading} />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {!results && (
              <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-lg border-2 border-dashed border-border">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your loan details and click Calculate to see your results
                  </p>
                </div>
              </div>
            )}

            {results && results.errors && results.errors.length > 0 && (
              <Alert variant="default" className="border-warning/50 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-warning">Partial Results</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {results?.emi && <EMISummaryCard data={results.emi} />}
            {results?.prepayment && <PrepaymentCard data={results.prepayment} />}
            {results?.investment && <InvestmentRecommendationCard data={results.investment} />}
            {loanDetails && <VisualizationCard loanDetails={loanDetails} />}
          </div>
        </div>
      </main>

      <footer className="border-t mt-16 py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Make smarter financial decisions with data-driven insights</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
