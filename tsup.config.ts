import type { Options } from "tsup";

export const tsup: Options = {
	clean: true,
	dts: false,
	entry: ["src/**/*.ts", "src/commands/dos/*.js", "!src/augment.d.ts"],
	format: ["cjs"],
	minify: true,
	skipNodeModulesBundle: true,
	sourcemap: false,
	target: "es2020"
};
