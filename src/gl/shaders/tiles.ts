import { createProgram } from "../program";
import frag from "./tiles.frag";
import vert from "./tiles.vert";

export function createTilesProgram(gl: WebGL2RenderingContext) {
  return createProgram(gl, vert, frag);
}
