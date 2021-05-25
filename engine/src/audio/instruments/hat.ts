import { SoundContext } from "../sound-context";
import { whiteNoise } from "../util";

interface HatOptions {
  destination?: AudioNode;
}

export function playHat(ctx: SoundContext, time?: number, opts?: HatOptions) {
  time = time! | ctx.currentTime;
  let { destination = ctx.destination } = opts ?? {};
  const noise = whiteNoise(ctx);

  const noiseGainNode = ctx.createGain();
  noiseGainNode.gain.value = 1;
  noiseGainNode.gain.setValueAtTime(1, time + 0.001);
  noiseGainNode.gain.linearRampToValueAtTime(0, time + 0.1);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2000;

  const hiHatGainNode = ctx.createGain();
  hiHatGainNode.gain.value = 0.3;

  noise.connect(noiseGainNode);
  noiseGainNode.connect(noiseFilter);
  noiseFilter.connect(hiHatGainNode);
  hiHatGainNode.connect(destination);

  noise.start(time);
  noise.stop(time + 1);
}
