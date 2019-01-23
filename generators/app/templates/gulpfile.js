const MinecraftAddonBuilder = require("minecraft-addon-toolchain/v1");
<%_ if (useTypescript) { -%>
const TypeScriptSupport = require("minecraft-addon-toolchain-typescript");
<%_ } -%>
<%_ if (useBrowserify) { -%>
const BrowserifySupport = require("minecraft-addon-toolchain-browserify");
<%_ } -%>

const builder = new MinecraftAddonBuilder("<%= addonName %>");
<%_ if (useTypescript) { -%>
builder.addPlugin(new TypeScriptSupport());
<%_ } -%>
<%_ if (useBrowserify) { -%>
builder.addPlugin(new BrowserifySupport());
<%_ } -%>

module.exports = builder.configureEverythingForMe();
