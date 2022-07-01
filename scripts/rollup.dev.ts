import injectProcessEnv from "rollup-plugin-inject-process-env";
// @ts-expect-error Types don't exist
import { uglify } from "rollup-plugin-uglify";

export default {
	input: "dist/index.js",
	output: [
		{
			file: "./dist/index.js",
			format: "cjs"
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
