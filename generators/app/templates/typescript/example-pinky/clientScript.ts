/// <reference types="minecraft-scripting-types-client" />

namespace Client {
	const system = client.registerSystem(0, 0);

	// Setup which events to listen for
	system.initialize = function() {
		// define an example event to send to the server, this describes the shape and defaults of the event.
		const eventDataDefaults = {narf: false}
		system.registerEventData("<%= addonNamespace %>:pinky", eventDataDefaults)

		// set up your listenToEvents and register client-side components here.
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