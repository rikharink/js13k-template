import { Quaternion, multiply, conjugate } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Constructor } from "./mixins";
import { IPositionable } from "./positionable";

export interface IRotatable extends IPositionable {
  _rotation: Quaternion;
}

export type Rotatable = Constructor<IRotatable>;

export function Rotatable<TBase extends Rotatable>(Base: TBase) {
  return class Rotatable extends Base {
    get rotation(): Quaternion {
      return this._rotation;
    }

    set rotation(rotation: Quaternion) {
      this._rotation = rotation;
    }

    private _out: Quaternion = [0, 0, 0, 0];
    get position(): Vector3 {
      let p: Quaternion = [...this.position, 0];
      multiply(
        this._out,
        multiply(this._out, conjugate(this._out, this._rotation), p),
        this._rotation
      );
      return [this._out[0], this._out[1], this._out[2]];
    }
  };
}
