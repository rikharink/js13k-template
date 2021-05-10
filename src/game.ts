import { getDistortion } from "./audio/effects/distortion";
import {
  getFeedbackCombFilter,
  loadFeedbackCombFilter,
} from "./audio/effects/feedback-comb-filter";
import {
  getOnePoleHighpass,
  getOnePoleLowpass,
} from "./audio/effects/one-pole-filters";
import { playKick } from "./audio/instruments/kick";
import {
  loadPluckedString,
  PluckedStrings,
} from "./audio/instruments/plucked-strings";
import { SequencingClock } from "./audio/sequencing/sequencing-clock";
import { SoundContext } from "./audio/sound-context";
import { Gs } from "./audio/units";
import { chordToFrequencies, getTriad } from "./audio/util";
import { getDebugInfoUpdater } from "./debug/index";
import { resizeCanvasToDisplaySize, getContext } from "./gl/index";
import { seedRand } from "./rng/index";

// GAME
export const DEBUG = process.env.DEBUG;

let running = false;
let requestId: number;
let lastTime: number = 0;
let currentTime: number = 0;
let elapsedTime: number = 0;
const seed: string = "seed";
const rand = seedRand(seed);
const updateDebugInfo = DEBUG ? getDebugInfoUpdater(seed) : undefined;

// GL
const canvas = document.getElementById("c") as HTMLCanvasElement;
const gl = getContext(canvas);

// AUDIO
const ctx: SoundContext = new AudioContext();
const clockSource = new SequencingClock(147);
let masterGain: GainNode;
let effects: AudioNode[] = [];
let guitar: PluckedStrings;

async function setupAudio(ctx: SoundContext) {
  masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  await loadFeedbackCombFilter(ctx);
  await loadPluckedString(ctx);
  let fbcf = getFeedbackCombFilter(ctx);
  const chord = chordToFrequencies(getTriad({ note: Gs, octave: 0 }, "minor"));
  chord.reverse();
  guitar = new PluckedStrings(ctx, {
    feedback: 0.97,
    frequencies: chord,
    seed: seed,
  });
  const distortion = getDistortion(ctx, 1, "driver");
  const cubic = getDistortion(ctx, 0, "cubic");
  const lp = getOnePoleLowpass(ctx, 1661);
  guitar.connect(distortion).connect(cubic).connect(lp).connect(masterGain);
  fbcf.connect(masterGain);
  effects.push(fbcf);
}

onload = async (_ev: Event) => {
  document.title = "JS13K Game Template";
  await setupAudio(ctx);
  handleResize();
  toggleLoop(true);
  clockSource.subscribe((step) => {
    if (step % 4 == 0) {
      playKick(ctx, {
        destination: effects[0],
      });
    }
    if ((step - 2) % 4 == 0) {
      playKick(ctx, {
        frequency: 103.826,
        decay: 0.2,
        distortion: 200 + rand() * 100,
        gain: 0.5,
        destination: effects[0],
      });
    }
  });
  //clockSource.toggle(true);
};

onclick = async (_ev: Event) => {
  guitar.strum(10);
};

function handleResize(_ev?: UIEvent) {}

function render(_time: number) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function update() {
  if (DEBUG) {
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
  if (!status) {
    clockSource.toggle(status);
  }
};
