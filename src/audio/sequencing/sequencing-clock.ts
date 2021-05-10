type ClockCallback = (step: number) => void;

export interface IClockSource {
  playing: boolean;
  bpm: number;
  toggle(): boolean;
  reset(): void;
  subscribe(callback: ClockCallback): void;
}

export class SequencingClock implements IClockSource {
  private _playing: boolean = false;
  private _currentStep = -1;
  private _bpm: number;
  private _id?: number;
  private _currentTime: number = 0;
  private _elapsedTime: number = 0;
  private _lastTime: number = 0;
  private _callbacks: ClockCallback[] = [];

  constructor(bpm: number) {
    this._bpm = bpm;
  }

  public subscribe(callback: ClockCallback) {
    this._callbacks.push(callback);
  }

  public reset() {
    this._currentStep = -1;
  }

  public get bpm(): number {
    return this._bpm;
  }

  public set bpm(value: number) {
    this._bpm = value;
  }

  public get playing(): boolean {
    return this._playing;
  }

  public set playing(value: boolean) {
    this._playing = value;
    if (this._playing) {
      this._id = requestAnimationFrame(this.run.bind(this));
    } else if (this._id) {
      cancelAnimationFrame(this._id);
    }
  }

  private run(time: number) {
    this._id = requestAnimationFrame(this.run.bind(this));
    this._currentTime = time;
    this._elapsedTime = (this._currentTime - this._lastTime) / 1000;
    if (this._elapsedTime >= this._secondsPerStep) {
      this._nextBeat();
      this._lastTime = this._currentTime;
    }
  }

  public toggle(value?: boolean): boolean {
    this.playing = value ?? !this.playing;
    return this.playing;
  }

  private get _secondsPerStep(): number {
    return 15 / this._bpm;
  }

  private _nextBeat() {
    this._currentStep = (this._currentStep + 1) % 16;
    this._callbacks.forEach((cb) => {
      cb(this._currentStep);
    });
  }
}
