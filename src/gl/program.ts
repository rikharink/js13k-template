import {
  COMPILE_STATUS,
  FRAGMENT_SHADER,
  LINK_STATUS,
  VERTEX_SHADER,
} from "./constants";

export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  let shader = gl.createShader(type);
  if (!shader) throw Error("Couldn't create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, COMPILE_STATUS);
  if (success) {
    return shader;
  }
  gl.deleteShader(shader);
  throw Error("Couldn't create shader");
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
) {
  const vertexShader = createShader(gl, VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  throw Error("Couldn't create program");
}
