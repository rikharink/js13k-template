import { Kick } from "./audio/instruments/kick";
import { Noise } from "./audio/instruments/noise";
import { Repeater } from "./audio/sequencing/repeater";
import { SoundMachine } from "./audio/sequencing/sound-machine";
import { SoundContext } from "./audio/sound-context";
import { secondsPerBeat } from "./audio/util";
import { TRIANGLES } from "./gl/constants";
import { resizeCanvasToDisplaySize, getContext } from "./gl/index";
import { createPasstroughProgram } from "./gl/shaders/index";
import worklet from "./audio/processors/feedback-comb-filter.awlet";

console.log(worklet);

//GAMELOOP
let running = false;
let requestId: number;
let lastTime: number;
let currentTime: number;
let elapsedTime: number;

//GL
const canvas = document.getElementById("c") as HTMLCanvasElement;
const gl = getContext(canvas);
const program = createPasstroughProgram(gl);
let ctx: SoundContext | undefined;
let kick: Kick;
let volume: GainNode;
let kicker: Repeater;
let noiser: Repeater;
let noise: Noise;
let effect: AudioNode;
let sound: SoundMachine;
const spb = secondsPerBeat(128);

onload = async (_ev: Event) => {
  document.title = "JS13K Game Template";
  ctx = new AudioContext();
  volume = ctx.createGain();
  volume.connect(ctx.destination);
  kick = new Kick(ctx, { gain: 2, distortion: 8 });
  kick.connect(volume);
  noise = new Noise(ctx, { gain: 0.4, decay: 0.1 });
  noise.connect(volume);
  kicker = new Repeater(ctx, kick, { timing: spb * 4 });
  noiser = new Repeater(ctx, noise, { timing: spb * 4, startDelay: spb * 2 });
  sound = new SoundMachine(kicker, noiser);
  volume.gain.setValueAtTime(1, ctx.currentTime);
  handleResize();
  toggleLoop(true);
};

onclick = async (_ev: Event) => {
  noise.trigger();
  kick.trigger();
};

function handleResize(_ev?: UIEvent) {}

function render(_time: number) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  gl.drawArrays(TRIANGLES, 0, 3);
}

function update() {}

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
  // pause loop and game timer when switching tabs
  toggleLoop(!(e.target as Document).hidden);
};
