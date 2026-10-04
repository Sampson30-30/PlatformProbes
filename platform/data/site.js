// Site-wide facts. Change wording and navigation here, never in the pages.

export const SITE = {
  name: 'Build What Rise Can’t',
  tagline: 'Think like an engineer, and let Claude do the typing.',
  theme: 'clean',
};

/**
 * The pages, in navigation order. `ready: false` hides a page from the
 * navigation until it exists. A test checks that every ready page has a file.
 */
export const NAV = [
  { id: 'home', label: 'Home', href: 'index.html', ready: true },
  { id: 'reach', label: 'Know your reach', href: 'habit.html?h=reach', ready: true },
  { id: 'habits', label: 'Six habits', href: 'index.html#habits', ready: true },
  { id: 'case', label: 'Case file', href: 'case.html?c=world-time-map', ready: false },
  { id: 'gallery', label: 'What code can do', href: 'gallery.html', ready: false },
  { id: 'brief', label: 'Brief builder', href: 'brief.html', ready: false },
  { id: 'words', label: 'Words', href: 'words.html', ready: false },
  { id: 'progress', label: 'Progress', href: 'progress.html', ready: false },
  { id: 'coach', label: 'Coach’s guide', href: 'coach.html', ready: false },
];
