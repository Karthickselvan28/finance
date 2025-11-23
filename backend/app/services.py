from typing import Dict, Any, List

# Core finance helpers: EMI calc, amortization simulation, prepay, PV compare

def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> Dict[str, float]:
    """Return emi, total_payment and total_interest"""
    if tenure_months <= 0:
        raise ValueError("tenure_months must be > 0")

    monthly_rate = annual_rate / (12 * 100)
    if monthly_rate == 0:
        emi = principal / tenure_months
    else:
        emi = (principal * monthly_rate * (1 + monthly_rate) ** tenure_months) / (
            (1 + monthly_rate) ** tenure_months - 1
        )

    total_payment = emi * tenure_months
    total_interest = total_payment - principal

    return {"emi": round(emi, 2), "total_payment": round(total_payment, 2), "total_interest": round(total_interest, 2)}


def amortization_schedule(principal: float, annual_rate: float, tenure_months: int, emi: float, extra_monthly=0, extra_quarterly=0, extra_yearly=0) -> List[Dict[str, float]]:
    """Simulate month-by-month amortization. Return list of rows with month, opening_balance, interest, principal_component, extra_applied, closing_balance."""
    schedule = []
    monthly_rate = annual_rate / (12 * 100)
    balance = principal
    month = 0

    while balance > 0 and month < tenure_months * 5:
        month += 1
        interest = balance * monthly_rate
        principal_component = emi - interest
        if principal_component < 0:
            principal_component = 0

        extra = 0
        extra += extra_monthly
        if extra_quarterly > 0 and month % 3 == 0:
            extra += extra_quarterly
        if extra_yearly > 0 and month % 12 == 0:
            extra += extra_yearly

        opening = balance
        balance -= (principal_component + extra)
        if balance < 0:
            # adjust last payment so we don't go negative
            principal_component += balance  # balance is negative
            balance = 0

        closing = balance

        schedule.append({
            "month": month,
            "opening_balance": round(opening, 2),
            "interest": round(interest, 2),
            "principal_component": round(principal_component, 2),
            "extra_applied": round(extra, 2),
            "closing_balance": round(closing, 2),
        })

        if balance == 0:
            break

    return schedule


def prepayment_effect(principal: float, annual_rate: float, tenure_months: int, extra_monthly=0, extra_quarterly=0, extra_yearly=0) -> Dict[str, Any]:
    """Return original and new totals after applying extras. Uses amortization simulation."""
    base = calculate_emi(principal, annual_rate, tenure_months)
    emi = base["emi"]
    original_total_payment = base["total_payment"]

    schedule = amortization_schedule(principal, annual_rate, tenure_months, emi, extra_monthly, extra_quarterly, extra_yearly)
    new_tenure = schedule[-1]["month"] if schedule else tenure_months

    extra_payments_total = sum(row["extra_applied"] for row in schedule)
    new_total_payment = (emi * new_tenure) + extra_payments_total

    return {
        "original_tenure_months": tenure_months,
        "new_tenure_months": new_tenure,
        "months_reduced": tenure_months - new_tenure,
        "original_total_payment": round(original_total_payment, 2),
        "new_total_payment": round(new_total_payment, 2),
        "total_interest_saved": round(original_total_payment - new_total_payment, 2),
        "schedule": schedule
    }


def present_value_of_cashflows(cashflows: List[float], discount_rate_monthly: float) -> float:
    """Discount list of cashflows where cashflow[i] occurs at month i+1"""
    pv = 0.0
    for i, cf in enumerate(cashflows):
        pv += cf / ((1 + discount_rate_monthly) ** (i + 1))
    return pv


def compare_prepay_vs_invest_pv(principal: float, annual_rate: float, tenure_months: int, extra_monthly: float, investment_return_annual: float, inflation_annual: float) -> Dict[str, Any]:
    """Compute PV-adjusted comparison between prepay and invest.

    - We simulate month-by-month the amortization with and without extra monthly payment.
    - For each month we record interest paid in both scenarios; interest saved per month is discounted to present using real return.
    - We also compute PV of investing the monthly extra (treating extra as outgoing today? We assume extra is paid/invested at end of each month), and discount future investment value back to present using same real return (or directly discount the monthly invested cashflows).
    """
    # defensive
    if tenure_months <= 0:
        raise ValueError("tenure_months must be > 0")

    monthly_rate = annual_rate / (12 * 100)

    # base EMI and schedule (no extras)
    base = calculate_emi(principal, annual_rate, tenure_months)
    emi = base["emi"]
    schedule_no_extra = amortization_schedule(principal, annual_rate, tenure_months, emi, 0, 0, 0)

    # schedule with extra monthly only (we use extra_monthly here)
    schedule_with_extra = amortization_schedule(principal, annual_rate, tenure_months, emi, extra_monthly, 0, 0)

    # Real monthly discount rate derived from investment_return and inflation
    real_return = ((1 + investment_return_annual / 100) / (1 + inflation_annual / 100)) - 1
    discount_rate_monthly = real_return / 12

    # compute monthly interest arrays
    interest_no_extra = [row["interest"] for row in schedule_no_extra]
    interest_with_extra = [row["interest"] for row in schedule_with_extra]

    # interest saved month-by-month (align by months; if lengths differ pad with zeros)
    length = max(len(interest_no_extra), len(interest_with_extra))
    saved = []
    for i in range(length):
        a = interest_no_extra[i] if i < len(interest_no_extra) else 0
        b = interest_with_extra[i] if i < len(interest_with_extra) else 0
        saved.append(max(0, a - b))

    # PV of interest saved
    pv_interest_saved = present_value_of_cashflows(saved, discount_rate_monthly)

    # PV of investing extra_monthly: we treat extra_monthly as outflow invested each month for the original loan tenure
    # future value of each monthly investment can be computed, but easier: compute PV of monthly investments as sum of discounted cashflows
    invest_cashflows = [extra_monthly for _ in range(tenure_months)]
    pv_of_investments = present_value_of_cashflows(invest_cashflows, discount_rate_monthly)

    # For clarity, we also compute future value of investing extra_monthly monthly at nominal investment_return_annual
    r = investment_return_annual / (12 * 100)
    future_value = 0.0
    if r == 0:
        future_value = extra_monthly * tenure_months
    else:
        future_value = extra_monthly * (((1 + r) ** tenure_months - 1) / r)

    # Decision
    if pv_interest_saved > pv_of_investments:
        recommendation = "Better to PREPAY (in today's money, after inflation)."
    else:
        recommendation = "Better to INVEST (in today's money, after inflation)."

    return {
        "pv_interest_saved": round(pv_interest_saved, 2),
        "pv_value_if_invested": round(pv_of_investments, 2),
        "future_value_if_invested": round(future_value, 2),
        "real_monthly_discount_rate": round(discount_rate_monthly, 6),
        "recommendation": recommendation,
        "details": {
            "schedule_no_extra_months": len(schedule_no_extra),
            "schedule_with_extra_months": len(schedule_with_extra),
            "total_extra_paid": round(extra_monthly * tenure_months, 2)
        }
    }


def generate_visualization_data(principal: float, annual_rate: float, tenure_months: int, extra_monthly: float, investment_return_annual: float) -> Dict[str, list]:
    """Generate amortization and investment schedules for visualization."""
    base = calculate_emi(principal, annual_rate, tenure_months)
    emi = base["emi"]
    
    # Amortization schedule
    amortization_data_raw = amortization_schedule(principal, annual_rate, tenure_months, emi, extra_monthly)
    amortization_data = [
        {
            "month": row["month"],
            "principal_paid": row["principal_component"],
            "interest_paid": row["interest"],
            "ending_balance": row["closing_balance"],
        }
        for row in amortization_data_raw
    ]
    
    # Investment schedule
    investment_schedule = []
    invest_monthly_rate = investment_return_annual / (12 * 100)
    current_investment_value = 0
    
    for month in range(1, tenure_months + 1):
        current_investment_value += extra_monthly
        current_investment_value *= (1 + invest_monthly_rate)
        investment_schedule.append({
            "month": month,
            "investment_value": round(current_investment_value, 2)
        })

    return {
        "amortization_schedule": amortization_data,
        "investment_schedule": investment_schedule
    }
