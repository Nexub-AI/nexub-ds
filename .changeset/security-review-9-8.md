---
'@nexub/react': minor
---

9.8 Security review and response. An internal review of the packages, the docs site, its feedback endpoint, the MCP server and the release pipeline against OWASP ASVS Level 2 found nothing critical or high; all findings are fixed (`SECURITY_REVIEW.md`).

- `@nexub/mcp`: text passed to the `build_screen` and `review_screen` prompts is fenced so it can't close its code block and read as instructions. `@modelcontextprotocol/sdk` 1.32.2.
- Docs feedback endpoint: timeouts on outbound calls, Turnstile tokens checked against the host, stricter body and `Content-Length` handling, `no-store` and `nosniff` on API answers, and a missing webhook is now an error instead of a silent success.
- No high or critical advisory in any dependency, dev tools included, enforced on every pull request.
- New `INCIDENT_RUNBOOK.md`; `SECURITY.md` states the response times, that fixes ship on the latest version only as a patch, and how advisories and CVEs are issued. Private vulnerability reporting is on.

No component API changes.
