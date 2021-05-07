import { distortionCurve } from "../distortion-curve";
import { Instrument, InstrumentOptions } from "./instrument";
import { SoundContext } from "../sound-context";

export interface KickOptions extends InstrumentOptions {
  frequencyStart?: number;
  frequency?: number;
  decay?: number;
  pitchDecay?: number;
  distortion?: number;
  wave?: OscillatorType;
}

export class Kick extends Instrument<KickOptions> {
  private _frequencyStart: number;
  private _frequency: number;
  private _decay: number;
  private _pitchDecay: number;
  private _distortion: number;
  private _distortionCurve: Float32Array;
  private _wave: OscillatorType;

  constructor(ctx: SoundContext, opts?: KickOptions) {
    super(ctx, opts);
    this._frequency = opts?.frequency ?? 51.913;
    this._frequencyStart = opts?.frequencyStart ?? 207.652;
    this._pitchDecay = opts?.pitchDecay ?? 0.08;
    this._decay = opts?.decay ?? 0.8;
    this._distortion = opts?.distortion ?? 4;
    this._distortionCurve = distortionCurve(this._ctx, this._distortion);
    this._wave = opts?.wave ?? "sine";
  }

  trigger(time?: number) {
    time ??= this._ctx.currentTime;
    const osc = this._ctx.createOscillator();
    osc.type = this._wave;
    osc.frequency.value = this._frequencyStart;
    osc.frequency.exponentialRampToValueAtTime(
      this._frequency,
      time + this._pitchDecay
    );

    const waveShaper = this._ctx.createWaveShaper();
    waveShaper.curve = this._distortionCurve;

    const triangleGainNode = this._ctx.createGain();
    triangleGainNode.gain.value = 1;
    triangleGainNode.gain.exponentialRampToValueAtTime(
      0.001,
      time + this._decay
    );

    osc.connect(waveShaper);
    waveShaper.connect(triangleGainNode);
    triangleGainNode.connect(this._amp);

    osc.start(time);
    osc.stop(time + this._decay + 0.4);
  }
}
