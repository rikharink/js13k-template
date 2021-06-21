export type GLRenderingContext = WebGLRenderingContext | WebGL2RenderingContext;
export type ContextType = "2d" | "webgl" | "webgl2" | "bitmaprenderer";

export function getRenderingContext<
  T extends RenderingContext | OffscreenRenderingContext
>(type: ContextType, canvas: HTMLCanvasElement): T {
  let ctx = canvas.getContext(type) as T;
  if (ctx) {
    return ctx;
  }
  if (process.env.DEBUG) {
    throw Error("Can't create context");
  }
  return undefined!;
}

export function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  scaling?: number
) {
  scaling = scaling || 1;
  scaling = Math.max(0, scaling);
  const width = (canvas.clientWidth * scaling) | 0;
  const height = (canvas.clientHeight * scaling) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}
