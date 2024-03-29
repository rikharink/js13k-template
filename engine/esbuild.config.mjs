import { build } from "esbuild";
import { glsl } from "esbuild-plugin-glsl";
import { workerPlugin } from "./plugins/worker-plugin.mjs";

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
    workerPlugin({
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
      },
    }),
  ],
  loader: {
    ".webp": "dataurl",
  },
}).catch(() => process.exit(1));
