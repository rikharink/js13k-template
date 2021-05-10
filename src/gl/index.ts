export type Canvas = HTMLCanvasElement | OffscreenCanvas;
import {
  TEXTURE_2D,
  TEXTURE_MAG_FILTER,
  TEXTURE_MIN_FILTER,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
  UNSIGNED_BYTE,
} from "./constants";

export function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  let ctx: WebGL2RenderingContext | null = canvas.getContext("webgl2");
  if (ctx) {
    return ctx;
  }
  throw Error("Can't create webctx. context");
}

export function createAndSetupTexture(
  ctx: WebGL2RenderingContext,
  opts: {
    wrap: number;
    filter: number;
    format: number;
    width: number;
    height: number;
    pixels: ArrayBufferView | Uint8Array | null;
  }
) {
  let texture = ctx.createTexture();
  ctx.bindTexture(TEXTURE_2D, texture);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, opts.wrap);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, opts.wrap);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, opts.filter);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, opts.filter);
  ctx.texImage2D(
    TEXTURE_2D,
    0,
    opts.format,
    opts.width,
    opts.height,
    0,
    opts.format,
    UNSIGNED_BYTE,
    opts.pixels
  );
  return texture!;
}

export function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  multiplier?: number
) {
  multiplier = multiplier || 1;
  multiplier = Math.max(0, multiplier);
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}
