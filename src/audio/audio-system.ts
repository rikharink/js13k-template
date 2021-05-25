import { SoundContext } from "./sound-context";

interface AudioSettings {
  masterGain?: number;
  musicGain?: number;
  effectsGain?: number;
}

export class AudioSystem {
  private _ctx: SoundContext;
  private _master: GainNode;
  private _music: GainNode;
  private _effects: GainNode;
  private _masterGain: number;

  public constructor({
    masterGain = 1,
    musicGain = 1,
    effectsGain = 1,
  }: AudioSettings) {
    this._ctx = new AudioContext();
    this._master = this._ctx.createGain();
    this._master.connect(this._ctx.destination);
    this.masterGain = masterGain;
    this._masterGain = masterGain;

    this._music = this._ctx.createGain();
    this._music.connect(this._master);
    this.musicGain = musicGain;

    this._effects = this._ctx.createGain();
    this._effects.connect(this._master);
    this.effectsGain = effectsGain;
  }

  public async init(): Promise<void> {}

  public mute(mute: boolean): void {
    if (mute) {
      this._master.gain.setValueAtTime(0, this._ctx.currentTime);
    } else {
      this.masterGain = this._masterGain;
    }
  }

  public get masterGain(): number {
    return this._master.gain.value;
  }

  public set masterGain(gain: number) {
    this._masterGain = gain;
    this._master.gain.setValueAtTime(gain, this._ctx.currentTime);
  }

  public get effectsGain(): number {
    return this._effects.gain.value;
  }

  public set effectsGain(gain: number) {
    this._effects.gain.setValueAtTime(gain, this._ctx.currentTime);
  }

  public get musicGain(): number {
    return this._effects.gain.value;
  }

  public set musicGain(gain: number) {
    this._music.gain.setValueAtTime(gain, this._ctx.currentTime);
  }
}
