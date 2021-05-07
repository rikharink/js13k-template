import { Toggleable } from "./toggleable";

export class SoundMachine implements Toggleable {
  private _toggles: Toggleable[] = [];

  constructor(...toggles: Toggleable[]) {
    this._toggles = toggles;
  }

  public toggle(): void {
    this._toggles.forEach((toggle) => toggle.toggle());
  }
}
