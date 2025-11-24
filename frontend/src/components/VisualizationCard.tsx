import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Brush,
} from "recharts";
import { LoanInputs } from "@/types/loan";
import { API_BASE_URL } from "@/pages/Index";

interface VisualizationCardProps {
  loanDetails: LoanInputs;
}

interface AmortizationData {
  month: number;
  principal_paid: number;
  interest_paid: number;
  ending_balance: number;
}

interface InvestmentData {
  month: number;
  investment_value: number;
}

export function VisualizationCard({ loanDetails }: VisualizationCardProps) {
  const [amortizationData, setAmortizationData] = useState<AmortizationData[]>(
    []
  );
  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([]);

  useEffect(() => {
    if (loanDetails) {
      fetch(`${API_BASE_URL}/visualize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanDetails),
      })
        .then((res) => res.json())
        .then((data) => {
          setAmortizationData(data.amortization_schedule);
          setInvestmentData(data.investment_schedule);
        });
    }
  }, [loanDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-1">
        <div>
          <h3 className="text-lg font-semibold mb-2">Loan Amortization</h3>
          <ChartContainer config={{}} className="min-h-[400px] w-full">
            <ComposedChart data={amortizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="principal_paid"
                stackId="a"
                fill="#8884d8"
                yAxisId="left"
              />
              <Bar
                dataKey="interest_paid"
                stackId="a"
                fill="#82ca9d"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="ending_balance"
                stroke="#ff7300"
                yAxisId="right"
              />
              <Brush dataKey="month" height={30} stroke="#8884d8" />
            </ComposedChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Investment Growth</h3>
          <ChartContainer config={{}} className="min-h-[400px] w-full">
            <AreaChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="investment_value"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Brush dataKey="month" height={30} stroke="#8884d8" />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
