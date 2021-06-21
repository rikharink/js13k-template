import { Vector3, scale } from "../math/vector3";
import { Constructor } from "./mixins";
import { IPositionable } from "./positionable";

export interface IScalable extends IPositionable {
  _scale: number;
}

const out: Vector3 = [0, 0, 0];
export type Scalable = Constructor<IScalable>;
export function Scalable<TBase extends Scalable>(Base: TBase) {
  return class Scalable extends Base {
    get position(): Vector3 {
      //@ts-ignore
      return scale(out, super.position, this._scale);
    }
  };
}
