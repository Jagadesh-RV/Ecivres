# Enterprise Branch Governance & Compliance Guide

## Core Guidelines
1. All changes originate on `feature/*` branches.
2. PR reviews require 1+ approving code owner review.
3. Status checks must pass (Lint, Typecheck, Unit Tests, Web Build, Security Audit).
4. Commits must be GPG signed and maintain linear history.
5. `main` releases require production approval gates and canary deployment verification.
