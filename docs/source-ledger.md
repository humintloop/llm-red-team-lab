# Source Ledger

This ledger records the sources used for ELICIT mappings and control-language decisions.
It is a traceability aid, not a legal or audit conclusion.

## Mapping Types

- **Official source:** language or taxonomy maintained by the named organization.
- **Direct mapping:** the source explicitly connects the concept or taxonomy item.
- **Inferred mapping:** the lab maps source concepts to project-defined controls based on functional relevance.
- **Project-defined control:** control language created for this lab and intended to be replaced by organization-specific controls later.
- **Implementation guidance:** practical security or assurance language derived from multiple sources and local design decisions.

## Sources Reviewed

| Source ID | Source | Repo / File | Used For | Mapping Type | Date Reviewed |
|---|---|---|---|---|---|
| MITRE-ATLAS-DATA | MITRE ATLAS data repository | `mitre-atlas/atlas-data`, `dist/ATLAS.yaml` | Technique IDs, names, descriptions, variants, and tactic context | Official source / direct mapping | 2026-06-14 |
| OWASP-LLM-2025 | OWASP Top 10 for LLM Applications 2025 | `owasp/www-project-top-10-for-large-language-model-applications`, `2_0_vulns/*.md` | LLM risk categories, prevention language, and scenario context | Official source / direct and inferred mapping | 2026-06-14 |
| ELICIT-CONTROLS | ELICIT project-defined SaaS LLM control set | `controls/llm-saas-control-set.yaml` | Control objectives, evidence examples, test methods, retest guidance | Project-defined control | 2026-06-14 |

## MITRE ATLAS Technique References

| Technique | Name | Source Path | Lab Use |
|---|---|---|---|
| `AML.T0051` | LLM Prompt Injection | `dist/ATLAS.yaml` | Parent technique for direct, indirect, and triggered prompt injection testing |
| `AML.T0051.000` | Direct | `dist/ATLAS.yaml` | Direct user-supplied prompt injection relevance |
| `AML.T0051.001` | Indirect | `dist/ATLAS.yaml` | External-content and RAG prompt injection relevance |
| `AML.T0051.002` | Triggered | `dist/ATLAS.yaml` | User-action or event-triggered prompt injection relevance |
| `AML.T0054` | LLM Jailbreak | `dist/ATLAS.yaml` | Jailbreak / guardrail bypass testing relevance |
| `AML.T0056` | Extract LLM System Prompt | `dist/ATLAS.yaml` | System prompt extraction and prompt leakage testing relevance |
| `AML.T0057` | LLM Data Leakage | `dist/ATLAS.yaml` | Sensitive disclosure and output monitoring relevance |

## OWASP LLM Top 10 References

| Category | Name | Source Path | Lab Use |
|---|---|---|---|
| `LLM01:2025` | Prompt Injection | `2_0_vulns/LLM01_PromptInjection.md` | Prompt injection, jailbreak, direct/indirect injection, adversarial testing |
| `LLM02:2025` | Sensitive Information Disclosure | `2_0_vulns/LLM02_SensitiveInformationDisclosure.md` | Sensitive data handling, leakage prevention, prompt/context/log review |
| `LLM06:2025` | Excessive Agency | `2_0_vulns/LLM06_ExcessiveAgency.md` | Tool authorization, least privilege, human approval, complete mediation |
| `LLM07:2025` | System Prompt Leakage | `2_0_vulns/LLM07_SystemPromptLeakage.md` | System prompt leakage prevention and avoiding prompt-based security controls |
| `LLM08:2025` | Vector and Embedding Weaknesses | `2_0_vulns/LLM08_VectorAndEmbeddingWeaknesses.md` | RAG trust boundaries, retrieval access control, source validation |

## Project-Defined Mapping Notes

- The ELICIT controls are **not** MITRE, OWASP, NIST, ISO, CSA, or EU AI Act controls.
- MITRE and OWASP entries are used as source-grounded risk and technique references.
- Mappings from MITRE/OWASP entries to `LLM-*` controls are project-defined and should be treated as inferred unless a future source explicitly defines the relationship.
- NIST AI RMF and EU AI Act references in the app are relevance indicators only. They are not compliance determinations.
- The local custom technique `AML.T0051.DC` is not an official MITRE ATLAS technique. It is a local variant for delimiter-confusion testing under the broader prompt-injection family.

## Review Checklist

Before publishing a report or demo:

- Confirm source dates are current enough for the purpose.
- Separate directly sourced taxonomy language from project-defined control language.
- Avoid legal, audit, certification, or regulatory conclusions.
- Keep sensitive evidence minimized and sanitized.
- Label local/custom variants clearly.
