var clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    // set up your listenToEvents and register client-side components here.
    <%_ if (hasUi) { -%>
    clientSystem.listenForEvent("minecraft:client_entered_world", event => {
        clientSystem.broadcastEvent("minecraft:load_ui", "index.html");
    });
    clientSystem.listenForEvent("minecraft:ui_event", receiveUiEvent);
    <%_ } -%>
}
<%_ if (hasUi) { -%>

function receiveUiEvent(jsonString) {
    const parameters = JSON.parse(jsonString);
    switch (parameters.name) {
        case "<%= addonNamespace %>:close": {
            clientSystem.broadcastEvent("minecraft:unload_ui", "index.html");
            break;
        }
    }
}
<%_ } -%>

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
