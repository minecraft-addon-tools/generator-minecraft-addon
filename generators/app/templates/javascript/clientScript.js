var clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    // set up your listenToEvents and register client-side components here.

    //register the custom pinky event
    clientSystem.registerEventData("<%= addonNamespace %>:pinky", { narf: null });
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

        //set up pink event data object
        let pinkyEventData = clientSystem.createEventData("<%= addonNamespace %>:pinky");
        pinkyEventData.narf = false;

        clientSystem.broadcastEvent("<%= addonNamespace %>:pinky", pinkyEventData);
    }
}
