import {
  FRAMEBUFFER,
  COLOR_ATTACHMENT0,
  TEXTURE_2D,
  RGBA,
  UNSIGNED_BYTE,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
  TEXTURE_MIN_FILTER,
  TEXTURE_MAG_FILTER,
} from "./gl-constants";
import { GLRenderingContext } from "./rendering-context";

export interface TextureOptions {
  wrap: number;
  filter: number;
  format: number;
  width: number;
  height: number;
  data: ArrayBufferView | Uint8Array | null;
}

export interface Texture {
  texture: WebGLTexture;
  options: TextureOptions;
}

export function createAndSetupTexture(
  ctx: GLRenderingContext,
  { wrap, filter, format, width, height, data }: TextureOptions
): Texture {
  let texture = ctx.createTexture()!;
  ctx.bindTexture(TEXTURE_2D, texture);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, wrap);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, wrap);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter);
  ctx.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter);
  ctx.texImage2D(
    TEXTURE_2D,
    0,
    format,
    width,
    height,
    0,
    format,
    UNSIGNED_BYTE,
    data
  );

  return {
    texture,
    options: {
      wrap,
      filter,
      format,
      width,
      height,
      data,
    },
  };
}

export function createImageFromTexture(
  ctx: GLRenderingContext,
  texture: Texture,
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
    texture.texture,
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
