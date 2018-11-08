const ModBuilder = require("minecraft-scripting-toolchain");
const ts = require("gulp-typescript");

const builder = new ModBuilder("<%= addonName %>");
builder.scriptTasks = [
    () => ts({
        module: "ES6",
        noImplicitAny: true,
        types: [
            "minecraft-scripting-types"
        ]
    })
];
module.exports = builder.configureEverythingForMe();
