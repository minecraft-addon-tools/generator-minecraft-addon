/// <reference types="minecraft-scripting-types-server" />

namespace Server {
	const system = server.registerSystem(0, 0);

	// Setup which events to listen for
	system.initialize = function() {
		// set up your listenToEvents and register server-side components here.
	}

	// per-tick updates
	system.update = function() {
		// Any logic that needs to happen every tick on the server.
	}
}

