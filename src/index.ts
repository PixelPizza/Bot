import "@sapphire/plugin-logger/register";
import { Client } from "./Client";
import { config } from "dotenv";
import { ModelStore } from "./ModelStore";
import parseEnv from "dotenv-parse-variables";
process.env = parseEnv(config().parsed!) as NodeJS.ProcessEnv;

const client = new Client();
client.stores.register(new ModelStore());
void client.login(process.env.TOKEN);
