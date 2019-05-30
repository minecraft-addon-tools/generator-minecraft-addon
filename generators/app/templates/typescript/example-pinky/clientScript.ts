/// <reference types="minecraft-scripting-types-client" />

namespace Client {
	const system = client.registerSystem(0, 0);

	// Setup which events to listen for
	system.initialize = function() {
		// Register any events you will send to the client
		const eventDataDefaults = {narf: false}
		system.registerEventData("<%= addonNamespace %>:pinky", eventDataDefaults)

		// Register any components you will attach to game objects
		// system.registerComponent(...)

		// Set up any events you wish to listen to
		// system.listenForEvent(...);

		// Enable full logging, useful for seeing errors, you will probably want to disable this for
		// release versions of your scripts.
		// Generally speaking it's not recommended to use broadcastEvent in initialize, but for configuring logging it's fine.
		const scriptLoggerConfig = system.createEventData(SendToMinecraftClient.ScriptLoggerConfig);
		scriptLoggerConfig.data.log_errors = true;
		scriptLoggerConfig.data.log_information = true;
		scriptLoggerConfig.data.log_warnings = true;
		system.broadcastEvent(SendToMinecraftClient.ScriptLoggerConfig, scriptLoggerConfig);
	}

	let firstTick = true;
	// per-tick updates
	system.update = function() {
		// Any logic that needs to happen every tick on the client.
		if (firstTick) {
			firstTick = false;

			//set up chat event data object
			let chatEventData = system.createEventData("minecraft:display_chat_event");
			chatEventData.data.message = "What are we going to do tonight Server?";

			system.broadcastEvent(SendToMinecraftClient.DisplayChat, chatEventData);
			
			// You must create the event data this way and then set your properties before you broadcast
			const eventData = system.createEventData("<%= addonNamespace %>:pinky");
			eventData.data.narf = true;

			system.broadcastEvent("<%= addonNamespace %>:pinky", eventData);
		}
	}
}