# Control Mapping Matrix

This matrix connects ELICIT's project-defined controls to MITRE ATLAS and OWASP LLM Top 10 references.
Mappings are traceability aids and should be treated as inferred unless noted otherwise.

| Control | Control Name | Primary MITRE ATLAS Relevance | Primary OWASP LLM Relevance | Evidence the Lab Can Produce |
|---|---|---|---|---|
| `LLM-GOV-001` | AI System Inventory and Use-Case Classification | System boundary context for all evaluated techniques | System boundary context for all categories | Model/runtime metadata, prompt profile, system inventory notes |
| `LLM-GOV-002` | AI Threat Modeling | `AML.T0051`, `AML.T0054`, `AML.T0056` | `LLM01:2025`, `LLM02:2025`, `LLM06:2025`, `LLM07:2025`, `LLM08:2025` | Evaluation case rationale, mapped threats, tested assumptions |
| `LLM-SEC-001` | Prompt Injection Resistance | `AML.T0051`, `AML.T0051.000`, `AML.T0051.001`, `AML.T0051.002` | `LLM01:2025` | Prompt injection result, response excerpt, evaluator decision |
| `LLM-SEC-002` | System Prompt Leakage Prevention | `AML.T0056`, `AML.T0051.000` | `LLM07:2025`, `LLM02:2025` | Prompt extraction result, leaked-fragment evidence, reviewer decision |
| `LLM-SEC-003` | RAG and External Content Trust Boundaries | `AML.T0051.001` | `LLM01:2025`, `LLM08:2025`, `LLM02:2025` | Indirect injection result, retrieved-content notes, source trust label |
| `LLM-SEC-004` | Tool-Use Authorization and Containment | `AML.T0053`, `AML.T0051`, `AML.T0054` | `LLM06:2025`, `LLM01:2025` | Unauthorized tool-use attempt, authorization evidence, approval record |
| `LLM-SEC-005` | Sensitive Data Handling | `AML.T0057`, `AML.T0056`, `AML.T0024.000`, `AML.T0024.001`, `AML.T0024.002` | `LLM02:2025`, `LLM07:2025`, `LLM08:2025` | Sensitive-output finding, redaction check, retrieval/access-control evidence |
| `LLM-EVAL-001` | Adversarial Evaluation and Regression Testing | `AML.T0051`, `AML.T0054`, `AML.T0056` | `LLM01:2025`, `LLM02:2025`, `LLM06:2025`, `LLM07:2025`, `LLM08:2025` | Evaluation suite run, baseline result, regression result |
| `LLM-EVAL-002` | Evaluation Evidence Retention | Evidence-retention support for all evaluated techniques | Evidence-retention support for all categories | Run ID, case ID/version, model metadata, response excerpt, mapped controls |
| `LLM-MON-001` | AI Output Monitoring and Incident Detection | `AML.T0051`, `AML.T0054`, `AML.T0056`, `AML.T0057` | `LLM01:2025`, `LLM02:2025`, `LLM06:2025`, `LLM07:2025` | Detection indicator, flagged output, incident ticket reference |
| `LLM-OPS-001` | AI Incident Response | `AML.T0051`, `AML.T0054`, `AML.T0056`, `AML.T0057` | `LLM01:2025`, `LLM02:2025`, `LLM06:2025`, `LLM07:2025`, `LLM08:2025` | Containment note, remediation action, retest evidence |
| `LLM-TPRM-001` | AI Vendor and Model Provider Risk | Provider and dependency context | `LLM03:2025`, `LLM02:2025`, `LLM06:2025` | Vendor review notes, provider data-use terms, model change record |

## Example Traceability Paths

### Direct Prompt Injection

```text
Evaluation case DI-001
-> MITRE ATLAS AML.T0051 / AML.T0051.000
-> OWASP LLM01:2025 Prompt Injection
-> LLM-SEC-001 Prompt Injection Resistance
-> LLM-EVAL-001 Adversarial Evaluation and Regression Testing
-> Finding evidence + retest guidance
```

### Indirect Prompt Injection / RAG

```text
Evaluation case IND-001
-> MITRE ATLAS AML.T0051.001
-> OWASP LLM01:2025 Prompt Injection
-> OWASP LLM08:2025 Vector and Embedding Weaknesses
-> LLM-SEC-003 RAG and External Content Trust Boundaries
-> LLM-SEC-001 Prompt Injection Resistance
-> Finding evidence + source trust-boundary review
```

### System Prompt Leakage

```text
Evaluation case PE-001
-> MITRE ATLAS AML.T0056
-> OWASP LLM07:2025 System Prompt Leakage
-> LLM-SEC-002 System Prompt Leakage Prevention
-> LLM-SEC-005 Sensitive Data Handling
-> Finding evidence + prompt hygiene review
```
