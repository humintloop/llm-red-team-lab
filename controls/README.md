# Controls

This directory is a placeholder for the lightweight LLM SaaS Security & Assurance Control Set.

The implemented v0.2 mappings currently live in `src/data/frameworkMappings.js`, where techniques map to control IDs, NIST AI RMF functions, and EU AI Act relevance notes. Keep this directory in sync if the control set grows into standalone documentation.

Example traceability path:

```text
AML.T0051 prompt injection result
-> LLM-SEC-001 Prompt Injection Resistance
-> LLM-EVAL-001 Adversarial Evaluation & Regression Testing
-> NIST AI RMF Measure / Manage relevance
```
