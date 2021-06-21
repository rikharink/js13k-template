import { AudioSystem } from "./audio/audio-system";
import { getDebugInfoUpdater } from "./debug/index";
import {
  resizeCanvasToDisplaySize,
  getRenderingContext,
} from "./rendering/rendering-context";
import { seedRand } from "./math/random";

import { Camera } from "./rendering/camera";

let running = false;
let requestId: number;
let lastTime: number = 0;
let currentTime: number = 0;
let elapsedTime: number = 0;
const seed: string = "seed";
const rand = seedRand(seed);
const updateDebugInfo = process.env.DEBUG
  ? getDebugInfoUpdater(seed)
  : undefined;

// GL
const c = document.getElementById("c") as HTMLCanvasElement;
const gl = getRenderingContext<WebGL2RenderingContext>("webgl2", c);
const cam = new Camera([10, 10, 10], [0, 0, 0, 1]);
console.log(cam.position);
cam.move([0, 10, 0]);
console.log(cam.position);

let audioSystem: AudioSystem | undefined = undefined;
async function setupAudio() {
  audioSystem = new AudioSystem({
    masterGain: 0.1,
  });
  await audioSystem.init();
}

onload = async (_ev: Event) => {
  document.title = "JS13K Game Template";
  await setupAudio();
  handleResize();
  toggleLoop(true);
};

onclick = async (_ev: Event) => {};

function handleResize(_ev?: UIEvent) {}

function render(_time: number) {
  resizeCanvasToDisplaySize(c);
  gl.viewport(0, 0, c.width, c.height);
}

function update() {
  if (process.env.DEBUG) {
    if (elapsedTime > 0) {
      updateDebugInfo!(elapsedTime);
    }
  }
}

function loop(time: number) {
  if (running) {
    requestId = requestAnimationFrame(loop);
    render(time);
    currentTime = time;
    elapsedTime = (currentTime - lastTime) / 1000;
    update();
    lastTime = currentTime;
  }
}

function toggleLoop(value: boolean) {
  running = value;
  if (running) {
    lastTime = Date.now();
    requestId = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(requestId);
  }
}

onresize = handleResize;

document.onvisibilitychange = function (e: Event) {
  const status = !(e.target as Document).hidden;
  toggleLoop(status);
  audioSystem?.mute(!status);
};
