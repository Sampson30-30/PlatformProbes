// Quiz data, scoring and shuffling. Pure functions, no DOM access.

/**
 * Normalises quiz data into a predictable shape. Accepts:
 *   { questions: [...] } or just an array of questions.
 * A question is { prompt, options, type?, explanation?, id? }. Options may be
 * strings or { text, correct?, feedback? }. As a shortcut, a question may give
 * `answer` (an index, or an array of indexes) instead of per-option `correct`.
 * Questions with no prompt, fewer than two options or no correct option are
 * dropped, and reported in `problems`.
 */
export function parseQuiz(data) {
  const list = Array.isArray(data) ? data : data?.questions;
  const questions = [];
  const problems = [];
  (Array.isArray(list) ? list : []).forEach((raw, i) => {
    const label = `Question ${i + 1}`;
    const prompt = String(raw?.prompt ?? '').trim();
    const answers = new Set([].concat(raw?.answer ?? []).map(Number));
    const options = (Array.isArray(raw?.options) ? raw.options : []).map((o, n) => {
      const obj = typeof o === 'object' && o !== null ? o : { text: o };
      return {
        text: String(obj.text ?? '').trim(),
        correct: Boolean(obj.correct) || answers.has(n),
        feedback: obj.feedback ? String(obj.feedback) : '',
      };
    }).filter((o) => o.text);
    if (!prompt) return problems.push(`${label} has no prompt.`);
    if (options.length < 2) return problems.push(`${label} needs at least two options.`);
    const correctCount = options.filter((o) => o.correct).length;
    if (correctCount === 0) return problems.push(`${label} has no correct option.`);
    const type = raw?.type === 'multiple' || correctCount > 1 ? 'multiple' : 'single';
    questions.push({
      id: String(raw?.id ?? `q${questions.length + 1}`),
      type,
      prompt,
      options,
      explanation: raw?.explanation ? String(raw.explanation) : '',
    });
  });
  return { title: data?.title ? String(data.title) : '', questions, problems };
}

/**
 * Scores one question. `selected` is the list of chosen option indexes.
 * Returns { correct, points, hits, wrong, missed } where points is 0 to 1:
 * a fully right answer is 1; each wrong pick cancels one right pick.
 */
export function scoreQuestion(question, selected) {
  const chosen = new Set(selected);
  const total = question.options.filter((o) => o.correct).length;
  let hits = 0;
  let wrong = 0;
  question.options.forEach((o, i) => {
    if (!chosen.has(i)) return;
    if (o.correct) hits += 1;
    else wrong += 1;
  });
  const missed = total - hits;
  return {
    correct: wrong === 0 && missed === 0 && chosen.size > 0,
    points: Math.max(0, (hits - wrong) / total),
    hits,
    wrong,
    missed,
  };
}

/** Scores a whole quiz. `results` is a list of scoreQuestion() outputs. */
export function scoreQuiz(results) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const points = results.reduce((sum, r) => sum + r.points, 0);
  return {
    total,
    correct,
    percent: total ? Math.round((correct / total) * 100) : 0,
    points: Math.round(points * 100) / 100,
  };
}

/** Returns a shuffled copy (Fisher-Yates). Pass `random` for repeatable tests. */
export function shuffle(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
