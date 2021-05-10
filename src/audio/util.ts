import { SoundContext } from "./sound-context";
import { A, Frequency, Tone } from "./units";

export async function loadAudioWorklet(ctx: SoundContext, source: string) {
  await ctx.audioWorklet.addModule(
    URL.createObjectURL(new Blob([source], { type: "text/javascript" }))
  );
}

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

export function halfStepsBetween(a: Tone, b: Tone): number {
  return a.note - b.note + (a.octave - b.octave) * 12;
}

export function noteToFrequency(
  note: Tone,
  root: Tone = { note: A, octave: 4 },
  rootFrequency: Frequency = 440
): Frequency {
  return (
    rootFrequency * Math.pow(Math.pow(2, 1 / 12), halfStepsBetween(note, root))
  );
}

// export function mergeParams(params: AudioParam[]) {
//   const singleParam = params[0];
//   const parameter: AudioParam = {};
//   const audioNodeMethods = Object.getOwnPropertyNames(
//     AudioParam.prototype
//   ).filter((prop) => typeof singleParam[prop] === "function");

//   //allows things like parameter.setValueAtTime(x, ctx.currentTime)
//   audioNodeMethods.forEach((method) => {
//     parameter[method] = (...argums) => {
//       const args = Array.prototype.slice.call(argums);
//       params.forEach((param) => {
//         singleParam[method].apply(param, args);
//       });
//     };
//   });

//   //allows to do parameter.value = x
//   Object.defineProperties(parameter, {
//     value: {
//       get: function () {
//         return singleParam.value;
//       },
//       set: function (value) {
//         params.forEach((param) => {
//           param.value = value;
//         });
//       },
//     },
//   });

//   return parameter;
// }