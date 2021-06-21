import { Quaternion, multiply, conjugate } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Constructor } from "./mixins";
import { IPositionable } from "./positionable";

export interface IOrientable extends IPositionable {
  _orientation: Quaternion;
}

export type Orientable = Constructor<IOrientable>;

const out: Quaternion = [0, 0, 0, 0];

export function Orientable<TBase extends Orientable>(Base: TBase) {
  return class Orientable extends Base {
    get rotation(): Quaternion {
      return this._orientation;
    }

    set rotation(rotation: Quaternion) {
      this._orientation = rotation;
    }

    get position(): Vector3 {
      //@ts-ignore
      let p: Quaternion = [...super.position, 0];
      multiply(
        out,
        multiply(out, conjugate(out, this._orientation), p),
        this._orientation
      );
      return [out[0], out[1], out[2]];
    }
  };
}
