import { Triggerable } from "../instruments/instrument";
import { SoundContext } from "../sound-context";
import { Toggleable } from "./toggleable";

interface RepeaterOptions {
  timing: number;
  startDelay?: number;
}

export class Repeater implements Toggleable {
  private _timing: number;
  private _ctx: SoundContext;
  private _triggerable: Triggerable;
  private _playing: boolean = false;
  private _id?: number;
  private _nextTime?: number;
  private _startDelay: number;

  constructor(
    ctx: SoundContext,
    triggerable: Triggerable,
    opts: RepeaterOptions
  ) {
    this._ctx = ctx;
    this._triggerable = triggerable;
    this._timing = opts.timing;
    this._startDelay = opts.startDelay ?? 0;
  }

  loop(_time: number) {
    if (this._ctx.currentTime >= this._nextTime!) {
      this._nextTime = this._ctx.currentTime + this._timing;
      this._triggerable.trigger();
    }
    this._id = requestAnimationFrame(this.loop.bind(this));
  }

  public toggle(): void {
    this._playing = !this._playing;
    if (!this._playing) {
      cancelAnimationFrame(this._id!);
    } else {
      this._nextTime = this._ctx.currentTime + this._startDelay;
      this._id = requestAnimationFrame(this.loop.bind(this));
    }
  }
}
