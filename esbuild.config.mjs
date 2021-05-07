import { build } from "esbuild";
import { glsl } from "esbuild-plugin-glsl";
import awlet from "./plugins/audio-worklet-plugin.mjs";

const isDevelopment = process.env.NODE_ENV === "development";
const define = {
  "process.env.DEBUG": isDevelopment,
};

build({
  entryPoints: ["src/game.ts"],
  outfile: isDevelopment ? "dist/game.js" : undefined,
  bundle: true,
  sourcemap: isDevelopment,
  watch: isDevelopment,
  format: "iife",
  define,
  plugins: [
    glsl({ minify: !isDevelopment }),
    awlet({
      minify: !isDevelopment,
      minifyOptions: {
        ecma: 9,
        module: true,
        toplevel: true,
        compress: {
          keep_fargs: false,
          passes: 5,
          pure_funcs: ["assert", "debug"],
          pure_getters: true,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
        },
        mangle: {
          properties: true,
          module: true,
          toplevel: true,
        },
      },
    }),
  ],
  loader: {
    ".webp": "dataurl",
  },
}).catch(() => process.exit(1));
