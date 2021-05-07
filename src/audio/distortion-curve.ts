import { SoundContext } from "./sound-context";

export function distortionCurve(ctx: SoundContext, amount: number) {
  const numberOfSamples = ctx.sampleRate;
  const curve = new Float32Array(numberOfSamples);
  const deg = Math.PI / 180;
  for (let i = 0; i < numberOfSamples; ++i) {
    const x = (i * 2) / numberOfSamples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}
