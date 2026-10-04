// Builds the CSS a customiser exports. Pure functions, no DOM access.

/** Every token the customiser can change, in the order they are written out. */
export const TOKEN_ORDER = [
  'font', 'font-heading',
  'color-page', 'color-bg', 'color-surface', 'color-text', 'color-muted',
  'color-border', 'color-divider', 'color-primary', 'color-primary-text', 'color-focus', 'color-backdrop',
  'color-success', 'color-success-bg', 'color-warning', 'color-warning-bg',
  'color-danger', 'color-danger-bg', 'color-info', 'color-info-bg',
  'radius', 'radius-control', 'border-width', 'shadow', 'space',
];

/**
 * Cleans a token value for use in CSS. Returns the trimmed value, or null if
 * it is empty or could break out of the declaration.
 */
export function sanitizeValue(value) {
  const v = String(value ?? '').trim();
  if (!v || /[;{}<>\\]|\/\*|\*\//.test(v)) return null;
  return v;
}

function declarations(changes, indent) {
  const pad = ' '.repeat(indent);
  return TOKEN_ORDER.flatMap((name) => {
    const value = sanitizeValue(changes[name]);
    return value ? [`${pad}--lk-${name}: ${value};`] : [];
  }).join('\n');
}

/**
 * Builds a stylesheet of overrides.
 *   base    id of the theme being customised, or '' for the default look
 *   light   colour changes for light mode: { 'color-primary': '#123456' }
 *   dark    colour changes for dark mode
 *   shared  changes that apply in both modes (radius, shadow, fonts, spacing)
 * Only the tokens you pass are written. Load the result after the base theme.
 */
export function buildOverrideCss({ base = '', light = {}, dark = {}, shared = {} } = {}) {
  const safeBase = /^[a-z0-9-]*$/.test(base) ? base : '';
  const root = safeBase ? `[data-lk-theme='${safeBase}']` : ':root';
  const target = safeBase ? `the "${safeBase}" theme` : 'the default look';
  const after = safeBase ? `learnkit.css and themes/${safeBase}.css` : 'learnkit.css';
  const header = `/* LearnKit customisation of ${target}. Load this after ${after}. */\n`;

  const lightBody = declarations({ ...shared, ...light }, 4);
  const darkBody = declarations({ ...shared, ...dark }, 4);
  const darkMedia = declarations({ ...shared, ...dark }, 6);
  if (!lightBody && !darkBody) return `${header}\n/* No changes yet. */\n`;

  const blocks = [];
  if (lightBody) blocks.push(`  ${root} {\n${lightBody}\n  }`);
  if (darkBody) {
    const mediaSelector = safeBase ? `${root}:not([data-lk-mode='light'])` : ":root:not([data-lk-mode='light'])";
    const attrSelector = safeBase ? `${root}[data-lk-mode='dark']` : "[data-lk-mode='dark']";
    blocks.push(`  @media (prefers-color-scheme: dark) {\n    ${mediaSelector} {\n${darkMedia}\n    }\n  }`);
    blocks.push(`  ${attrSelector} {\n${darkBody}\n  }`);
  }
  return `${header}\n@layer lk.theme {\n${blocks.join('\n\n')}\n}\n`;
}
