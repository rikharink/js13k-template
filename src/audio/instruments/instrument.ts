import { SoundContext } from "../sound-context";

export interface InstrumentOptions {
  gain?: number;
}

export interface Triggerable {
  trigger(time?: number): void;
}

export abstract class Instrument<T extends InstrumentOptions>
  implements Triggerable {
  protected _ctx: SoundContext;
  protected _gain: number;
  protected _amp: GainNode;

  constructor(ctx: SoundContext, opts?: T) {
    this._ctx = ctx;
    this._gain = opts?.gain ?? 1;
    this._amp = ctx.createGain();
    this._amp.gain.setValueAtTime(this._gain, ctx.currentTime);
  }

  public connect(
    destinationNode: AudioNode,
    output?: number,
    input?: number
  ): AudioNode {
    return this._amp.connect(destinationNode, output, input);
  }

  public start() {
    this._amp.gain.value = 0;
  }

  public stop() {
    this._amp.gain.value = this._gain;
  }

  public abstract trigger(time: number): void;
}
