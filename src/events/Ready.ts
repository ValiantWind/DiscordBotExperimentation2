import { components } from "../handlers/components/ComponentManager";
import { commands } from "../handlers/commands/CommandManager";
import { Client, Events } from "discord.js";

import EventListener from "../handlers/events/EventListener";
import Logger, { AnsiColor } from "../utils/logger";

export default class Ready extends EventListener {
    constructor() {
        super(Events.ClientReady, {
            once: true
        });
    }

    async execute(client: Client<true>): Promise<void> {
        Logger.log("READY", `Successfully logged in as ${client.user.tag}`, {
            color: AnsiColor.Green,
            fullColor: true
        });

        await Promise.all([
            components.register(),
            commands.register()
        ]);

        await commands.publish();
    }
}