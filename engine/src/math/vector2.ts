// ADAPTED FROM https://github.com/piesku/goodluck

// ISC License

// Copyright 2019 Contributors to the Goodluck project.

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

export type Vector2 = [x: number, y: number];

export function distance(a: Vector2, b: Vector2) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function distance_squared(a: Vector2, b: Vector2) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  return x * x + y * y;
}

export function distance_manhattan(a: Vector2, b: Vector2) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}