import {
  COLOR_ATTACHMENT0,
  FRAMEBUFFER,
  RGBA,
  TEXTURE_2D,
  UNSIGNED_BYTE,
} from "../gl/constants";

type DebugUpdateFn = (deltaTime: number) => void;

export function getDebugInfoUpdater(seed: string): DebugUpdateFn {
  let avgFPS = 60;
  let alpha = 0.9;
  let dt = 0.0;
  let fpsText = "";
  let debug = document.createElement("div");
  debug.id = "debug";
  debug.style.position = "absolute";
  debug.style.top = "8px";
  debug.style.left = "8px";
  debug.style.backgroundColor = "#FFFFFFD0";
  debug.style.border = "2px solid black";
  debug.style.borderRadius = "4px";
  debug.style.padding = "16px 16px";
  document.body.appendChild(debug);

  return (deltaTime: number) => {
    dt += deltaTime;
    avgFPS = alpha * avgFPS + (1.0 - alpha) * (1 / deltaTime);
    if (dt > 1) {
      dt = 0;
      fpsText = `${avgFPS.toFixed(1)} fps`;
    }
    debug.innerText = `${fpsText}\nseed: ${seed}`;
  };
}

export function createImageFromTexture(
  ctx: WebGL2RenderingContext,
  texture: WebGLTexture,
  width: number,
  height: number
): HTMLImageElement {
  // Create a framebuffer backed by the texture
  let framebuffer = ctx.createFramebuffer();
  ctx.bindFramebuffer(FRAMEBUFFER, framebuffer);
  ctx.framebufferTexture2D(
    FRAMEBUFFER,
    COLOR_ATTACHMENT0,
    TEXTURE_2D,
    texture,
    0
  );

  // Read the contents of the framebuffer
  let data = new Uint8Array(width * height * 4);
  ctx.readPixels(0, 0, width, height, RGBA, UNSIGNED_BYTE, data);

  ctx.deleteFramebuffer(framebuffer);

  // Create a 2D canvas to store the result
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let context = canvas.getContext("2d")!;

  // Copy the pixels to a 2D canvas
  let imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);

  let img = new Image();
  img.src = canvas.toDataURL();
  return img;
}
