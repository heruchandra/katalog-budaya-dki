/**
 * Soft hyphens for justified Indonesian text. Browsers ship no Indonesian hyphenation dictionary, so `hyphens: auto`
 * does nothing for it: a long word ("dikembangkan") can't break and the other gaps on its line open wide. This puts
 * soft hyphens (U+00AD, invisible unless the line breaks there) at syllable breaks: between a vowel and the next
 * consonant + vowel (V-CV) and inside consonant clusters (VC-CV, VC-CCV), with ng / ny / sy / kh as one consonant.
 * It never breaks between vowels and keeps at least 3 letters on each side, so the rare odd break stays harmless.
 */
const SOFT_HYPHEN = "­";
const DIGRAPHS = new Set(["ng", "ny", "sy", "kh"]);
const isVowel = (c: string) => "aeiou".includes(c.toLowerCase());

/** The word as consonant / vowel units (a digraph is one consonant), with each unit's start offset */
function units(word: string): { start: number; vowel: boolean }[] {
  const out: { start: number; vowel: boolean }[] = [];
  for (let i = 0; i < word.length; ) {
    const pair = word.slice(i, i + 2).toLowerCase();
    if (!isVowel(word[i]) && DIGRAPHS.has(pair)) {
      out.push({ start: i, vowel: false });
      i += 2;
    } else {
      out.push({ start: i, vowel: isVowel(word[i]) });
      i += 1;
    }
  }
  return out;
}

function hyphenateWord(word: string): string {
  const u = units(word);
  const breaks = new Set<number>();
  for (let i = 0; i < u.length; i++) {
    if (!u[i].vowel) continue;
    let next = i + 1;
    while (next < u.length && !u[next].vowel) next++;
    if (next >= u.length) break;
    const consonants = next - i - 1;
    // V-CV breaks before the consonant; VC-CV and VC-CCV after the first consonant
    if (consonants > 0) breaks.add(u[consonants === 1 ? i + 1 : i + 2].start);
    i = next - 1;
  }
  let out = "";
  for (let c = 0; c < word.length; c++) {
    if (breaks.has(c) && c >= 3 && word.length - c >= 3) out += SOFT_HYPHEN;
    out += word[c];
  }
  return out;
}

/** Indonesian text with soft hyphens in its longer words (letters only; numbers, names with digits etc. untouched) */
export const hyphenateId = (text: string) => text.replace(/[A-Za-z]{6,}/g, hyphenateWord);

/** Rough language check for a text block (the records carry Indonesian and some English synopses) */
export function looksIndonesian(text: string): boolean {
  const id = (text.match(/\b(yang|dan|dengan|dari|ini|untuk|dalam|adalah|pada)\b/gi) || []).length;
  const en = (text.match(/\b(the|and|of|with|is|this|for|in|to)\b/gi) || []).length;
  return id >= en;
}
