namespace Server {
    var serverSystem = server.registerSystem(0, 0);

    // Setup which events to listen for
    serverSystem.initialize = function () {
        // set up your listenToEvents and register server-side components here.
    }

    // per-tick updates
    serverSystem.update = function() {
        // Any logic that needs to happen every tick on the server.
    }   
}