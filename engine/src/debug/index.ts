import {
  COLOR_ATTACHMENT0,
  FRAMEBUFFER,
  RGBA,
  TEXTURE_2D,
  UNSIGNED_BYTE,
} from "../rendering/gl-constants";

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


