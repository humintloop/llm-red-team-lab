// Project-defined mitigation guidance for report generation.
// These are practical control recommendations informed by MITRE ATLAS and OWASP LLM references,
// but they are not official framework controls.

export const MITIGATION_SET_VERSION = '0.1.0';

const DEFAULT_GUIDANCE = {
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
    recommended_mitigations: [
      'Separate trusted instructions from direct user input.',
      'Validate outputs against the expected task and format.',
      'Use deterministic authorization outside the model for sensitive actions.',
    ],
    retest_guidance: [
      'Rerun direct prompt-injection cases after prompt, model, or guardrail changes.',
    ],
  },
  'AML.T0051.001': {
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
    recommended_mitigations: [
      'Review event and user-action triggers that can introduce hidden instructions into context.',
      'Require explicit authorization for actions triggered by external events.',
      'Monitor delayed or conditional instruction patterns in long-running sessions.',
    ],
    retest_guidance: [
      'Rerun triggered-injection cases after workflow, event, or automation changes.',
    ],
  },
  'AML.T0051.DC': {
    recommended_mitigations: [
      'Treat user-supplied XML, JSON, markdown, and transcript-like delimiters as data, not message boundaries.',
      'Use structured APIs or message channels rather than parsing trust levels from plain text.',
      'Add delimiter-confusion cases to the prompt-injection regression suite.',
    ],
    retest_guidance: [
      'Rerun delimiter-confusion cases DC-001 through DC-004.',
      'Confirm fake system, developer, assistant, XML, JSON, or markdown boundaries do not alter instruction priority.',
    ],
  },
  'AML.T0054': {
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
