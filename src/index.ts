import "@sapphire/plugin-logger/register";
import { Client } from "./Client";
import { config } from "dotenv";
import parseEnv from "dotenv-parse-variables";
import { ApplicationCommandRegistries, RegisterBehavior } from "@sapphire/framework";
import { ModelManagerStore } from "./stores/ModelManagerStore";
process.env = parseEnv(config().parsed!) as NodeJS.ProcessEnv;

const client = new Client();

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

client.stores.register(new ModelManagerStore());
void client.login(process.env.TOKEN);
