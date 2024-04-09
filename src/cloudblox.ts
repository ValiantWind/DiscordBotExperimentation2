import { Client } from "cloudblox";
import Keys from "./keys"

const client = new Client();
client.Configure({
	UniverseId: 4486270027,
	MessagingService: Keys.featureTestingGameMessagingService
})

export default client;