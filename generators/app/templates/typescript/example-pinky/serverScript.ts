/// <reference types="minecraft-scripting-types-server" />

namespace Server {
    var system = server.registerSystem(0, 0);

    // Setup which events to listen for
    system.initialize = function () {
        // set up your listenToEvents and register server-side components here.
        system.listenForEvent("<%= addonNamespace %>:pinky", receivePinkyMessage);
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

