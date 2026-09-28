# Phase 15B — Advanced Internationalization & RTL Engine

## Supported Languages
- English (`en`), Hindi (`hi`), Arabic (`ar`), Spanish (`es`), French (`fr`), German (`de`).

## Key Features
1. **Dynamic Language Loader**: On-demand localized translation dictionary resolution.
2. **RTL Layout Engine**: Auto-detection for Arabic (`ar`), Hebrew (`he`), Farsi (`fa`), and Urdu (`ur`) directing UI layouts.
3. **Localized Currency**: Standardized `Intl.NumberFormat` output across multi-currency environments.

## APIs
- `GET /i18n/translations/:locale`: Fetch dictionary.
- `GET /i18n/rtl-check/:locale`: Evaluate RTL state.
- `GET /i18n/format-currency`: Format localized currency string.
