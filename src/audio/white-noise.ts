import { SoundContext } from "./sound-context";

let _whiteNoiseBuffer: AudioBuffer | undefined;

export function whiteNoise(ctx: SoundContext): AudioBufferSourceNode {
  const bufferSize = 2 * ctx.sampleRate;
  if (!_whiteNoiseBuffer || _whiteNoiseBuffer.length !== bufferSize) {
    _whiteNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = _whiteNoiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = _whiteNoiseBuffer;
  whiteNoise.loop = true;
  return whiteNoise;
}
