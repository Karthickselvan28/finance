# Project Progress: Bug Fixes and Edge Case Handling in Progress

The application is currently being updated to address a critical bug in the investment comparison logic and to handle additional edge cases for a more robust user experience.

**What Works:**
- All original functionalities, including the advanced visualization feature, are operational.

**What's Left to Build:**
- **Bug Fixes and Enhancements:**
  - The `compare_prepay_vs_invest_pv` function is being updated to use the new, reduced loan tenure for investment calculations.
  - The `generate_visualization_data` function is being modified to ensure investment growth calculations do not extend beyond the new loan tenure.
  - The `amortization_schedule` function is being enhanced to prevent negative loan balances by adjusting the final extra payment.

**Known Issues:**
- The investment recommendation is currently flawed when prepayments are made.
- The amortization schedule does not correctly handle the final extra payment when the loan is paid off early.
