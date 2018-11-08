const ModBuilder = require("minecraft-scripting-toolchain");

const builder = new ModBuilder("<%= addonName %>");
module.exports = builder.configureEverythingForMe();
