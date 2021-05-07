import { createProgram } from "../program";
import frag from "./passthrough.frag";
import vert from "./passthrough.vert";

export function createPassthroughProgram(gl: WebGL2RenderingContext) {
  return createProgram(gl, vert, frag);
}
