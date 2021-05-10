import { createProgram } from "../program";
import frag from "./tiles.frag";
import vert from "./tiles.vert";

export function createTilesProgram(ctx: WebGL2RenderingContext) {
  return createProgram(ctx, vert, frag);
}
