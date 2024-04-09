import { loadListeners } from "./handlers/events/loader";
import { Client, GatewayIntentBits, Collection } from "discord.js";

import Keys from "./keys"


export const client = new Client({
    intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildMessages
		],
    partials: []
});

(async () => {
    await loadListeners();
    await client.login(Keys.clientToken);
})();

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err, origin) => {
	console.log(
		`Caught exception: ${err}\n` + `Exception origin: ${origin}`,
	);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.log("Uncaught Exception Monitor", err, origin);
});
