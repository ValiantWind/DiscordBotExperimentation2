import { getEnvVar } from "./utils/env";

export const Keys = {
	clientToken: getEnvVar('DISCORD_TOKEN'),
	featureTestingGameMessagingService: getEnvVar('FEATURE_TESTING_GAME_MESSAGING_SERVICE_KEY'),
	// clientId: getEnvVar('CLIENT_ID')
} as const;

export default Keys;