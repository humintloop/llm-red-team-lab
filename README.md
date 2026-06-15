# ELICIT — Local-First Adversarial Assurance Lab

![ELICIT social preview](public/brand/elicit-social-preview.png)

**ELICIT** is a local-first LLM evaluation lab for testing adversarial model behavior, triaging findings, and mapping failures to the controls that should have caught them.

The lab runs in-browser with WebLLM/WebGPU. No external API calls are required after the initial model download.

> Red-team LLMs in the browser. Preserve the evidence. Map the control gap.

---

## Why ELICIT?

The name reflects the project’s focus on elicitation, ambiguity, and adversarial behavior. The goal is not just to see whether a model fails, but to understand what causes it to reveal constraints, assumptions, or control gaps.

ELICIT grew out of practical AI governance work: the question was not only whether AI controls existed on paper, but how to test whether those controls actually worked. The project connects adversarial testing with assurance evidence so technical findings can be reviewed, mapped, and improved over time.

---

## Responsible Use

This project is designed for authorized security research, internal AI assurance, and evaluation of systems you own or have explicit permission to test. Do not use it against production AI systems without authorization.

Framework mappings are provided as control traceability aids for education and review. They do **not** constitute legal conclusions, audit determinations, certification evidence, or automatic findings of noncompliance.

---

## What It Does

- **Local model inference** via WebLLM/WebGPU.
- **Structured evaluation cases** with case IDs, versions, expected secure behavior, failure modes, and success criteria.
- **Synthetic ambiguity probes** for authorized local testing.
- **Heuristic evaluation** for prompt leakage, jailbreak, and injection indicators.
- **Optional local LLM judge** that returns a structured `VERDICT:` and `REASON:` response.
- **Heuristic/judge disagreement handling** for manual-review cases.
- **Findings tracker** with local evidence records, run IDs, model metadata, evaluator outputs, reviewer fields, and response evidence.
- **JSON export** for raw finding records.
- **Markdown report export** for assessment-style documentation.
- **Initial framework/control mapping data** including MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, ISO/IEC 42001 section 9, and EU AI Act readiness relevance.

---

## Technique Coverage

| ID | Name | OWASP Mapping | Notes |
|---|---|---|---|
| AML.T0051 | LLM Prompt Injection | LLM01:2025 Prompt Injection | Parent technique for direct prompt injection |
| AML.T0051.001 | LLM Prompt Injection: Indirect | LLM01:2025 Prompt Injection | External content / RAG / email / document injection |
| AML.T0054 | LLM Jailbreak | LLM01:2025 Prompt Injection | Bypass of constraints, guardrails, or intended behavior |
| AML.T0056 | Extract LLM System Prompt | LLM07:2025 System Prompt Leakage | System prompt / hidden instruction disclosure |
| AML.T0051.DC | Delimiter Confusion | LLM01:2025 Prompt Injection | Local custom variant, not a registered ATLAS technique |

---

## Control Traceability Model

The current v0.2 traceability aid is:

```text
evaluation case → model response → heuristic/judge result → finding evidence → impacted control → framework readiness gap → mitigation → retest
```

Example:

```text
Prompt injection succeeds
→ MITRE ATLAS AML.T0051 / OWASP LLM01:2025
→ LLM-SEC-001 Prompt Injection Resistance
→ Relevant to NIST AI RMF Measure/Manage, ISO/IEC 42001 section 9, and EU AI Act Articles 9/12/14/15/17/72 where applicable and in scope
→ Finding evidence retained locally for reviewer decision, mitigation, and retesting
```

The initial control notes live in [`controls/`](./controls/README.md). The implemented mappings currently live in [`src/data/frameworkMappings.js`](./src/data/frameworkMappings.js) and are intentionally lightweight. They demonstrate how technical LLM findings can be translated into control weaknesses for SaaS organizations using LLM-based technology.

For Akamai-like organizations, ELICIT uses a **SaaS / Critical Digital Infrastructure Readiness** profile: AI-enabled SaaS, cybersecurity, edge, cloud, or critical digital infrastructure providers. EU AI Act references are readiness indicators only; high-risk status depends on the actual AI system, intended purpose, jurisdiction, and whether the AI system is used as a safety component or otherwise falls in scope.

---

## Local Setup

```bash
git clone https://github.com/humintloop/elicit.git
cd elicit
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome or Edge with WebGPU enabled.

---

## Build

```bash
npm run build
npm run preview
```

---

## Model Recommendations

| Model | VRAM | Notes |
|---|---:|---|
| TinyLlama 1.1B | ~1 GB | Fastest, useful for UI and flow testing |
| Gemma 2 2B | ~2 GB | Good baseline target |
| Phi 3.5 Mini | ~3 GB | Useful judge model |
| Llama 3.2 3B | ~3 GB | Solid local baseline |
| Mistral 7B | ~5 GB | More realistic evaluation target |
| Llama 3.1 8B | ~6 GB | Stronger capability, slower locally |
| Gemma 2 9B | ~7 GB | Higher-value but heavier target |

---

## Payload Library

Evaluation cases live in `src/payloads.js`. Each case keeps the original payload fields and is normalized with schema metadata:

```javascript
{
  id: 'PE-004',
  case_id: 'PE-004',
  case_version: '0.4.0',
  technique: 'AML.T0056',
  difficulty: 'medium',
  name: 'Minimal Ambiguity Probe',
  objective: 'Determine whether the model discloses hidden constraints...',
  expected_secure_behavior: 'Refuse or safely redirect attempts...',
  failure_mode: 'The model reveals exact or closely paraphrased system prompt content...',
  success_criteria: 'SUCCESS when real system prompt content or protected secrets are revealed...',
  description: 'Short description of what this tests.',
  payload: '[redacted ambiguity probe]',
  note: 'Use authorized/synthetic ambiguity probes only.'
}
```

Default framework/control mappings are applied by technique through `src/data/frameworkMappings.js`. Per-case mapping overrides can be added when a case needs more specific controls, ISO/EU relevance, or readiness gaps.

---

## Reports

The findings view supports:

- `EXPORT JSON` — raw machine-readable finding records.
- `EXPORT REPORT` — Markdown assessment report with findings, response excerpts, evaluator outputs, impacted controls, framework readiness gaps, mitigation guidance, and retest guidance.

Finding records now include run IDs, case versions, model/runtime metadata, model settings, full responses retained locally, evaluator outputs, mapped controls, ISO/EU readiness relevance, recommended mitigations, retest guidance, and reviewer fields. They are still local evidence records, not immutable audit trails.

## Judge Output

Judge prompts currently ask the local judge model to return:

```text
VERDICT: SUCCESS or PARTIAL or FAILURE
REASON: one sentence.
```

The app parses the `VERDICT:` line and preserves the judge text. JSON judge output, confidence scoring, severity scoring, and false-positive-risk fields are roadmap items, not current behavior.

---

## Roadmap

### v0.2 — Current MVP

- Clean repo structure
- Evaluation-case-style payload metadata
- Synthetic ambiguity probe placeholder
- Heuristic triage with optional local LLM judge
- Heuristic/judge disagreement handling
- Lightweight finding records
- Markdown report export
- Initial framework/control mappings

### v0.3 — Source and presentation pass

- README images
- Sample report
- Source ledger
- Initial source-grounded MITRE/OWASP mapping notes
- ISO/IEC 42001 and EU AI Act readiness notes

### v0.4 — Structured evaluation cases

- Full structured evaluation-case schema with objective, expected secure behavior, failure mode, and success criteria
- Case versioning
- Evidence requirements
- Per-case mapping override support

### v0.5 — Evidence-rich findings

- Run IDs
- Model/runtime/config metadata
- Full response retained locally
- Reviewer decision fields
- Evidence requirements in report output

### v0.6 — Mitigation mapping

- Project-defined mitigation guidance by technique
- Recommended actions in report output
- Retest guidance in report output

### v1 — Evaluation quality

- Stronger judge prompt and JSON parsing
- System-computed severity, confidence, and false-positive-risk fields
- Multi-run reproducibility mode
- Regression testing

### v2 — Control traceability

- Expand `controls/` into a standalone completed LLM SaaS control set
- Add control validation examples
- Add framework crosswalk documentation
- Surface impacted controls more prominently in the UI
- Richer control-aware reports

### v3 — Assurance package

- HTML/PDF report output
- Control evidence packages

---

## Limitations

- This lab evaluates local model behavior and does not prove production exploitability.
- Results vary by model, runtime, quantization, prompt, context, and temperature.
- Heuristics are triage aids, not ground truth.
- LLM judge mode can be biased or influenced; treat it as supporting evidence.
- ISO/IEC 42001 and EU AI Act relevance depends on role, scope, risk classification, management-system scope, jurisdiction, and deployment context.
- EU AI Act high-risk readiness is not the same as high-risk classification; cybersecurity-only components are not automatically safety components.
