# Security Policy

## Supported versions

All `@nexub/*` packages release in lockstep. Security fixes ship on the latest minor only; please upgrade to receive them.

## Reporting a vulnerability

Email **security_report@nexub.com** with:

- the affected package(s) and version(s)
- a description and, if possible, a minimal reproduction
- the impact you expect (e.g. XSS through a component prop)

Please don't open a public issue. We acknowledge reports within 3 working days and aim to ship a fix within 30 days for high or critical issues. We'll credit you in the release notes unless you'd rather stay anonymous.

## Scope

In scope: the published `@nexub/*` packages and the docs site's feedback endpoint (`apps/docs/functions`).
Out of scope: issues that need a compromised developer machine, and findings in third-party dependencies that have no exploitable path through our code (report those upstream).
