/**
 * D1-4LS score computation for the site, mirroring the app's scoring engine
 * exactly: 20 indicators (0-2 each), summed into four 0-10 indices, and an
 * overall 0-40 that we present as a composite out of 10 (overall / 4).
 *
 * The site only READS these columns from the shared database; the app writes
 * them. This keeps the number on the front page identical to the app's.
 */

// snake_case column names as stored on news_stories
export const INDICATOR_COLUMNS = [
  'bai_scriptural_consistency', 'bai_doctrinal_integrity', 'bai_moral_framework', 'bai_anthropology', 'bai_teleology',
  'psi_textual_linkage', 'psi_eschatological_fit', 'psi_historical_continuity', 'psi_spiritual_impact', 'psi_theological_restraint',
  'sci_primary_source_access', 'sci_verification', 'sci_transparency', 'sci_track_record', 'sci_editorial_standards',
  'hii_human_dignity', 'hii_compassion_empathy', 'hii_societal_impact', 'hii_justice_responsibility', 'hii_christ_modeled_care',
];

export interface StoryScore {
  bai: number;   // 0-10
  psi: number;   // 0-10
  sci: number;   // 0-10
  hii: number;   // 0-10
  overall: number;    // 0-40
  composite: number;  // 0-10, overall / 4
  confidence?: string | null;
  hasScore: boolean;
  // D1-4LS v2.1 reader metadata (present once a story is published under v2.1).
  interpretation?: string | null;
  indexNotes?: { BAI?: string; PSI?: string; SCI?: string; HII?: string } | null;
  instrumentVersion?: string | null;
}

// D1-4LS v2.1: the composite is a DESCRIPTIVE band on the 0-40 total, secondary to
// the four-index profile. Never an evaluative grade, a probability, or a quality score.
export function compositeBand(overall: number): { key: 'very-high' | 'high' | 'intermediate' | 'low'; label: string; short: string } {
  if (overall >= 35) return { key: 'very-high', label: 'Very high composite profile', short: 'Very high' };
  if (overall >= 28) return { key: 'high', label: 'High composite profile', short: 'High' };
  if (overall >= 20) return { key: 'intermediate', label: 'Intermediate composite profile', short: 'Intermediate' };
  return { key: 'low', label: 'Low composite profile', short: 'Low' };
}

// Source-credibility alert (v2.1 Section 7): provisional editorial thresholds that
// surface sourcing limitations; they never declare a story false.
export function sciNotice(sci: number): { level: 'none' | 'limitation' | 'warning'; text: string } {
  if (sci <= 3) return { level: 'warning', text: 'Evidence warning: this story has material sourcing limitations. Weigh its factual claims accordingly.' };
  if (sci < 6) return { level: 'limitation', text: 'Sourcing limitation: read the Source Credibility notes before relying on this story’s factual claims.' };
  return { level: 'none', text: '' };
}

// Profile-balance descriptor from the spread of the four index totals (v2.1 Section 12).
export function profileBalance(s: { bai: number; psi: number; sci: number; hii: number }): { diff: number; label: string } {
  const vals = [s.bai, s.psi, s.sci, s.hii];
  const diff = Math.max(...vals) - Math.min(...vals);
  return { diff, label: diff <= 2 ? 'Relatively balanced' : diff <= 5 ? 'Moderately uneven' : 'Highly uneven' };
}

function clamp(v: unknown): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(2, n));
}

// The four indices, each with its five indicator columns and the display names
// the app and the Score-a-Story tool use, in the same order. Kept here so the
// per-indicator breakdown reads identically everywhere it is shown.
export interface IndexBreakdown {
  key: 'BAI' | 'PSI' | 'SCI' | 'HII';
  name: string;
  color: string;
  total: number; // 0-10
  indicators: { label: string; value: number }[]; // value 0-2
}

const BREAKDOWN_DEF: { key: IndexBreakdown['key']; name: string; color: string; items: [string, string][] }[] = [
  { key: 'BAI', name: 'Scriptural Grounding', color: '#C79A2E', items: [
    ['Scriptural Consistency', 'bai_scriptural_consistency'],
    ['Doctrinal Soundness', 'bai_doctrinal_integrity'],
    ['Christ-Centeredness', 'bai_moral_framework'],
    ['Image-Bearer Dignity', 'bai_anthropology'],
    ['Hope & Purpose', 'bai_teleology'],
  ] },
  { key: 'PSI', name: 'Kingdom Significance', color: '#2F5A8F', items: [
    ['Gospel Advance', 'psi_textual_linkage'],
    ['Movement of God', 'psi_eschatological_fit'],
    ['Redemption & Transformation', 'psi_historical_continuity'],
    ['Answered Prayer', 'psi_spiritual_impact'],
    ['Discernment & Restraint', 'psi_theological_restraint'],
  ] },
  { key: 'SCI', name: 'Source Credibility', color: '#6B7280', items: [
    ['Primary-Source Access', 'sci_primary_source_access'],
    ['Verification & Corroboration', 'sci_verification'],
    ['Outlet Transparency', 'sci_transparency'],
    ['Track Record', 'sci_track_record'],
    ['Editorial Standards', 'sci_editorial_standards'],
  ] },
  { key: 'HII', name: 'Fruit & Edification', color: '#3F7A5A', items: [
    ['Faith Encouragement', 'hii_human_dignity'],
    ['Compassion & Mercy', 'hii_compassion_empathy'],
    ['Fruit of the Spirit', 'hii_societal_impact'],
    ['Justice & Righteousness', 'hii_justice_responsibility'],
    ['Glory to God', 'hii_christ_modeled_care'],
  ] },
];

/** Per-indicator breakdown of a scored row, grouped by index. */
export function breakdownFromRow(row: Record<string, any>): IndexBreakdown[] {
  return BREAKDOWN_DEF.map((d) => {
    const indicators = d.items.map(([label, col]) => ({ label, value: clamp(row[col]) }));
    return {
      key: d.key,
      name: d.name,
      color: d.color,
      total: indicators.reduce((s, i) => s + i.value, 0),
      indicators,
    };
  });
}

/** Build a StoryScore from a DB row that includes the 20 indicator columns. */
export function scoreFromRow(row: Record<string, any>): StoryScore {
  // If the indicator columns are absent/null, treat as unscored.
  const present = INDICATOR_COLUMNS.some((c) => row[c] !== null && row[c] !== undefined);
  const g = (c: string) => clamp(row[c]);

  const bai = g('bai_scriptural_consistency') + g('bai_doctrinal_integrity') + g('bai_moral_framework') + g('bai_anthropology') + g('bai_teleology');
  const psi = g('psi_textual_linkage') + g('psi_eschatological_fit') + g('psi_historical_continuity') + g('psi_spiritual_impact') + g('psi_theological_restraint');
  const sci = g('sci_primary_source_access') + g('sci_verification') + g('sci_transparency') + g('sci_track_record') + g('sci_editorial_standards');
  const hii = g('hii_human_dignity') + g('hii_compassion_empathy') + g('hii_societal_impact') + g('hii_justice_responsibility') + g('hii_christ_modeled_care');
  const overall = bai + psi + sci + hii;

  // v2.1 metadata, present only when the query selected these columns and the
  // story was published under v2.1. index_notes may arrive as a JSON string.
  let indexNotes = row['d14ls_index_notes'] ?? null;
  if (typeof indexNotes === 'string') { try { indexNotes = JSON.parse(indexNotes); } catch { indexNotes = null; } }

  return {
    bai, psi, sci, hii,
    overall,
    composite: overall / 4,
    confidence: row['score_confidence'] ?? null,
    hasScore: present,
    interpretation: row['d14ls_interpretation'] ?? null,
    indexNotes,
    instrumentVersion: row['d14ls_instrument_version'] ?? null,
  };
}
