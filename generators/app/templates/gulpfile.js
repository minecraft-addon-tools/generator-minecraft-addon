const MinecraftAddonBuilder = require("minecraft-addon-toolchain/v1");
const JSONValidator = require("minecraft-addon-toolchain-jsonvalidator");
<%_ if (useTypescript) { -%>
const TypeScriptSupport = require("minecraft-addon-toolchain-typescript");
<%_ } -%>
<%_ if (useBrowserify) { -%>
const BrowserifySupport = require("minecraft-addon-toolchain-browserify");
<%_ } -%>

const builder = new MinecraftAddonBuilder("<%= addonName %>");
builder.addPlugin(new JSONValidator());
<%_ if (useTypescript) { -%>
builder.addPlugin(new TypeScriptSupport());
<%_ } -%>
<%_ if (useBrowserify) { -%>
builder.addPlugin(new BrowserifySupport());
<%_ } -%>

module.exports = builder.configureEverythingForMe();
