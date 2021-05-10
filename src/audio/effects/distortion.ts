import { SoundContext } from "../sound-context";
import { CurveType, makeDistortionCurve } from "./distortion-curves";

export function getDistortion(
  ctx: SoundContext,
  distortionAmount: number,
  curve: CurveType
): WaveShaperNode {
  const waveShaper = ctx.createWaveShaper();
  waveShaper.curve = makeDistortionCurve(
    distortionAmount,
    ctx.sampleRate,
    curve
  );
  return waveShaper;
}
