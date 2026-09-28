# Phase 15G — International Customer Experience Framework

## Regional Promotion Engine
- **India (`IN`)**: Festival promotional campaigns (`FESTIVE500` - Diwali Deep Cleaning).
- **United States (`US`)**: Seasonal home care campaigns (`FALL2026` - Furnace Tune-Up).

## Localized Pricing Engine
- Real-time USD base price conversion into regional currencies (INR, GBP, AED, EUR).
- Formatted localized price strings (e.g. `₹8,350`, `£79`, `$100`).

## APIs
- `GET /customer-experience-global/promotions/:countryCode`: Fetch active regional promotions.
- `GET /customer-experience-global/localized-price`: Fetch converted localized price.
