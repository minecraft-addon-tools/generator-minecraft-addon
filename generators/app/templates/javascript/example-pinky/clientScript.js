var clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    // define an example event to send to the server, this describes the shape and defaults of the event.
    const eventDataDefaults = {narf: false}
    clientSystem.registerEventData("<%= addonNamespace %>:pinky", eventDataDefaults)
    
    // set up your listenToEvents and register client-side components here.
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
