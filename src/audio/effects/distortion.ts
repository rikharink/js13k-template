import { SoundContext } from "../sound-context";

let _curves: Map<number, Float32Array> = new Map<number, Float32Array>();
function distortionCurve(ctx: SoundContext, amount: number): Float32Array {
  if (_curves.has(amount)) return _curves.get(amount)!;

  const numberOfSamples = ctx.sampleRate;
  const curve = new Float32Array(numberOfSamples);
  const deg = Math.PI / 180;
  for (let i = 0; i < numberOfSamples; ++i) {
    const x = (i * 2) / numberOfSamples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  _curves.set(amount, curve);
  return curve;
}

export function getDistortion(
  ctx: SoundContext,
  distortionAmount: number
): WaveShaperNode {
  const waveShaper = ctx.createWaveShaper();
  waveShaper.curve = distortionCurve(ctx, distortionAmount);
  return waveShaper;
}
