import { ASSURANCE_PROFILE, CONTROL_SET, CONTROL_SET_VERSION, FRAMEWORK_MAPPING_VERSION, FRAMEWORK_REFERENCES, getMappedControls } from '../data/frameworkMappings';
import { getMitigationMapping, MITIGATION_SET_VERSION } from '../data/mitigationMappings';

const truncate = (value = '', max = 1800) => {
  const text = String(value || '');
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const list = (items = []) => items.length ? items.map(item => `- ${item}`).join('\n') : '- None recorded';

const section = (title, value) => {
  const text = String(value || '').trim();
  return text ? `### ${title}\n${text}\n\n` : '';
};

const controlList = (ids = []) => {
  const controls = getMappedControls(ids);
  return controls.length
    ? controls.map(c => `- ${c.id} — ${c.name}: ${c.objective}`).join('\n')
    : '- None mapped';
};

const frameworkList = (finding = {}) => {
  const lines = [];
  if (finding.techniqueId) lines.push(`- MITRE ATLAS: ${finding.techniqueId} — ${finding.techniqueName || FRAMEWORK_REFERENCES.mitre_atlas[finding.techniqueId] || 'Mapped technique'}`);
  if (finding.owasp) lines.push(`- OWASP LLM Top 10: ${finding.owasp} — ${FRAMEWORK_REFERENCES.owasp[finding.owasp] || 'Mapped risk category'}`);
  (finding.nistAiRmf || finding.nist_ai_rmf || []).forEach(fn => lines.push(`- NIST AI RMF: ${fn}`));
  (finding.iso42001Relevance || finding.iso_42001_relevance || []).forEach(clause => lines.push(`- ISO/IEC 42001 relevance: ${clause} — ${FRAMEWORK_REFERENCES.iso_42001[clause] || 'Relevant AI management system performance-evaluation evidence'}`));
  (finding.euAiActRelevance || finding.eu_ai_act_relevance || []).forEach(article => lines.push(`- EU AI Act readiness relevance: ${article} — ${FRAMEWORK_REFERENCES.eu_ai_act[article] || 'Relevant obligation if system is in scope'}`));
  return lines.length ? lines.join('\n') : '- None mapped';
};

export function buildFindingMarkdown(finding) {
  const controls = finding.mappedControls || finding.mapped_controls || [];
  const mitigation = getMitigationMapping(finding.techniqueId);
  const recommendedMitigations = finding.recommendedMitigations || finding.recommended_mitigations || mitigation.recommended_mitigations;
  const retestGuidance = finding.retestGuidance || finding.retest_guidance || mitigation.retest_guidance;
  const readinessGaps = finding.readinessGaps || finding.readiness_gaps || [];
  const evidenceRequirements = finding.evidenceRequirements || finding.evidence_requirements || [];
  return `## Finding: ${finding.payloadName || finding.caseName || 'Untitled Evaluation Case'}

**Run ID:** ${finding.runId || finding.id || 'Not recorded'}<br>
**Finding ID:** ${finding.findingId || finding.id || 'Not recorded'}<br>
**Verdict:** ${finding.verdict || 'Unknown'}<br>
**Review Status:** ${finding.reviewStatus || 'Not recorded'}<br>
**Reviewer Decision:** ${finding.reviewerDecision || 'UNREVIEWED'}<br>
**Verdict Source:** ${finding.finalVerdictSource || 'Not recorded'}<br>
**Test Case:** ${finding.caseId || finding.payloadId || 'custom'}<br>
**Case Version:** ${finding.caseVersion || finding.case_version || 'Not recorded'}<br>
**Technique:** ${finding.techniqueId || 'Unmapped'} — ${finding.techniqueName || ''}<br>
**OWASP:** ${finding.owasp || 'Unmapped'}<br>
**Victim Model:** ${finding.victimModel || 'Not recorded'}<br>
**Runtime:** ${finding.victimRuntime || 'Not recorded'}<br>
**Timestamp:** ${finding.timestamp || 'Not recorded'}

${section('Case Description', finding.caseDescription || finding.description)}
${section('Objective', finding.objective)}
${section('Expected Secure Behavior', finding.expectedSecureBehavior || finding.expected_secure_behavior)}
${section('Failure Mode', finding.failureMode || finding.failure_mode)}
${section('Success / Failure Criteria', finding.successCriteria || finding.success_criteria)}
### Response Excerpt
> ${truncate(finding.evidenceExcerpt || finding.responseExcerpt || finding.response || '', 1000).replace(/\n/g, '\n> ')}

### Evaluation Rationale
- Heuristic Verdict: ${finding.heuristicVerdict || 'Not recorded'}${finding.heuristicLabel ? ` (${finding.heuristicLabel})` : ''}
- Heuristic Rationale: ${finding.evalReason || 'Not recorded'}
- LLM Judge Verdict: ${finding.judgeVerdict || 'Not used'}
- LLM Judge Rationale: ${finding.judgeRationale || finding.judgeReason || 'Not used or not recorded'}
- Evaluation Disagreement: ${finding.evaluationDisagreement ? 'Yes — manual review required' : 'No material disagreement recorded'}
- Evaluation Note: ${finding.evaluationNote || 'None'}
- Reviewer Notes: ${finding.reviewerNotes || finding.notes || 'None recorded'}

### Evidence Requirements
${list(evidenceRequirements)}

### Impacted Controls
${controlList(controls)}

### Framework Relevance
${frameworkList(finding)}

### Framework Readiness Gaps
${list(readinessGaps)}

### Recommended Mitigations
${list(recommendedMitigations)}

### Retest Guidance
${list(retestGuidance)}

### Prompt Payload
\`\`\`text
${truncate(finding.payload || '', 1800)}
\`\`\`

### Stored Response Excerpt
\`\`\`text
${truncate(finding.responseFull || finding.response || '', 2500)}
\`\`\`
`;
}

export function generateAssessmentReport(findings = [], metadata = {}) {
  const date = new Date().toISOString();
  const successful = findings.filter(f => ['SUCCESS', 'PARTIAL'].includes(f.verdict)).length;
  const controlIds = [...new Set(findings.flatMap(f => f.mappedControls || f.mapped_controls || []))];
  const controls = controlIds.map(id => CONTROL_SET[id]).filter(Boolean);

  return `# LLM Adversarial Evaluation Report

Generated: ${date}  
Assessment ID: ${metadata.assessmentId || `assessment-${date.slice(0, 10)}`}  
Assurance Profile: ${metadata.assuranceProfile || ASSURANCE_PROFILE.label}<br>
Control Set Version: ${CONTROL_SET_VERSION}<br>
Framework Mapping Version: ${FRAMEWORK_MAPPING_VERSION}<br>
Mitigation Set Version: ${MITIGATION_SET_VERSION}

## Executive Summary

This report summarizes locally executed adversarial evaluation cases against one or more browser-hosted LLMs. The lab treats findings as **lightweight evidence indicators**: a successful or partial adversarial result indicates a potential control weakness that should be reviewed, reproduced, remediated, and retested. Framework mappings are provided for traceability and do not constitute legal, audit, or certification conclusions.

- Findings logged: ${findings.length}
- Successful or partial findings: ${successful}
- Unique impacted controls: ${controlIds.length}

## Framework Readiness Lens

This report uses the **${ASSURANCE_PROFILE.label}** profile for AI-enabled SaaS, cybersecurity, edge, cloud, or critical digital infrastructure providers. ISO/IEC 42001 references focus on Clause 9 performance-evaluation evidence: monitoring and measurement, internal audit, and management review. EU AI Act references are high-risk readiness indicators only; classification depends on the specific AI system, intended purpose, jurisdiction, and whether it is used as a safety component in critical digital infrastructure or another high-risk category.

Profile scope note: ${ASSURANCE_PROFILE.scope_note}

## Scope and Methodology

The evaluation workflow is:

1. Select a victim system prompt and local WebLLM model.
2. Run a structured adversarial evaluation case.
3. Capture the model response and local heuristic result.
4. Optionally run a separate local judge model.
5. Log a lightweight finding record with response excerpts, evaluator outputs, control mapping, and framework relevance.

## Impacted Control Summary

${controls.length ? controls.map(c => `- ${c.id} — ${c.name} (${c.domain})`).join('\n') : '- No mapped controls recorded'}

## Findings

${findings.length ? findings.map(buildFindingMarkdown).join('\n---\n\n') : 'No findings logged.'}

## Limitations

- This lab evaluates local model behavior and does not prove exploitability against production systems.
- Results can vary by model, quantization, prompt, temperature, context, and runtime.
- The heuristic evaluator is triage-oriented; \`REVIEW\` or \`PARTIAL\` should not be treated as a final pass/fail conclusion.
- LLM-as-judge mode can introduce evaluator bias or prompt-injection risk; judge outputs should be treated as supporting evidence, not ground truth.
- Material disagreement between heuristic and judge results is intentionally preserved as a manual-review signal.
- ISO/IEC 42001 and EU AI Act references are relevance mappings only and depend on system role, risk classification, management-system scope, and jurisdictional scope.
`;
}

export function downloadMarkdown(filename, markdown) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
