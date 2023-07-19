import { EnvClient, type EnvKeys } from "@kaname-png/plugin-env";
import type { DotenvCraOptions } from "dotenv-cra";

interface EnvManagerOptions extends DotenvCraOptions {
	env?: typeof process.env.NODE_ENV;
	overrideNodeEnv?: boolean;
}

export class EnvManager {
	private envClient: EnvClient;
	private readonly env: typeof process.env.NODE_ENV;

	public constructor(options: EnvManagerOptions = {}) {
		this.env = options.env ?? process.env.NODE_ENV ?? "development";

		if (options.overrideNodeEnv) {
			process.env.NODE_ENV = this.env;
		}

		this.envClient = new EnvClient({
			...options,
			env: this.env,
			debug: this.env === "development"
		});
	}

	public getNodeEnv(): typeof process.env.NODE_ENV {
		return this.env;
	}

	public isNodeEnvEqualTo(env: typeof process.env.NODE_ENV) {
		return this.getNodeEnv() === env;
	}

	public getString(key: keyof EnvKeys, defaultValue?: string): string {
		return this.envClient.string(key, defaultValue);
	}

	public getNumber(key: keyof EnvKeys, defaultValue?: number): number {
		return this.envClient.number(key, defaultValue);
	}

	public getBoolean(key: keyof EnvKeys, defaultValue?: boolean): boolean {
		return this.envClient.boolean(key, defaultValue);
	}

	public getArray<T>(
		key: keyof EnvKeys,
		simple?: boolean,
		defaultValue?: T[]
	): T[] {
		return this.envClient.array(key, simple, defaultValue);
	}

	public getBigInt(key: keyof EnvKeys, defaultValue?: bigint): bigint {
		return this.envClient.bigInt(key, defaultValue);
	}

	public getInteger(key: keyof EnvKeys, defaultValue?: number): number {
		return this.envClient.integer(key, defaultValue);
	}

	public getObject<T = Record<string | number, unknown>>(
		key: keyof EnvKeys,
		defaultValue?: T
	): T {
		// @ts-expect-error - Should be able to return any object
		return this.envClient.object<T>(key, defaultValue);
	}

	public isDefined(key: keyof EnvKeys): boolean {
		return this.envClient.defined(key);
	}

	public doesKeyExist(key: keyof EnvKeys): boolean {
		return this.envClient.exist(key);
	}
}

export namespace EnvManager {
	export interface Options extends EnvManagerOptions {}
}

declare module "@kaname-png/plugin-env" {
	interface EnvKeys {
		// Add your environment variable keys here
	}
}
