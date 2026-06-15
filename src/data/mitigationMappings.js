// Source-backed mitigation references plus project-defined action guidance.
// MITRE ATLAS entries preserve official IDs/names from mitre-atlas/atlas-data
// dist/ATLAS.yaml at commit da9ebf9b66e6902ad97c267e2a20af0bd996a60f.
// ELICIT recommended actions and retest guidance are project-defined.

export const MITIGATION_SET_VERSION = '0.2.0';

const mitreMitigation = (id, name, relationship = 'direct') => ({
  source: 'MITRE ATLAS',
  id,
  name,
  relationship,
  reference: `mitre-atlas/atlas-data dist/ATLAS.yaml#${id}`,
});

const MITRE_MITIGATIONS = {
  access_control: mitreMitigation('AML.M0019', 'Control Access to AI Models and Data in Production'),
  guardrails: mitreMitigation('AML.M0020', 'Generative AI Guardrails'),
  guidelines: mitreMitigation('AML.M0021', 'Generative AI Guidelines'),
  alignment: mitreMitigation('AML.M0022', 'Generative AI Model Alignment'),
  telemetry: mitreMitigation('AML.M0024', 'AI Telemetry Logging'),
  validation: mitreMitigation('AML.M0033', 'Input and Output Validation for AI Agent Components'),
};

const DEFAULT_GUIDANCE = {
  official_mitigations: [],
  recommended_mitigations: [
    'Review the mapped controls and confirm whether the observed behavior is reproducible.',
    'Preserve evidence, reviewer notes, and model/runtime metadata for retesting.',
    'Rerun the evaluation case after any prompt, model, retrieval, tool, or guardrail change.',
  ],
  retest_guidance: [
    'Rerun the same evaluation case against the current model and prompt profile.',
    'Compare current results with the prior known-good baseline when available.',
  ],
};

export const TECHNIQUE_MITIGATION_MAP = {
  'AML.T0051': {
    official_mitigations: [
      MITRE_MITIGATIONS.access_control,
      MITRE_MITIGATIONS.guardrails,
      MITRE_MITIGATIONS.guidelines,
      MITRE_MITIGATIONS.alignment,
      MITRE_MITIGATIONS.telemetry,
      MITRE_MITIGATIONS.validation,
    ],
    recommended_mitigations: [
      'Separate trusted instructions from untrusted user content.',
      'Constrain model behavior to the intended task and validate expected output formats with deterministic code.',
      'Avoid relying on prompt wording alone for security-critical controls.',
      'Add direct prompt-injection cases to regression testing before release.',
    ],
    retest_guidance: [
      'Rerun direct prompt-injection cases DI-001 through DI-006.',
      'Confirm the model treats adversarial instructions as user content and does not reveal hidden instructions or abandon its role.',
    ],
  },
  'AML.T0051.000': {
    official_mitigations: [
      MITRE_MITIGATIONS.telemetry,
      MITRE_MITIGATIONS.validation,
    ],
    recommended_mitigations: [
      'Separate trusted instructions from direct user input.',
      'Treat user-supplied XML, JSON, markdown, transcript text, and delimiter-like content as data, not message boundaries.',
      'Validate outputs against the expected task and format.',
      'Use deterministic authorization outside the model for sensitive actions.',
    ],
    retest_guidance: [
      'Rerun direct prompt-injection and delimiter-confusion cases after prompt, model, or guardrail changes.',
    ],
  },
  'AML.T0051.001': {
    official_mitigations: [
      MITRE_MITIGATIONS.telemetry,
      MITRE_MITIGATIONS.validation,
    ],
    recommended_mitigations: [
      'Label retrieved documents, email, webpages, tickets, and tool outputs as untrusted content.',
      'Keep external content structurally separate from system and developer instructions.',
      'Use permission-aware retrieval and tenant-aware vector stores.',
      'Validate and sanitize content before indexing or retrieval.',
      'Test whether retrieved content can trigger tool calls or override task instructions.',
    ],
    retest_guidance: [
      'Rerun indirect prompt-injection cases IND-001 and related RAG tests.',
      'Verify the model summarizes or uses external content as data rather than instruction.',
    ],
  },
  'AML.T0051.002': {
    official_mitigations: [
      MITRE_MITIGATIONS.telemetry,
      MITRE_MITIGATIONS.validation,
    ],
    recommended_mitigations: [
      'Review event and user-action triggers that can introduce hidden instructions into context.',
      'Require explicit authorization for actions triggered by external events.',
      'Monitor delayed or conditional instruction patterns in long-running sessions.',
    ],
    retest_guidance: [
      'Rerun triggered-injection cases after workflow, event, or automation changes.',
    ],
  },
  'AML.T0054': {
    official_mitigations: [
      MITRE_MITIGATIONS.guardrails,
      MITRE_MITIGATIONS.guidelines,
      MITRE_MITIGATIONS.alignment,
    ],
    recommended_mitigations: [
      'Keep safety, authorization, and data-access controls outside the LLM where practical.',
      'Test common jailbreak strategies such as roleplay, fictionalization, instruction override, and multi-turn escalation.',
      'Monitor for partial compliance and evaluator disagreement, not only full success.',
    ],
    retest_guidance: [
      'Rerun jailbreak cases JB-001 through JB-007.',
      'Confirm the model does not adopt an unrestricted persona or bypass intended constraints.',
    ],
  },
  'AML.T0056': {
    official_mitigations: [
      MITRE_MITIGATIONS.guardrails,
      MITRE_MITIGATIONS.guidelines,
      MITRE_MITIGATIONS.alignment,
    ],
    recommended_mitigations: [
      'Treat system prompts as potentially discoverable.',
      'Remove secrets, credentials, internal architecture, authorization logic, and sensitive policy details from prompts.',
      'Enforce authorization and privilege boundaries outside the LLM.',
      'Add output checks for known sensitive prompt fragments or configuration patterns.',
    ],
    retest_guidance: [
      'Rerun system-prompt extraction cases PE-001 through PE-010.',
      'Escalate findings when output matches real prompt content, secrets, authorization logic, or exploitable internal rules.',
    ],
  },
};

export function getMitigationMapping(techniqueId) {
  return TECHNIQUE_MITIGATION_MAP[techniqueId] || DEFAULT_GUIDANCE;
}
