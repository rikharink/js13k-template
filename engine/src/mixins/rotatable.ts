import { Quaternion, multiply, conjugate } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Constructor } from "./mixins";
import { IPositionable } from "./positionable";

export interface IRotatable extends IPositionable {
  _rotation: Quaternion;
}

export type Rotatable = Constructor<IRotatable>;

const out: Quaternion = [0, 0, 0, 0];

export function Rotatable<TBase extends Rotatable>(Base: TBase) {
  return class Rotatable extends Base {
    get rotation(): Quaternion {
      return this._rotation;
    }

    set rotation(rotation: Quaternion) {
      this._rotation = rotation;
    }

    get position(): Vector3 {
      let p: Quaternion = [...super.position, 0];
      multiply(
        out,
        multiply(out, conjugate(out, this._rotation), p),
        this._rotation
      );
      return [out[0], out[1], out[2]];
    }
  };
}
