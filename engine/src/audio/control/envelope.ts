import { SoundContext } from "../sound-context";
import { Seconds } from "../units";

export const ENVELOPE_LINEAR = 0;
export const ENVELOPE_EXPONENTIAL = 1;
export type ADEnvelopeType = 0 | 1;

interface ADEnvelopeOptions {
  attack: Seconds;
  decay: Seconds;
  type: ADEnvelopeType;
}

export function getADEnvelopeTrigger(
  ctx: SoundContext,
  destination: AudioParam,
  opts: ADEnvelopeOptions
) {
  const node = ctx.createConstantSource();
  node.start();
  node.offset.setValueAtTime(0, ctx.currentTime);
  node.connect(destination);
  const d = 0.000001;

  function rampToValueAtTime(value: number, endtime: number): AudioParam {
    return opts.type === ENVELOPE_LINEAR
      ? node.offset.linearRampToValueAtTime(value, endtime)
      : node.offset.exponentialRampToValueAtTime(value, endtime);
  }

  return (time?: number) => {
    time = time ?? ctx.currentTime;
    node.offset.cancelScheduledValues(time);
    node.offset.setValueAtTime(0, time);
    node.offset.setValueAtTime(0, time);
    rampToValueAtTime(1, time + opts.attack);
    rampToValueAtTime(d, time + opts.attack + opts.decay);
    node.offset.setValueAtTime(0, time + opts.attack + opts.decay);
  };
}
