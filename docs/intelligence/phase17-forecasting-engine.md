# Phase 17 Demand & Revenue Forecasting Engine Documentation

## Overview
The Forecasting Engine delivers predictive analytics across demand volume, provider capacity, GMV, and revenue across 1-hour, 1-day, 7-day, and 30-day horizons.

## Supported Algorithms
- **Exponential Smoothing**: Adaptive weighted moving average for fast demand response.
- **Trend Forecasting**: Linear regression trend projection across historic windows.
- **Moving Average**: Baseline sliding window statistical projection.

## Persistence
Outputs are written to `DemandRevenueForecast` in PostgreSQL with confidence bounds and human-readable explanation strings.
