// Floating element placement. Pure functions, no DOM access.
// Rectangles are { top, left, width, height } in viewport pixels.

const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function place(side, a, s, gap) {
  switch (side) {
    case 'top':
      return { top: a.top - s.height - gap, left: a.left + a.width / 2 - s.width / 2 };
    case 'left':
      return { top: a.top + a.height / 2 - s.height / 2, left: a.left - s.width - gap };
    case 'right':
      return { top: a.top + a.height / 2 - s.height / 2, left: a.left + a.width + gap };
    default:
      return { top: a.top + a.height + gap, left: a.left + a.width / 2 - s.width / 2 };
  }
}

function fitsOnMainAxis(side, pos, s, v, margin) {
  if (side === 'top') return pos.top >= margin;
  if (side === 'bottom') return pos.top + s.height <= v.height - margin;
  if (side === 'left') return pos.left >= margin;
  return pos.left + s.width <= v.width - margin;
}

function clampAxis(value, size, limit, margin) {
  const max = Math.max(margin, limit - size - margin);
  return Math.min(Math.max(value, margin), max);
}

/**
 * Works out where to put a floating element next to an anchor.
 * Tries the preferred side, flips to the opposite side if it does not fit,
 * then keeps the result inside the viewport.
 * Returns { top, left, side } where `side` is the side actually used.
 */
export function computePosition({ anchor, size, viewport, side = 'bottom', gap = 8, margin = 8 }) {
  const preferred = OPPOSITE[side] ? side : 'bottom';
  let used = preferred;
  let pos = place(preferred, anchor, size, gap);
  if (!fitsOnMainAxis(preferred, pos, size, viewport, margin)) {
    const flipped = OPPOSITE[preferred];
    const alt = place(flipped, anchor, size, gap);
    if (fitsOnMainAxis(flipped, alt, size, viewport, margin)) {
      used = flipped;
      pos = alt;
    }
  }
  return {
    top: Math.round(clampAxis(pos.top, size.height, viewport.height, margin)),
    left: Math.round(clampAxis(pos.left, size.width, viewport.width, margin)),
    side: used,
  };
}
