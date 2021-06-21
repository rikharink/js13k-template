import { LINK_STATUS } from "./gl-constants";
import { createShader, Shader } from "./shader";

export interface Program {
  vertex: Shader;
  fragment: Shader;
  program: WebGLProgram;
}

export function createProgram(
  ctx: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): Program {
  const vertexShader = createShader(ctx, "Vertex", vertexSource)!;
  const fragmentShader = createShader(ctx, "Fragment", fragmentSource)!;
  const program = ctx.createProgram()!;
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);

  const success = ctx.getProgramParameter(program, LINK_STATUS);
  if (success) {
    return {
      vertex: vertexShader,
      fragment: fragmentShader,
      program,
    };
  }

  if (process.env.DEBUG) {
    console.log(ctx.getProgramInfoLog(program));
    ctx.deleteProgram(program);
    throw Error("Couldn't create program");
  }
  return undefined!;
}
