# Active Context: Bug Fix and Edge Case Handling

A critical bug and additional edge cases have been identified in the financial calculation logic. The application is being updated to address these issues and improve its accuracy and robustness.

**Current Work:**
- **Bug Fix:** The `compare_prepay_vs_invest_pv` function is being modified to use the new, shorter loan tenure for investment calculations.
- **Edge Case Handling:**
    - The `generate_visualization_data` function will be updated to ensure investment growth calculations do not extend beyond the new loan tenure.
    - The `amortization_schedule` function will be enhanced to prevent negative loan balances by adjusting the final extra payment.

**Next Steps:**
- Implement and test the backend logic fixes for the bug and edge cases.
- Verify the corrected calculations in the frontend visualizations.
- Commit and push the updates to the remote repository.
