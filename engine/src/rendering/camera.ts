import { Quaternion } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Positionable } from "../mixins/positionable";
import { Rotatable } from "../mixins/rotatable";
import { Moveable } from "../mixins/moveable";

class _Camera {
  _position!: Vector3;
  _rotation!: Quaternion;

  constructor(position: Vector3, rotation: Quaternion) {
    this._position = position;
    this._rotation = rotation;
  }
}

export const Camera = Moveable(Rotatable(Positionable(_Camera)));
