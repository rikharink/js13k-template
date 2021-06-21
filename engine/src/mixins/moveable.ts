import { Vector3, add } from "../math/vector3";
import { Positionable } from "./positionable";

export function Moveable<TBase extends Positionable>(Base: TBase) {
  return class Moveable extends Base {
    move(amount: Vector3) {
      add(this._position, this._position, amount);
    }
  };
}
