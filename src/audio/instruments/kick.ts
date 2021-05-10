// Adapted from: https://www.kabisa.nl/tech/browser-beats-i-synthesizing-a-kick-drum/
import { getDistortion } from "../effects/distortion";
import { SoundContext } from "../sound-context";
import { Frequency, Seconds } from "../units";
import { whiteNoise } from "../util";

interface KickOptions {
  gain?: number;
  startFrequency?: Frequency;
  frequency?: Frequency;
  attack?: Seconds;
  decay?: Seconds;
  distortion?: number;
  noiseDuration?: Seconds;
  noiseFilterFrequency?: Frequency;
  destination?: AudioNode;
}

export function playKick(ctx: SoundContext, opts?: KickOptions, time?: number) {
  let {
    gain = 1,
    startFrequency = 220,
    frequency = 55,
    attack = 0.1,
    decay = 0.5,
    distortion = 20,
    noiseDuration = 0.2,
    noiseFilterFrequency = 160,
    destination = ctx.destination,
  } = opts ?? {};
  time = time! || ctx.currentTime;
  const triangle = ctx.createOscillator();
  triangle.type = "triangle";
  triangle.frequency.setValueAtTime(startFrequency, time);
  triangle.frequency.exponentialRampToValueAtTime(frequency, time + attack);

  const waveShaper = getDistortion(ctx, distortion, "kicker");
  const triangleGainNode = ctx.createGain();
  triangleGainNode.gain.setValueAtTime(gain, time);
  triangleGainNode.gain.linearRampToValueAtTime(0, time + decay);

  triangle.connect(waveShaper);
  waveShaper.connect(triangleGainNode);
  triangleGainNode.connect(destination);

  const noise = whiteNoise(ctx);
  const noiseGainNode = ctx.createGain();
  noiseGainNode.gain.setValueAtTime(gain, time);
  noiseGainNode.gain.linearRampToValueAtTime(
    0,
    ctx.currentTime + noiseDuration
  );

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.setValueAtTime(noiseFilterFrequency, time);

  noise.connect(noiseGainNode);
  noiseGainNode.connect(noiseFilter);
  noiseFilter.connect(destination);

  noise.start(time);
  triangle.start(time);
  noise.stop(time + decay);
  triangle.stop(time + decay);
}
