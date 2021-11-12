import "@sapphire/plugin-logger/register";
import { Client } from "./Client";
import { config } from "dotenv";
config();

const client = new Client();
void client.login(process.env.TOKEN);
