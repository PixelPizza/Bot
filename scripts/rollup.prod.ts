import injectProcessEnv from "rollup-plugin-inject-process-env";

export default {
	input: "dist/index.js",
	output: [
		{
			file: "./dist/index.js",
			format: "cjs"
		}
	],
	plugins: [injectProcessEnv({
        NODE_ENV: "production"
    })]
};
