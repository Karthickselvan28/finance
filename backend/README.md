# EMI Calculator Backend API

FastAPI backend for EMI calculation, prepayment analysis, and investment comparison.

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

### Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode with Gunicorn

FastAPI is an ASGI application and requires Uvicorn workers when using Gunicorn:

```bash
gunicorn app.main:app -c gunicorn_config.py
```

Or directly with command-line options:

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Important**: Always use `uvicorn.workers.UvicornWorker` as the worker class when running FastAPI with Gunicorn. Using the default sync worker will cause `TypeError: __call__() missing 1 required positional argument: 'send'` errors.

## API Endpoints

- `POST /calculate-emi` - Calculate EMI for a loan
- `POST /prepayment` - Analyze prepayment impact
- `POST /prepay-vs-invest` - Compare prepayment vs investment
- `POST /visualize` - Get visualization data

API documentation available at `/docs` when running the server.

