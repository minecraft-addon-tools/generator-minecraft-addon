var clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
	// Register any events you will send to the client
	const eventDataDefaults = {narf: false}
	clientSystem.registerEventData("<%= addonNamespace %>:pinky", eventDataDefaults)

	// Register any components you will attach to game objects
	// system.registerComponent(...)

	// Set up any events you wish to listen to
	// system.listenForEvent(...);

	// Enable full logging, useful for seeing errors, you will probably want to disable this for
	// release versions of your scripts.
	// Generally speaking it's not recommended to use broadcastEvent in initialize, but for configuring logging it's fine.
	const scriptLoggerConfig = clientSystem.createEventData("minecraft:script_logger_config");
	scriptLoggerConfig.data.log_errors = true;
	scriptLoggerConfig.data.log_information = true;
	scriptLoggerConfig.data.log_warnings = true;
	clientSystem.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
}

let firstTick = true;
// per-tick updates
clientSystem.update = function() {
	// Any logic that needs to happen every tick on the client.
	if (firstTick) {
		firstTick = false;

		//set up chat event data object
		let chatEventData = clientSystem.createEventData("minecraft:display_chat_event");
		chatEventData.data.message = "What are we going to do tonight Server?";

		clientSystem.broadcastEvent("minecraft:display_chat_event", chatEventData);

		// You must create the event data this way and then set your properties before you broadcast
		let pinkyEventData = clientSystem.createEventData("<%= addonNamespace %>:pinky");
		pinkyEventData.data.narf = true;

		clientSystem.broadcastEvent("<%= addonNamespace %>:pinky", pinkyEventData);
	}
}
