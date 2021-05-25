import { minify as terse } from "terser";
import * as fs from "fs";
import path from "path";

const workerPlugin = (options = {}) => ({
  name: "worker-plugin",
  setup(build) {
    const { minify = false, minifyOptions = undefined } = options;
    build.onLoad({ filter: /\.(?:awlet|worker)$/ }, async (args) => {
      let terserOptions = minifyOptions;
      if (!terserOptions) {
        let configPath = path.join(process.cwd(), "terser.config.json");
        let config = await fs.promises.readFile(configPath, "utf8");
        terserOptions = JSON.parse(config);
      }
      let contents = await fs.promises.readFile(args.path, "utf8");
      if (minify) {
        contents = (await terse(contents, terserOptions)).code;
      }

      const loader = "text";
      return { contents, loader };
    });
  },
});

export { workerPlugin };
