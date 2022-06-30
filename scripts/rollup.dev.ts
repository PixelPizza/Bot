import injectProcessEnv from "rollup-plugin-inject-process-env";
// @ts-expect-error Types don't exist
import { uglify } from "rollup-plugin-uglify";

export default {
	input: "dist/index.mjs",
	output: [
		{
			file: "./dist/index.mjs",
			format: "esm"
		}
	],
	plugins: [
		injectProcessEnv({
			NODE_ENV: "development"
		}),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		uglify()
	]
};
