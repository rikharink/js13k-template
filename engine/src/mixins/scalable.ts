import { Vector3, scale } from "../math/vector3";
import { Constructor } from "./mixins";
import { IPositionable } from "./positionable";

export interface IScalable extends IPositionable {
  _scale: number;
}

export type Scalable = Constructor<IScalable>;
export function Scalable<TBase extends Scalable>(Base: TBase) {
  return class Scalable extends Base {
    applyScale(amount: number): void {
      this._scale *= amount;
    }

    get scale(): number {
      return this._scale;
    }

    private _out: Vector3 = [0, 0, 0];
    get position(): Vector3 {
      return scale(this._out, this._position, this._scale);
    }
  };
}
