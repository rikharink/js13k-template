import { Program } from "./program";
import { Texture } from "./texture";

export interface Material {
  program: Program;
  textures: Array<Texture>;
}

export function createMaterial(
  program: Program,
  ...textures: Texture[]
): Material {
  return {
    program,
    textures,
  };
}
