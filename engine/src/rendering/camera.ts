import { Quaternion } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Positionable } from "../mixins/positionable";
import { Rotatable } from "../mixins/rotatable";

class _Camera {
  _position!: Vector3;
  _rotation!: Quaternion;

  get position(): Vector3 {
    return this._position;
  }
}

export const Camera = Rotatable(Positionable(_Camera));
