var clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    // set up your listenToEvents and register client-side components here.
}

let firstTick = true;
// per-tick updates
clientSystem.update = function() {
    // Any logic that needs to happen every tick on the client.
    if (firstTick) {
        firstTick = false;
        clientSystem.broadcastEvent("minecraft:display_chat_event", "What are we going to do tonight Server?");
        clientSystem.broadcastEvent("<%= addonNamespace %>:pinky", {narf: false});
    }
}
