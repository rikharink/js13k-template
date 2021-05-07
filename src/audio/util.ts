import { SoundContext } from "./sound-context";

export function secondsPerBeat(bpm: number) {
  return 60 / (bpm * 4);
}

export async function loadAudioWorklet(ctx: SoundContext, source: string) {
  await ctx.audioWorklet.addModule(
    URL.createObjectURL(new Blob([source], { type: "text/javascript" }))
  );
}
