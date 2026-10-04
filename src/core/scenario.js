// Branching scenario data. Pure functions, no DOM access.

/**
 * Normalises scenario data:
 *   { start: "a", nodes: { a: { title?, text, choices?: [{ text, goto }], end?, outcome? } } }
 * `nodes` may also be an array of objects with an `id`.
 * Choices that point to a missing node are dropped. A node with no choices is
 * treated as an ending. `problems` lists anything worth fixing, including
 * nodes that can never be reached.
 */
export function parseScenario(data) {
  const raw = data?.nodes;
  const entries = Array.isArray(raw) ? raw.map((n) => [n?.id, n]) : Object.entries(raw ?? {});
  const nodes = {};
  const problems = [];
  for (const [id, n] of entries) {
    if (!id || typeof n !== 'object' || n === null) continue;
    nodes[id] = {
      id: String(id),
      title: n.title ? String(n.title) : '',
      text: n.text ? String(n.text) : '',
      choices: (Array.isArray(n.choices) ? n.choices : []).map((c) => ({ text: String(c?.text ?? '').trim(), goto: String(c?.goto ?? '') })),
      end: Boolean(n.end),
      outcome: ['good', 'mixed', 'poor'].includes(n.outcome) ? n.outcome : '',
      feedback: n.feedback ? String(n.feedback) : '',
    };
  }
  for (const node of Object.values(nodes)) {
    node.choices = node.choices.filter((c) => {
      if (!c.text) return false;
      if (!nodes[c.goto]) {
        problems.push(`Node "${node.id}" has a choice pointing to missing node "${c.goto}".`);
        return false;
      }
      return true;
    });
    if (node.choices.length === 0) node.end = true;
  }
  const start = data?.start && nodes[data.start] ? String(data.start) : Object.keys(nodes)[0] || '';
  if (!start) problems.push('The scenario has no nodes.');
  const seen = new Set();
  const queue = start ? [start] : [];
  while (queue.length) {
    const id = queue.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    for (const c of nodes[id].choices) queue.push(c.goto);
  }
  for (const id of Object.keys(nodes)) {
    if (!seen.has(id)) problems.push(`Node "${id}" can never be reached.`);
  }
  return { start, nodes, problems };
}
