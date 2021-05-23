import { createProgram } from "../program";
import frag from "./passthrough.frag";
import vert from "./passthrough.vert";

export function createPassthroughProgram(ctx: WebGL2RenderingContext) {
  return createProgram(ctx, vert, frag);
}
