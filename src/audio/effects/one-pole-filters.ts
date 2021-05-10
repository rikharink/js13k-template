//ADAPTED FROM: https://github.com/vitaliy-bobrov/js-rocks/blob/main/src/app/audio/effects/one-pole-filters.ts
import { SoundContext } from "../sound-context";

/**
 * Creates one-pole low pass IIR filter coefficients for cut-off frequency.
 */
export function onePoleLowpass(
  frequency: number,
  sampleRate: number
): IIRFilterOptions {
  const t = 1 / (2 * Math.PI * frequency);
  const a0 = 1 / (t * sampleRate);
  const b1 = a0 - 1;

  return {
    feedforward: [a0, 0],
    feedback: [1, b1],
  };
}

/**
 * Creates one-pole high pass IIR filter coefficients for cut-off frequency.
 */
export function onePoleHighpass(
  frequency: number,
  sampleRate: number
): IIRFilterOptions {
  const t = 1 / (2 * Math.PI * frequency);
  const b1 = 1 / (t * sampleRate) - 1;

  return {
    feedforward: [1, -1],
    feedback: [1, b1],
  };
}

export function getOnePoleHighpass(
  ctx: SoundContext,
  frequency: number
): IIRFilterNode {
  return new IIRFilterNode(ctx, onePoleHighpass(frequency, ctx.sampleRate));
}

export function getOnePoleLowpass(
  ctx: SoundContext,
  frequency: number
): IIRFilterNode {
  return new IIRFilterNode(ctx, onePoleLowpass(frequency, ctx.sampleRate));
}
