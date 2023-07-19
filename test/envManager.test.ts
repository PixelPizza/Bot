import { describe, expect, test } from "vitest";
import { EnvManager } from "../src/lib";
import path from "node:path";

declare module "@kaname-png/plugin-env" {
	interface EnvKeys {
		SOME_UNDEFINED_KEY: never;
		SOME_NON_EXISTENT_KEY: never;
		SOME_STRING_KEY: never;
		SOME_NUMBER_KEY: never;
		SOME_BOOLEAN_KEY: never;
		SOME_BIGINT_KEY: never;
		SOME_INTEGER_KEY: never;
		SOME_ARRAY_KEY: never;
		SOME_OBJECT_KEY: never;
	}
}

describe("EnvManager tests", () => {
	function createManager({
		env,
		withPath = false,
		nodeEnv
	}: {
		env?: string;
		withPath?: boolean;
		nodeEnv?: string | false;
	} = {}) {
		const oldEnv = process.env.NODE_ENV;

		if (nodeEnv === false) {
			delete process.env.NODE_ENV;
		} else if (nodeEnv) {
			process.env.NODE_ENV = nodeEnv;
		}

		const manager = new EnvManager({
			env,
			path: withPath
				? path.resolve(process.cwd(), ".env.test")
				: undefined
		});

		process.env.NODE_ENV = oldEnv;

		return manager;
	}

	describe("Node env tests", () => {
		test("GIVEN pre-assigned env THEN returns pre-assigned env", () => {
			const manager = createManager({
				nodeEnv: "production"
			});

			expect(manager.getNodeEnv()).toBe("production");
			expect(manager.isNodeEnvEqualTo("production")).toBe(true);
		});

		test("GIVEN undefined env THEN returns development", () => {
			const manager = createManager({
				nodeEnv: false
			});

			expect(manager.getNodeEnv()).toBe("development");
			expect(manager.isNodeEnvEqualTo("development")).toBe(true);
		});

		test("GIVEN development env THEN returns development", () => {
			const manager = createManager({ env: "development" });

			expect(manager.getNodeEnv()).toBe("development");
			expect(manager.isNodeEnvEqualTo("development")).toBe(true);
		});

		test("GIVEN production env THEN returns production", () => {
			const manager = createManager({ env: "production" });

			expect(manager.getNodeEnv()).toBe("production");
			expect(manager.isNodeEnvEqualTo("production")).toBe(true);
		});

		test("GIVEN test env THEN returns test", () => {
			const manager = createManager({ env: "test" });

			expect(manager.getNodeEnv()).toBe("test");
			expect(manager.isNodeEnvEqualTo("test")).toBe(true);
		});
	});

	describe("Env variable tests", () => {
		test("GIVEN valid env variable THEN returns env variable exists", () => {
			const manager = createManager({ withPath: true });

			expect(manager.doesKeyExist("SOME_UNDEFINED_KEY")).toBe(true);
		});

		test("GIVEN invalid env variable THEN returns env variable does not exist", () => {
			const manager = createManager({ withPath: true });

			expect(manager.doesKeyExist("SOME_NON_EXISTENT_KEY")).toBe(false);
		});

		test("GIVEN undefined env variable THEN returns env variable is undefined", () => {
			const manager = createManager({ withPath: true });

			expect(manager.isDefined("SOME_UNDEFINED_KEY")).toBe(false);
		});

		test("GIVEN string env variable THEN returns env variable is string", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getString("SOME_STRING_KEY")).toBeTypeOf("string");
		});

		test("GIVEN number env variable THEN returns env variable is number", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getNumber("SOME_NUMBER_KEY")).toBeTypeOf("number");
		});

		test("GIVEN boolean env variable THEN returns env variable is boolean", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getBoolean("SOME_BOOLEAN_KEY")).toBeTypeOf(
				"boolean"
			);
		});

		test("GIVEN bigint env variable THEN returns env variable is bigint", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getBigInt("SOME_BIGINT_KEY")).toBeTypeOf("bigint");
		});

		test("GIVEN integer env variable THEN returns env variable is integer", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getInteger("SOME_INTEGER_KEY")).toBeTypeOf("number");
			expect(manager.getInteger("SOME_INTEGER_KEY")).toBe(
				parseInt(manager.getString("SOME_INTEGER_KEY"), 10)
			);
		});

		test("GIVEN array env variable THEN returns env variable is array", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getArray("SOME_ARRAY_KEY")).toBeTypeOf("object");
			expect(manager.getArray("SOME_ARRAY_KEY")).toBeInstanceOf(Array);
		});

		test("GIVEN object env variable THEN returns env variable is object", () => {
			const manager = createManager({ withPath: true });

			expect(manager.getObject("SOME_OBJECT_KEY")).toBeTypeOf("object");
			expect(() =>
				JSON.parse(manager.getString("SOME_OBJECT_KEY"))
			).not.toThrow();
		});
	});
});
