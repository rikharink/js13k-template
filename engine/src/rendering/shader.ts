import {
  COMPILE_STATUS,
  FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "./gl-constants";

export type ShaderType = "Vertex" | "Fragment";

export interface Shader {
  type: ShaderType;
  source: string;
  shader: WebGLShader | null;
}

export function createShader(
  ctx: WebGL2RenderingContext,
  type: ShaderType,
  source: string
): Shader {
  let shader = ctx.createShader(
    type == "Vertex" ? VERTEX_SHADER : FRAGMENT_SHADER
  );
  if (!shader) {
    if (process.env.DEBUG) {
      throw Error("Couldn't create shader");
    } else {
      return undefined!;
    }
  }

  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);

  var success = ctx.getShaderParameter(shader, COMPILE_STATUS);
  if (success) {
    return {
      type,
      source,
      shader,
    };
  }
  ctx.deleteShader(shader);
  if (process.env.DEBUG) {
    throw Error("Couldn't create shader");
  }
  return undefined!;
}
