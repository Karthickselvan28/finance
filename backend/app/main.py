from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import EMIRequest, EMIResponse, PrepayRequest, PrepayResponse, PrepayInvestRequest, PrepayInvestResponse, VisualizationResponse
from app.services import calculate_emi, prepayment_effect, compare_prepay_vs_invest_pv, generate_visualization_data

app = FastAPI(title="EMI Prepay vs Invest API")

# allow CORS from frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/calculate-emi", response_model=EMIResponse)
def api_calculate_emi(req: EMIRequest):
    return calculate_emi(req.principal, req.annual_rate, req.tenure_months)


@app.post("/prepayment", response_model=PrepayResponse)
def api_prepayment(req: PrepayRequest):
    return prepayment_effect(req.principal, req.annual_rate, req.tenure_months, req.extra_monthly, req.extra_quarterly, req.extra_yearly)


@app.post("/prepay-vs-invest", response_model=PrepayInvestResponse)
def api_prepay_vs_invest(req: PrepayInvestRequest):
    result = compare_prepay_vs_invest_pv(
        req.principal,
        req.annual_rate,
        req.tenure_months,
        req.extra_monthly,
        req.investment_return_annual,
        req.inflation_annual,
    )
    return {
        "pv_interest_saved": result["pv_interest_saved"],
        "pv_value_if_invested": result["pv_value_if_invested"],
        "recommendation": result["recommendation"],
        "details": result.get("details", {})
    }


@app.post("/visualize", response_model=VisualizationResponse)
def api_visualize(req: PrepayInvestRequest):
    return generate_visualization_data(
        req.principal,
        req.annual_rate,
        req.tenure_months,
        req.extra_monthly,
        req.investment_return_annual
    )
