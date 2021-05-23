export function range(start: number, end: number) {
  return Array.from("x".repeat(end - start), (_, i) => start + i);
}

export type Random = () => number;
export function seedRand(str: string) {
  // first create a suitable hash of the seed string using xfnv1a
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
  for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  let seed = (h += h << 5) >>> 0;

  // then return the seed function and discard the first result
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#lcg-lehmer-rng
  let rand = () => ((2 ** 31 - 1) & (seed = Math.imul(48271, seed))) / 2 ** 31;
  rand();
  return rand;
}
