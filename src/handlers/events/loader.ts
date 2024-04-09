import EventListener from "./EventListener.js";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { client } from "../../index.js";
import { AbstractInstanceType } from "../../utils/types.js";
import Logger from "../../utils/logger.js";
import { pluralize } from "../../utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadListeners(): Promise<void> {
    const dirpath = path.resolve(__dirname, "../../events");
    const filenames = fs.readdirSync(dirpath);

    for (const filename of filenames) {
        const filepath = path.resolve(dirpath, filename);

        const listenerModule = await import(filepath);
        const listenerClass = listenerModule.default;
        const listener: AbstractInstanceType<typeof EventListener> = new listenerClass();

        // Handle the event once per session
        if (listener.options?.once) {
            client.once(listener.event, (...args) => listener.execute(...args));
            continue;
        }

        // Handle the event every time it is emitted
        client.on(listener.event, (...args) => listener.execute(...args));
    }

    Logger.info(`Loaded ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
}