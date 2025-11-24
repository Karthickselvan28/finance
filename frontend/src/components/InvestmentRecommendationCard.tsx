import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestmentResponse } from "@/types/loan";
import { TrendingUp, ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvestmentRecommendationCardProps {
  data: InvestmentResponse;
}

export const InvestmentRecommendationCard = ({ data }: InvestmentRecommendationCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isPrepaymentBetter = data.recommendation.toLowerCase().includes("prepay");

  return (
    <Card className="shadow-[var(--shadow-elevated)] border-accent/20 bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Lightbulb className="h-5 w-5" />
          Financial Recommendation
        </CardTitle>
        <CardDescription>Prepayment vs Investment Analysis (Present Value)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`rounded-lg p-4 border ${
            isPrepaymentBetter
              ? "bg-secondary/10 border-secondary/30"
              : "bg-primary/10 border-primary/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <ArrowRight
              className={`h-6 w-6 mt-1 ${
                isPrepaymentBetter ? "text-secondary" : "text-primary"
              }`}
            />
            <div>
              <Badge
                className={`mb-2 ${
                  isPrepaymentBetter
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                Recommendation
              </Badge>
              <p className="text-lg font-bold text-foreground leading-relaxed">{data.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`rounded-lg p-4 transition-all ${
              isPrepaymentBetter
                ? "bg-secondary/10 border-2 border-secondary"
                : "bg-muted/50 border border-border"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">PV Interest Saved</span>
            </div>
            <p className={`text-xl font-bold ${isPrepaymentBetter ? "text-secondary" : "text-foreground"}`}>
              {formatCurrency(data.pv_interest_saved)}
            </p>
          </div>

          <div
            className={`rounded-lg p-4 transition-all ${
              !isPrepaymentBetter
                ? "bg-primary/10 border-2 border-primary"
                : "bg-muted/50 border border-border"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">PV If Invested</span>
            </div>
            <p className={`text-xl font-bold ${!isPrepaymentBetter ? "text-primary" : "text-foreground"}`}>
              {formatCurrency(data.pv_value_if_invested)}
            </p>
          </div>
        </div>

        <div className="border-t pt-3 space-y-1 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Original Tenure:</span>
            <span className="font-medium text-foreground">{data.details.schedule_no_extra_months} months</span>
          </div>
          <div className="flex justify-between">
            <span>With Prepayment:</span>
            <span className="font-medium text-foreground">{data.details.schedule_with_extra_months} months</span>
          </div>
          <div className="flex justify-between">
            <span>Total Extra Paid:</span>
            <span className="font-medium text-foreground">{formatCurrency(data.details.total_extra_paid)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TrendingDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
