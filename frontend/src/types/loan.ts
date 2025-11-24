export interface LoanInputs {
  principal: number;
  annual_rate: number;
  tenure_months: number;
  extra_monthly?: number;
  investment_return_annual?: number;
  inflation_annual?: number;
}

export interface EMIResponse {
  emi: number;
  total_payment: number;
  total_interest: number;
}

export interface PrepaymentResponse {
  original_tenure_months: number;
  new_tenure_months: number;
  months_reduced: number;
  original_total_payment: number;
  new_total_payment: number;
  total_interest_saved: number;
}

export interface InvestmentResponse {
  pv_interest_saved: number;
  pv_value_if_invested: number;
  recommendation: string;
  details: {
    schedule_no_extra_months: number;
    schedule_with_extra_months: number;
    total_extra_paid: number;
  };
}

export interface CalculationResults {
  emi?: EMIResponse;
  prepayment?: PrepaymentResponse;
  investment?: InvestmentResponse;
  errors?: string[];
}
