import {
  COMPILE_STATUS,
  FRAGMENT_SHADER,
  LINK_STATUS,
  VERTEX_SHADER,
} from "./constants";

export function createShader(
  ctx: WebGL2RenderingContext,
  type: number,
  source: string
) {
  let shader = ctx.createShader(type);
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
    return shader;
  }
  ctx.deleteShader(shader);
  if (process.env.DEBUG) {
    throw Error("Couldn't create shader");
  }
  return undefined!;
}

export function createProgram(
  ctx: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
) {
  const vertexShader = createShader(ctx, VERTEX_SHADER, vertexSource)!;
  const fragmentShader = createShader(ctx, FRAGMENT_SHADER, fragmentSource)!;
  const program = ctx.createProgram()!;
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);

  const success = ctx.getProgramParameter(program, LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(ctx.getProgramInfoLog(program));
  ctx.deleteProgram(program);
  if (process.env.DEBUG) {
    throw Error("Couldn't create program");
  }
  return undefined!;
}
