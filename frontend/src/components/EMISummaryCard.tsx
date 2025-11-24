import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EMIResponse } from "@/types/loan";
import { Receipt, TrendingUp, DollarSign } from "lucide-react";

interface EMISummaryCardProps {
  data: EMIResponse;
}

export const EMISummaryCard = ({ data }: EMISummaryCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-[var(--shadow-elevated)] border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Receipt className="h-5 w-5" />
          Your EMI Breakdown
        </CardTitle>
        <CardDescription>Monthly payment and total cost analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Monthly EMI</span>
            </div>
            <span className="text-3xl font-bold text-primary">{formatCurrency(data.emi)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Total Interest</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(data.total_interest)}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Total Payment</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(data.total_payment)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
