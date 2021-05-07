import { minify as terse } from "terser";
import * as fs from "fs";

const pluginAwlet = (options = {}) => ({
  name: "awlet",
  setup(build) {
    const { minify = false, minifyOptions = {} } = options;
    const loader = "text";

    build.onLoad({ filter: /\.awlet$/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, "utf8");

      if (minify) {
        contents = (await terse(contents, minifyOptions)).code;
      }

      return { contents, loader };
    });
  },
});

export default pluginAwlet;
