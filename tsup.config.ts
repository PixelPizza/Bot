import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	entry: ["src/**/*.ts", "!src/**/*.d.ts"],
	format: ["cjs"],
	minify: true,
	skipNodeModulesBundle: true,
	target: "esnext",
	tsconfig: "src/tsconfig.json",
	keepNames: true,
	treeshake: true,
	bundle: false,
	splitting: false
});
