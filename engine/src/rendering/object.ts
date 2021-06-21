import { Vector3 } from "../math/vector3";
import { IPositionable, Positionable } from "../mixins/positionable";
import { IScalable, Scalable } from "../mixins/scalable";
import { IRotatable, Rotatable } from "../mixins/rotatable";

import { Material } from "./material";
import { Mesh } from "./mesh";
import { Quaternion } from "../math/quaternion";

class _Object implements IScalable, IPositionable, IRotatable {
  _rotation!: Quaternion;
  _position: Vector3 = [0, 0, 0];
  _scale: number = 1;
  mesh!: Mesh;
  material!: Material;
}

export const Object = Rotatable(Positionable(Scalable(_Object)));
