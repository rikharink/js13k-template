import { Vector3 } from "../math/vector3";
import { Constructor } from "./mixins";

export interface IPositionable {
  _position: Vector3;
  get position(): Vector3;
}

export type Positionable = Constructor<IPositionable>;
export function Positionable<TBase extends Positionable>(Base: TBase) {
  return class Positionable extends Base {
    get position(): Vector3 {
      return this._position;
    }
  };
}
