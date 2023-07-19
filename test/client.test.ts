import { describe, test } from "vitest";
import { Client } from "../src/lib";
import { LogLevel } from "@sapphire/framework";

describe("Client tests", () => {
	test("GIVEN inDevelopment is true THEN logger level is LogLevel.Debug", () => {
		const client = new Client(true);
		expect(client.options.logger?.level).toBe(LogLevel.Debug);
	});

	test("GIVEN inDevelopment is false THEN logger level is LogLevel.Info", () => {
		const client = new Client(false);
		expect(client.options.logger?.level).toBe(LogLevel.Info);
	});
});
