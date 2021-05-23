//ADAPTED FROM: https://raw.githubusercontent.com/vitaliy-bobrov/js-rocks/main/src/app/audio/effects/distortion-curves.ts

export const BLUES = 0;
export const SUNSHINE = 1;
export const DRIVER = 2;
export const SUSTAINED = 3;
export const ARCH = 4;
export const CUBIC = 5;
export const KICKER = 6;
type BLUES = 0;
type SUNSHINE = 1;
type DRIVER = 2;
type SUSTAINED = 3;
type ARCH = 4;
type CUBIC = 5;
type KICKER = 6;
export type CurveType =
  | BLUES
  | SUNSHINE
  | DRIVER
  | SUSTAINED
  | ARCH
  | CUBIC
  | KICKER;

export const blues = (amount: number, curve: Float32Array, n: number) => {
  const k = amount * 10;

  for (let i = 0, x: number; i <= n; ++i) {
    x = (i * 2) / n - 1;
    curve[i] = Math.tanh(0.5 * k * k * x * Math.PI);
  }
};

export const sunshine = (amount: number, curve: Float32Array, n: number) => {
  const k = amount * 10;

  for (let i = 0, x, y: number; i <= n; ++i) {
    x = (i * 2) / n - 1;
    y = Math.tanh(0.5 * x * k * Math.PI);
    curve[i] = Math.tanh(0.5 * y * k * Math.PI) * Math.cos(0.5 * y);
  }
};

// A nonlinearity by Partice Tarrabia and Bram de Jong.
export const driver = (amount: number, curve: Float32Array, n: number) => {
  const k = amount * 2000;

  for (let i = 0, x; i < n; ++i) {
    x = (i * 2) / n - 1;

    curve[i] = ((1 + k / 101) * x) / (1 + (k / 101) * Math.abs(x));
  }
};

export const sustained = (amount: number, curve: Float32Array, n: number) => {
  const k = 1 - amount;

  for (let i = 0, x, y; i < n; ++i) {
    x = (i * 2) / n - 1;
    y = x < 0 ? -Math.pow(Math.abs(x), k + 0.04) : Math.pow(x, k);
    curve[i] = Math.tanh(y * 2);
  }
};

// Arctangent nonlinearity.
export const arch = (amount: number, curve: Float32Array, n: number) => {
  const k = Math.max(amount, 0.01) * 100;

  for (let i = 0, x; i < n; ++i) {
    x = (i * 2) / n - 1;
    curve[i] = (2 / Math.PI) * Math.atan(k * x);
  }
};

// A cubic nonlinearity, soft-clip, input range: [-1, 1]
export const cubic = (curve: Float32Array, n: number) => {
  for (let i = 0, x; i < n; ++i) {
    x = (i * 2) / n - 1;
    curve[i] = 1.5 * x - 0.5 * Math.pow(x, 3);
  }
};

export const kicker = (amount: number, curve: Float32Array, n: number) => {
  const deg = Math.PI / 180;
  for (let i = 0; i < n; ++i) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
};

export function makeDistortionCurve(
  amount: number,
  n: number,
  type: CurveType
) {
  var curve = new Float32Array(n);
  switch (type) {
    case BLUES:
      blues(amount, curve, n);
      break;
    case SUNSHINE:
      sunshine(amount, curve, n);
      break;
    case DRIVER:
      driver(amount, curve, n);
      break;
    case SUSTAINED:
      sustained(amount, curve, n);
      break;
    case ARCH:
      arch(amount, curve, n);
      break;
    case CUBIC:
      cubic(curve, n);
      break;
    case KICKER:
      kicker(amount, curve, n);
      break;
  }
  return curve;
}
