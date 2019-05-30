/// <reference types="minecraft-scripting-types-client" />
namespace Client {
    const system = client.registerSystem(0, 0);

    // Setup which events to listen for
    system.initialize = function () {
        // set up your listenToEvents and register client-side components here.
    }

    let firstTick = true;
    // per-tick updates
    system.update = function() {
        // Any logic that needs to happen every tick on the client.
        if (firstTick) {
            firstTick = false;
            system.broadcastEvent(SendToMinecraftClient.DisplayChat, "What are we going to do tonight Server?");
            system.broadcastEvent("<%= addonNamespace %>:pinky", {narf: false});
        }
    }
}