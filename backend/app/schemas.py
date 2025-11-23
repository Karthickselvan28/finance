from pydantic import BaseModel, Field
from typing import Optional

class EMIRequest(BaseModel):
    principal: float = Field(..., gt=0)
    annual_rate: float = Field(..., ge=0)
    tenure_months: int = Field(..., gt=0)

class PrepayRequest(EMIRequest):
    extra_monthly: float = Field(0, ge=0)
    extra_quarterly: float = Field(0, ge=0)
    extra_yearly: float = Field(0, ge=0)

class PrepayInvestRequest(PrepayRequest):
    investment_return_annual: float = Field(0, ge=0)
    inflation_annual: float = Field(0, ge=0)

class EMIResponse(BaseModel):
    emi: float
    total_payment: float
    total_interest: float

class PrepayResponse(BaseModel):
    original_tenure_months: int
    new_tenure_months: int
    months_reduced: int
    original_total_payment: float
    new_total_payment: float
    total_interest_saved: float

class PrepayInvestResponse(BaseModel):
    pv_interest_saved: float
    pv_value_if_invested: float
    recommendation: str
    details: dict

class AmortizationSchedulePoint(BaseModel):
    month: int
    principal_paid: float
    interest_paid: float
    ending_balance: float

class InvestmentSchedulePoint(BaseModel):
    month: int
    investment_value: float

class VisualizationResponse(BaseModel):
    amortization_schedule: list[AmortizationSchedulePoint]
    investment_schedule: list[InvestmentSchedulePoint]
