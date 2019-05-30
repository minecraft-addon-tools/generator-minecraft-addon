var serverSystem = server.registerSystem(0, 0);

// Setup which events to listen for
serverSystem.initialize = function () {
    // set up your listenToEvents and register server-side components here.
    serverSystem.listenForEvent("<%= addonNamespace %>:pinky", eventData => receivePinkyMessage(eventData));
}

// per-tick updates
serverSystem.update = function() {
    // Any logic that needs to happen every tick on the server.
}

function receivePinkyMessage(parameters) {
    if (!parameters.data.narf) {
        //set up chat event data object
        let chatEventData = serverSystem.createEventData("minecraft:display_chat_event");
        chatEventData.data.message = "The same thing we do every night Client. TRY TO TAKE OVER THE WORLD.";

        serverSystem.broadcastEvent("minecraft:display_chat_event", chatEventData);
    }
}
