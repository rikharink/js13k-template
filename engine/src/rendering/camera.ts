import { Quaternion } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Positionable } from "../mixins/positionable";
import { Orientable } from "../mixins/orientable";
import { Moveable } from "../mixins/moveable";

class _Camera {
  _position!: Vector3;
  _orientation!: Quaternion;

  constructor(position: Vector3, orientation: Quaternion = [0, 0, 0, 1]) {
    this._position = position;
    this._orientation = orientation;
  }
}

export const Camera = Moveable(Orientable(Positionable(_Camera)));
