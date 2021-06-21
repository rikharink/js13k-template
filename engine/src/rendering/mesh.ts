import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";

export interface Mesh {
  vertices: Array<Vector3>;
  normals: Array<Vector3>;
  uvs: Array<Vector2>;
  triangles: Array<number>;
}
