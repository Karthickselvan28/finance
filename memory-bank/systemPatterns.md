# System Patterns: Decoupled Architecture and Advanced Charting

The application follows a standard decoupled architecture, with a clear separation between the frontend and backend, and utilizes an advanced charting pattern for data visualization.

- **Backend (API):** The FastAPI backend serves as a headless API, handling all business logic and calculations. It exposes a set of RESTful endpoints that the frontend consumes, including a dedicated endpoint for visualization data.

- **Frontend (Client):** The React/Vite frontend is a single-page application (SPA) that provides the user interface. It communicates with the backend via asynchronous API calls to fetch data and perform calculations.

- **Charting Pattern:**
  - **Data Visualization:** The application uses the `recharts` library to create interactive and informative charts.
  - **Amortization Chart:** A `ComposedChart` is used to display multiple data series in a single graph. It combines a stacked bar chart (for principal and interest) with a line chart (for the ending balance) to provide a comprehensive view of the loan amortization.
  - **Interactivity:** The charts include a `Brush` component, allowing users to zoom and pan to explore the data in detail. This provides a more engaging and "fool-proof" user experience.
