// DOM-free logic for <lk-tree>. A tree is an array of nodes in document order:
// { parent: index or -1, hasChildren: boolean }. `expanded` is a Set of indexes.

/** Indexes the learner can currently see: every ancestor is expanded. */
export function visibleIndexes(nodes, expanded) {
  const out = [];
  nodes.forEach((node, i) => {
    let ok = true;
    for (let p = node.parent; p >= 0; p = nodes[p].parent) {
      if (!expanded.has(p)) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(i);
  });
  return out;
}

/** The nesting depth of a node, starting at 1. */
export function levelOf(nodes, index) {
  let level = 1;
  for (let p = nodes[index].parent; p >= 0; p = nodes[p].parent) level += 1;
  return level;
}

/**
 * What a key does to a tree, following the WAI-ARIA tree pattern.
 * Returns { focus, open, close, expandSiblings, activate }: where focus goes,
 * and any expand or collapse that should happen.
 */
export function treeKey(nodes, expanded, focus, key) {
  const result = { focus, open: null, close: null, expandSiblings: null, activate: false };
  const visible = visibleIndexes(nodes, expanded);
  const at = visible.indexOf(focus);
  const node = nodes[focus];
  if (!node) return result;

  switch (key) {
    case 'ArrowDown':
      if (at < visible.length - 1) result.focus = visible[at + 1];
      break;
    case 'ArrowUp':
      if (at > 0) result.focus = visible[at - 1];
      break;
    case 'Home':
      result.focus = visible[0];
      break;
    case 'End':
      result.focus = visible[visible.length - 1];
      break;
    case 'ArrowRight':
      if (node.hasChildren) {
        if (!expanded.has(focus)) result.open = focus;
        else if (at < visible.length - 1) result.focus = visible[at + 1];
      }
      break;
    case 'ArrowLeft':
      if (node.hasChildren && expanded.has(focus)) result.close = focus;
      else if (node.parent >= 0) result.focus = node.parent;
      break;
    case '*':
      result.expandSiblings = nodes
        .map((n, i) => (n.parent === node.parent && n.hasChildren && !expanded.has(i) ? i : -1))
        .filter((i) => i >= 0);
      break;
    case 'Enter':
    case ' ':
      result.activate = true;
      break;
    default:
  }
  return result;
}
