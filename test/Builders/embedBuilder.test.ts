import { describe, expect } from "vitest";
import { EmbedBuilder } from "../../src/lib";
import { Colors } from "discord.js";

describe("EmbedBuilder tests", () => {
	test("GIVEN success embed THEN embed is green with success title", () => {
		const embed = new EmbedBuilder().success();

		expect(embed.data.color).toBe(Colors.Green);
		expect(embed.data.title).toBe("Success");
	});

	test("GIVEN warning embed THEN embed is yellow with warning title", () => {
		const embed = new EmbedBuilder().warning();

		expect(embed.data.color).toBe(Colors.Yellow);
		expect(embed.data.title).toBe("Warning");
	});

	test("GIVEN error embed THEN embed is red with error title", () => {
		const embed = new EmbedBuilder().error();

		expect(embed.data.color).toBe(Colors.Red);
		expect(embed.data.title).toBe("Error");
	});

	test("GIVEN info embed THEN embed is blue with info title", () => {
		const embed = new EmbedBuilder().info();

		expect(embed.data.color).toBe(Colors.Blue);
		expect(embed.data.title).toBe("Info");
	});
});
