import { SoundContext } from "../sound-context";
import { Instrument, InstrumentOptions } from "./instrument";

interface ChordOptions extends InstrumentOptions {}

export class Chord extends Instrument<ChordOptions> {
  constructor(ctx: SoundContext, opts?: ChordOptions) {
    super(ctx, opts);
  }
  
  public trigger(time: number): void {
    throw new Error("Method not implemented.");
  }
}
