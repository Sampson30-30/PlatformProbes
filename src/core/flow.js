// DOM-free logic for <lk-flow>. Input is a plain model:
//   items: [{ text, detail?, type?, branches?: [{ label, items: [...] }] }]
// `text` is the short title shown in the chart. `detail` is optional longer
// wording, shown when the learner arrives at that step.
// A sequence runs in order. An item with branches is a decision: each branch
// is its own sequence, and when the branches end they rejoin whatever follows
// the decision (unless a branch ends with an item of type "end", or the flow
// is a tree, where branches never rejoin).

const TYPES = new Set(['start', 'end', 'step', 'decision']);

/**
 * Numbers the items, works out each one's type, and builds the graph the
 * walk-through follows.
 * Returns { items, nodes, start, warnings }:
 *   items     the model, with `id`, `type`, `hasNext` and, for branches, `joins`
 *   nodes     { [id]: { id, text, detail, type, edges: [{ to, label }] } }
 *   start     id of the first node, or null when there are no items
 *   warnings  things in the source that were ignored
 */
export function prepare(items, { rejoin = true } = {}) {
  const warnings = [];
  let counter = 0;

  function number(list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.id = `n${++counter}`;
      item.text = String(item.text ?? '').trim();
      item.detail = String(item.detail ?? '').trim();
      const branches = (item.branches ?? []).filter((b) => b && Array.isArray(b.items));
      item.branches = branches.length ? branches : null;
      item.type = TYPES.has(item.type) ? item.type : item.branches ? 'decision' : 'step';
      if (item.type === 'end' && item.branches) {
        warnings.push(`"${item.text}" is an end, so its branches were ignored.`);
        item.branches = null;
      }
      if (item.type === 'decision' && !item.branches) item.type = 'step';
      if (!rejoin && item.branches && i < list.length - 1) {
        warnings.push(`In a tree, nothing can follow a decision, so ${list.length - 1 - i} item(s) after "${item.text}" were ignored.`);
        list.length = i + 1;
      }
      item.hasNext = i < list.length - 1;
      for (const branch of item.branches ?? []) {
        branch.label = String(branch.label ?? '').trim();
        number(branch.items);
      }
    }
  }
  number(items);

  // Does control leave this sequence at the bottom, rather than stopping?
  function flowsOut(list) {
    if (list.length === 0) return true;
    const last = list[list.length - 1];
    if (last.type === 'end') return false;
    return last.branches ? last.branches.some((b) => flowsOut(b.items)) : true;
  }
  // A branch joins when something follows the decision, here or further out.
  (function mark(list, outerContinues) {
    for (const item of list) {
      const continues = item.hasNext || outerContinues;
      for (const branch of item.branches ?? []) {
        branch.joins = rejoin && continues && flowsOut(branch.items);
        mark(branch.items, continues);
      }
    }
  })(items, false);

  const nodes = {};
  // Built from the end backwards, so every item knows what comes after it.
  function build(list, after) {
    let next = after;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      const node = { id: item.id, text: item.text, detail: item.detail, type: item.type, edges: [] };
      if (item.type !== 'end') {
        if (item.branches) {
          node.edges = item.branches.map((b) => ({ to: build(b.items, rejoin ? next : null), label: b.label }));
        } else if (next) {
          node.edges = [{ to: next, label: '' }];
        }
      }
      nodes[node.id] = node;
      next = node.id;
    }
    return next;
  }
  const start = build(items, null);
  // An empty branch points straight at what follows; drop edges that point nowhere.
  for (const node of Object.values(nodes)) node.edges = node.edges.filter((e) => e.to);
  return { items, nodes, start, warnings };
}

/** A walk-through begins at the start node. */
export function walkStart(graph) {
  return graph.start ? { path: [{ id: graph.start, from: null, index: -1, label: '' }] } : { path: [] };
}

/** The node the learner is on, or null. */
export function walkCurrent(graph, state) {
  const last = state.path[state.path.length - 1];
  return last ? graph.nodes[last.id] : null;
}

/** What the learner can choose now: the current node's edges, with usable labels. */
export function walkOptions(graph, state) {
  const node = walkCurrent(graph, state);
  if (!node) return [];
  return node.edges.map((edge, index) => ({
    index,
    to: edge.to,
    label: edge.label || (node.edges.length > 1 ? `Option ${index + 1}` : 'Next'),
  }));
}

/** Takes the edge at `index`. Returns a new state, or the same one if there is no such edge. */
export function walkChoose(graph, state, index) {
  const node = walkCurrent(graph, state);
  const edge = node?.edges[index];
  if (!edge) return state;
  return { path: [...state.path, { id: edge.to, from: node.id, index, label: edge.label }] };
}

/** One step back. The start cannot be undone. */
export function walkBack(state) {
  return state.path.length > 1 ? { path: state.path.slice(0, -1) } : state;
}

/** True when there is nowhere further to go. */
export function walkFinished(graph, state) {
  const node = walkCurrent(graph, state);
  return !node || node.edges.length === 0;
}

/** The route so far as readable text: ["Was it on time?", "No", "Apply the penalty"]. */
export function routeText(graph, state) {
  const out = [];
  for (const step of state.path) {
    if (step.label) out.push(step.label);
    out.push(graph.nodes[step.id].text);
  }
  return out;
}
