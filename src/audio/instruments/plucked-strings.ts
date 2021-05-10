import karplusStrong from "./karplus-strong.awlet";
import { SoundContext } from "../sound-context";
import { loadAudioWorklet } from "../util";
import { Frequency, Index, Milliseconds, NormalRange } from "../units";
import { range } from "../../util";

export async function loadPluckedString(ctx: SoundContext) {
  await loadAudioWorklet(ctx, karplusStrong);
}

interface PluckedStringsOptions {
  seed: string;
  frequencies: Frequency[];
  feedback: NormalRange;
}

export class PluckedStrings {
  private _node: AudioWorkletNode;
  private _stringCount: number;

  constructor(ctx: SoundContext, options: PluckedStringsOptions) {
    this._stringCount = options.frequencies.length;
    this._node = new AudioWorkletNode(ctx, "ks", {
      processorOptions: {
        seed: options.seed,
        feedback: options.feedback,
        f0s: options.frequencies,
      },
    });
  }

  public connect(node: AudioNode) {
    this._node.connect(node);
  }

  public disconnect() {
    this._node.disconnect();
  }

  public strum(delay?: Milliseconds): void {
    range(0, this._stringCount).forEach((s) =>
      this.strumString(s, delay ?? 50)
    );
  }

  private strumString(string: Index, delay: Milliseconds) {
    setTimeout(() => {
      this.pluckString.bind(this)(string);
    }, string * delay);
  }

  public pluck(): void {
    this.pluckStrings(...range(0, this._stringCount));
  }

  public pluckString(string: Index): void {
    this._node.port.postMessage({
      type: "play",
      stringIndex: string,
    });
  }

  public pluckStrings(...string: Index[]): void {
    string.forEach(this.pluckString.bind(this));
  }
}
