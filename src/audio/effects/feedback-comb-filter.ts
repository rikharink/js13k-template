import fbcf from "./feedback-comb-filter.awlet";
import { SoundContext } from "../sound-context";
import { loadAudioWorklet } from "../util";

export async function loadFeedbackCombFilter(ctx: SoundContext) {
  await loadAudioWorklet(ctx, fbcf);
}

export interface FeedbackCombFilterNode extends AudioWorkletNode {
  delay: AudioParam;
  feedback: AudioParam;
}

export function getFeedbackCombFilter(
  ctx: SoundContext
): FeedbackCombFilterNode {
  return new AudioWorkletNode(ctx, "fbcf") as FeedbackCombFilterNode;
}
