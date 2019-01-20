var serverSystem = server.registerSystem(0, 0);

// Setup which events to listen for
serverSystem.initialize = function () {
    // set up your listenToEvents and register server-side components here.
    serverSystem.listenForEvent("<%= addonNamespace %>:pinky", receivePinkyMessage);
}

// per-tick updates
serverSystem.update = function() {
    // Any logic that needs to happen every tick on the server.
}

function receivePinkyMessage(parameters) {
    if (!parameters.narf) {
        serverSystem.broadcastEvent("minecraft:display_chat_event", "The same thing we do every night Client. TRY TO TAKE OVER THE WORLD.");
    }
}