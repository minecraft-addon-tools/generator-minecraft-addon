/// <reference types="minecraft-scripting-types-server" />

namespace Server {
	var system = server.registerSystem(0, 0);

	// Setup which events to listen for
	system.initialize = function () {
		// Register any events you will send to the client
		// system.registerEventData(...)

		// Register any components you will attach to game objects
		// system.registerComponent(...)

		// Set up any events you wish to listen to
		system.listenForEvent("<%= addonNamespace %>:pinky", receivePinkyMessage);

		// Enable full logging, useful for seeing errors, you will probably want to disable this for
		// release versions of your scripts.
		// Generally speaking it's not recommended to use broadcastEvent in initialize, but for configuring logging it's fine.
		const scriptLoggerConfig = system.createEventData(SendToMinecraftServer.ScriptLoggerConfig);
		scriptLoggerConfig.data.log_errors = true;
		scriptLoggerConfig.data.log_information = true;
		scriptLoggerConfig.data.log_warnings = true;
		system.broadcastEvent(SendToMinecraftServer.ScriptLoggerConfig, scriptLoggerConfig);
	}

	// per-tick updates
	system.update = function() {
		// Any logic that needs to happen every tick on the server.
	}

	function receivePinkyMessage(parameters: {narf: boolean}) {
		if (parameters.narf) {
			system.broadcastEvent(SendToMinecraftServer.DisplayChat, "The same thing we do every night Client. TRY TO TAKE OVER THE WORLD.");
		}
	}
}

