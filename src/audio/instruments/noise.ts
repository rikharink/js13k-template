import { whiteNoise } from "../white-noise";
import { Instrument, InstrumentOptions } from "./instrument";
import { SoundContext } from "../sound-context";

export interface NoiseOptions extends InstrumentOptions {
  filterType?: BiquadFilterType;
  filterFrequency?: number;
  attack?: number;
  decay?: number;
}

export class Noise extends Instrument<NoiseOptions> {
  private _filter: BiquadFilterNode;
  private _attack: number;
  private _decay: number;
  private _filterFrequency: number;

  constructor(ctx: SoundContext, opts?: NoiseOptions) {
    super(ctx, opts);
    this._filter = ctx.createBiquadFilter();
    this._filter.type = opts?.filterType ?? "bandpass";
    this._filterFrequency = opts?.filterFrequency ?? 2000;
    this._filter.frequency.value = this._filterFrequency;
    this._attack = opts?.attack ?? 0.001;
    this._decay = opts?.decay ?? 0.2;
    this._gain = 0.4;
  }

  public trigger(time?: number) {
    time ??= this._ctx.currentTime;
    const noise = whiteNoise(this._ctx);
    noise.connect(this._filter).connect(this._amp);
    this._amp.gain.setValueAtTime(0, time);
    this._amp.gain.exponentialRampToValueAtTime(
      this._gain,
      time + this._attack
    );
    this._amp.gain.exponentialRampToValueAtTime(
      0.01,
      time + this._attack + this._decay
    );
    noise.start(time);
    noise.stop(time + this._attack + this._decay);
  }
}
