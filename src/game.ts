import { getDistortion } from "./audio/effects/distortion";
import { DRIVER } from "./audio/effects/distortion-curves";
import {
  loadPluckedString,
  PluckedStrings,
} from "./audio/instruments/plucked-strings";
import { SoundContext } from "./audio/sound-context";
import { Gs } from "./audio/units";
import { chordToFrequencies, getTriad } from "./audio/util";
import { ENVELOPE_EXPONENTIAL, getADEnvelopeTrigger } from "./control/envelope";
import { getDebugInfoUpdater } from "./debug/index";
import { resizeCanvasToDisplaySize, getContext } from "./gl/index";
import { seedRand } from "./rng/index";

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
const gl = getContext(c);

// AUDIO
const ctx: SoundContext = new AudioContext();
let masterGain = 0.1;
let musicGain = 1;
let effectsGain = 1;
let master: GainNode;
let music: GainNode;
let effects: GainNode;
let guitar: PluckedStrings;
let triggerEnvelope: () => void;

async function setupAudio(ctx: SoundContext) {
  master = ctx.createGain();
  master.connect(ctx.destination);
  master.gain.setValueAtTime(masterGain, ctx.currentTime);

  music = ctx.createGain();
  music.gain.setValueAtTime(musicGain, ctx.currentTime);
  music.connect(master);

  effects = ctx.createGain();
  effects.gain.setValueAtTime(effectsGain, ctx.currentTime);
  effects.connect(master);

  await loadPluckedString(ctx);
  const chord = chordToFrequencies(getTriad({ note: Gs, octave: 0 }, "minor"));
  chord.reverse();
  guitar = new PluckedStrings(ctx, {
    feedback: 0.97,
    frequencies: chord,
    seed: seed,
  });

  const distortion = getDistortion(ctx, 1, DRIVER);
  const lp = ctx.createBiquadFilter();
  const guitarGain = ctx.createGain();
  triggerEnvelope = getADEnvelopeTrigger(ctx, guitarGain.gain, {
    attack: 0.2,
    decay: 0.5,
    type: ENVELOPE_EXPONENTIAL,
  });
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1661, ctx.currentTime);
  guitar.connect(distortion).connect(lp).connect(guitarGain).connect(music);
}

onload = async (_ev: Event) => {
  document.title = "JS13K Game Template";
  await setupAudio(ctx);
  handleResize();
  toggleLoop(true);
};

onclick = async (_ev: Event) => {
  guitar.strum(10);
  triggerEnvelope();
};

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
  master.gain.linearRampToValueAtTime(
    status ? masterGain : 0,
    ctx.currentTime + 0.2
  );
};
