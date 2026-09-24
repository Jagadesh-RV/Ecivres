# Enterprise Branch Protection Policy

## Overview
This document enforces strict branch governance rules for `main` and `develop` in accordance with SOC 2 / ISO 27001 compliance standards.

## Protected Branches
- `main`: Production release branch. Requires production approval gate, status checks, 1+ approval review, linear history.
- `develop`: Pre-release integration branch. Requires automated CI checks, 1+ approval review, linear history.

## Standard Workflow
`feature/*` -> `develop` -> `main`
Direct pushes and force pushes are strictly prohibited.
