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

export function rgbToHex(rgba: [number, number, number, number]): string {
  const r = rgba[0];
  const g = rgba[1];
  const b = rgba[2];
  return "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgba(
  color: string,
  opacity: number
): [number, number, number, number] {
  color = color.replace("#", "");
  const aRgbHex = color.match(/.{1,2}/g);
  return [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
    opacity,
  ];
}

export function getIndex(x: number, y: number, width: number): number {
  return x + width * y;
}

export function floodFill(
  buffer: Uint8ClampedArray,
  width: number,
  i: number,
  oldColor: [number, number, number, number],
  newColor: [number, number, number, number]
) {
  const stack: number[] = [i];
  const old = JSON.stringify(oldColor);
  do {
    const n = stack.pop();
    const s = n * 4;
    const current = JSON.stringify([
      buffer[s],
      buffer[s + 1],
      buffer[s + 2],
      buffer[s + 3],
    ]);
    if (s < 0 || s >= buffer.length || current !== old) continue;

    buffer[s] = newColor[0];
    buffer[s + 1] = newColor[1];
    buffer[s + 2] = newColor[2];
    buffer[s + 3] = newColor[3];

    const x = n % width;
    const y = Math.floor(n / width);
    stack.push(getIndex(x - 1, y, width));
    stack.push(getIndex(x + 1, y, width));
    stack.push(getIndex(x, y - 1, width));
    stack.push(getIndex(x, y + 1, width));
  } while (stack.length > 0);
}
