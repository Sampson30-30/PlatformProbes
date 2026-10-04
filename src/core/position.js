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

/**
 * Places a dropdown panel below its trigger, lined up with the trigger's
 * start edge. Opens above instead when there is no room below and more room
 * above, then keeps the panel inside the viewport. Returns { top, left, side }.
 */
export function alignedPosition({ anchor, size, viewport, gap = 4, margin = 8, rtl = false }) {
  const below = anchor.top + anchor.height + gap;
  const above = anchor.top - size.height - gap;
  const roomBelow = viewport.height - below - margin;
  const roomAbove = anchor.top - gap - margin;
  const flip = size.height > roomBelow && roomAbove > roomBelow;
  const top = flip ? Math.max(margin, above) : below;
  const wanted = rtl ? anchor.left + anchor.width - size.width : anchor.left;
  const max = Math.max(margin, viewport.width - size.width - margin);
  return { top, left: Math.min(Math.max(wanted, margin), max), side: flip ? 'top' : 'bottom' };
}
