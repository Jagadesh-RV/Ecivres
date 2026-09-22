# Phase 13E — OCR Document Intelligence

## Overview
Parses invoices, receipts, business licenses, and insurance certificates using OCR text extraction and field normalization.

## APIs
- `POST /ocr/upload`: Document upload for OCR processing.
- `GET /ocr/documents/:id/invoice`: Structured invoice extractor.
- `GET /ocr/documents/:id/receipt`: Store receipt parser.
- `GET /ocr/documents/:id/license`: Business license metadata extractor.
