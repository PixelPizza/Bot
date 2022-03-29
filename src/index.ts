process.env.NODE_ENV ??= "development";
import "@kaname-png/plugin-env/register";
import "@sapphire/plugin-logger/register";
import "@kaname-png/plugin-statcord/register";
import "@devtomio/plugin-botlist/register";
import { Client } from "./lib/Client";
import { ApplicationCommandRegistries, container, RegisterBehavior } from "@sapphire/framework";
import { ModelManagerStore } from "./lib/stores/ModelManagerStore";
import { join } from "path";
import { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";

async function main() {
    const client = new Client();

    ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

    client.stores
        .register(new ModelManagerStore().registerPath(join(__dirname, "models")))
        .register(new WebhookManagerStore().registerPath(join(__dirname, "webhooks")));

    await client.login(container.env.string("TOKEN"));

    client.commandsIn(join(__dirname, "commands", "dos"));
}

void main();
