import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrepaymentResponse } from "@/types/loan";
import { PiggyBank, Clock, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PrepaymentCardProps {
  data: PrepaymentResponse;
}

export const PrepaymentCard = ({ data }: PrepaymentCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-[var(--shadow-elevated)] border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary">
          <PiggyBank className="h-5 w-5" />
          Prepayment Impact
        </CardTitle>
        <CardDescription>Benefits of making extra monthly payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Interest Saved</span>
            <Badge className="bg-secondary text-secondary-foreground">Savings</Badge>
          </div>
          <p className="text-3xl font-bold text-secondary">{formatCurrency(data.total_interest_saved)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Time Saved</span>
            </div>
            <p className="text-xl font-bold text-foreground">{data.months_reduced} months</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">New Tenure</span>
            </div>
            <p className="text-xl font-bold text-foreground">{data.new_tenure_months} months</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Total Payment:</span>
            <span className="font-semibold text-foreground">{formatCurrency(data.original_total_payment)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">New Total Payment:</span>
            <span className="font-semibold text-secondary">{formatCurrency(data.new_total_payment)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
