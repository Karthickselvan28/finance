import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { LoanInputs } from "@/types/loan";

interface LoanFormProps {
  onCalculate: (inputs: LoanInputs) => void;
  isLoading: boolean;
}

export const LoanForm = ({ onCalculate, isLoading }: LoanFormProps) => {
  const [inputs, setInputs] = useState<LoanInputs>({
    principal: 500000,
    annual_rate: 10.5,
    tenure_months: 60,
    extra_monthly: undefined,
    investment_return_annual: undefined,
    inflation_annual: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  const handleInputChange = (field: keyof LoanInputs, value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-primary">
          <Calculator className="h-6 w-6" />
          Loan Details
        </CardTitle>
        <CardDescription>Enter your loan parameters to calculate EMI and explore options</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal" className="text-foreground font-medium">
                Principal Loan Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="principal"
                type="number"
                value={inputs.principal}
                onChange={(e) => handleInputChange("principal", e.target.value)}
                required
                min="1"
                step="1000"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual_rate" className="text-foreground font-medium">
                Annual Interest Rate (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="annual_rate"
                type="number"
                value={inputs.annual_rate}
                onChange={(e) => handleInputChange("annual_rate", e.target.value)}
                required
                min="0.1"
                max="30"
                step="0.1"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure_months" className="text-foreground font-medium">
                Loan Tenure (months) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenure_months"
                type="number"
                value={inputs.tenure_months}
                onChange={(e) => handleInputChange("tenure_months", e.target.value)}
                required
                min="1"
                max="360"
                step="1"
                className="text-base"
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-foreground">Optional: Advanced Analysis</h3>

            <div className="space-y-2">
              <Label htmlFor="extra_monthly" className="text-foreground font-medium">
                Extra Monthly Payment (₹)
              </Label>
              <Input
                id="extra_monthly"
                type="number"
                value={inputs.extra_monthly ?? ""}
                onChange={(e) => handleInputChange("extra_monthly", e.target.value)}
                min="0"
                step="100"
                placeholder="e.g., 2000"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount for prepayment and investment comparison
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_return_annual" className="text-foreground font-medium">
                Expected Investment Return (%)
              </Label>
              <Input
                id="investment_return_annual"
                type="number"
                value={inputs.investment_return_annual ?? ""}
                onChange={(e) => handleInputChange("investment_return_annual", e.target.value)}
                min="0"
                max="30"
                step="0.1"
                placeholder="e.g., 12"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflation_annual" className="text-foreground font-medium">
                Expected Annual Inflation (%)
              </Label>
              <Input
                id="inflation_annual"
                type="number"
                value={inputs.inflation_annual ?? ""}
                onChange={(e) => handleInputChange("inflation_annual", e.target.value)}
                min="0"
                max="20"
                step="0.1"
                placeholder="e.g., 6"
                className="text-base"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-md transition-all"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Results
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
