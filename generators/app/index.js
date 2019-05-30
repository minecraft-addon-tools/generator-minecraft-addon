"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const uuidv4 = require("uuid/v4");

const toolchainVersion = "^1.0.1";
const toolchainTypeScriptVersion = "^1.0.1";
const toolchainBrowserifyVersion = "^1.0.1";
const typescriptTypesVersion = "^1.0.0-alpha.2";

module.exports = class extends Generator {
	async prompting() {
		// Have Yeoman greet the user.
		this.log(yosay(`So I heard you'd like to create a ${chalk.red("Minecraft Addon")}?`));

		this.props = await this.prompt([
			{
				type: "input",
				name: "addonName",
				message: "What will be the name of your addon?"
			},
			{
				type: "input",
				name: "addonDescription",
				message: "What will your addon do or provide?"
			},
			{
				type: "input",
				name: "addonNamespace",
				message: "What namespace will you use?",
				default: response => response.addonName.toLowerCase().replace(/[^a-z0-9_]/g, "")
			},
			{
				type: "checkbox",
				name: "addonModules",
				message: "What kind of modules will make up the addon?",
				choices: ["Behaviors", "Resources"]
			},
			{
				type: "confirm",
				name: "hasScripts",
				message: "Will you be adding scripts?",
				when: response => response.addonModules.find(r => r === "Behaviors")
			},
			{
				type: "checkbox",
				name: "scriptLanguage",
				message: "What language do you want to script in?",
				when: response => response.hasScripts,
				choices: ["JavaScript", "TypeScript"]
			},
			//choose which script template to use
			//the choice value must be the name of a directory underneath the script language directory
			//ex: choosing "JavaScript" and "example-pinky" will use the scripts in "javascript/example-pinky" directory
			{
				type: "list",
				name: "scriptType",
				message: "What initial scripts do you want generated?",
				when: response => response.hasScripts,
				choices: [
					{
						name: "An Example Client/Server Event Script",
						value: "example-pinky"
					},
					{
						name: "A Boilerplate Script Template",
						value: "boilerplate"
					}
				]
			}
		]);
	}

	writing() {
		this.destinationRoot(this.props.addonName.replace(/[^a-zA-Z0-9_]/g, ""));

		const basePkgJson = {
			name: this.props.addonNamespace,
			private: true,
			scripts: {
				build: "gulp build",
				watch: "gulp watch",
				installaddon: "gulp install",
				uninstalladdon: "gulp uninstall",
				packageaddon: "gulp package"
			},
			devDependencies: {
				"minecraft-addon-toolchain": toolchainVersion
			}
		};

		this.fs.extendJSON(this.destinationPath("package.json"), basePkgJson);

		const templateVars = {
			addonName: this.props.addonName,
			addonNamespace: this.props.addonNamespace,
			useBrowserify: this.props.hasScripts,
			useTypescript: this.props.hasScripts && this.props.scriptLanguage.find(r => r === "TypeScript")
		};

		// Toolchain

		this.fs.copyTpl(this.templatePath("gulpfile.js"), this.destinationPath("gulpfile.js"), templateVars);

		if (templateVars.useBrowserify) {
			this.fs.extendJSON(this.destinationPath("package.json"), {
				devDependencies: {
					"minecraft-addon-toolchain-browserify": toolchainBrowserifyVersion
				}
			});
		}

		// The packs

		let resourcePack;
		if (this.props.addonModules.find(r => r === "Resources")) {
			resourcePack = this._createResourcePack();
		}

		if (this.props.addonModules.find(r => r === "Behaviors")) {
			this._createBehaviourPack(resourcePack);
		}

		// Scripts

		if (this.props.hasScripts) {
			if (templateVars.useTypescript) {
				this._extendForTypeScript(templateVars);
			} else {
				this._extendForJavaScript(templateVars);
			}
		}
	}

	_createResourcePack() {
		const resourcesPack = {
			uuid: uuidv4(),
			version: [1, 0, 0]
		};

		const resourceManifest = {
			// eslint-disable-next-line camelcase
			format_version: 1,
			header: {
				name: `${this.props.addonName} Resources`,
				description: this.props.addonDescription,
				uuid: resourcesPack.uuid,
				version: resourcesPack.version
			},
			modules: [
				{
					description: `Resources for ${this.props.addonName}`,
					type: "resources",
					uuid: uuidv4(),
					version: [1, 0, 0]
				}
			]
		};

		this.fs.extendJSON(this.destinationPath("packs", "resources", "manifest.json"), resourceManifest);
		this.fs.copy(this.templatePath("resource_pack_icon.png"), this.destinationPath("packs", "resources", "pack_icon.png"));
		return resourcesPack;
	}

	_createBehaviourPack(resourcePack) {
		const behaviorManifest = {
			// eslint-disable-next-line camelcase
			format_version: 1,
			header: {
				name: `${this.props.addonName} Behaviors`,
				description: this.props.addonDescription,
				uuid: uuidv4(),
				version: [1, 0, 0]
			},
			modules: [
				{
					description: `behaviours for ${this.props.addonName}`,
					type: this.props.hasScripts ? "client_data" : "data",
					uuid: uuidv4(),
					version: [1, 0, 0]
				}
			]
		};

		if (resourcePack !== undefined) {
			behaviorManifest.dependencies = [
				{
					uuid: resourcePack.uuid,
					version: resourcePack.version
				}
			];
		}

		this.fs.extendJSON(this.destinationPath("packs", "behaviors", "manifest.json"), behaviorManifest);
		this.fs.copy(this.templatePath("behavior_pack_icon.png"), this.destinationPath("packs", "behaviors", "pack_icon.png"));
	}

	_extendForTypeScript(templateVars) {
		const typeScriptPkgAdditions = {
			devDependencies: {
				"minecraft-scripting-types-client": typescriptTypesVersion,
				"minecraft-scripting-types-server": typescriptTypesVersion,
				"minecraft-addon-toolchain-typescript": toolchainTypeScriptVersion
			}
		};
		this.fs.extendJSON(this.destinationPath("package.json"), typeScriptPkgAdditions);

		this.fs.copyTpl(
			this.templatePath("typescript", this.props.scriptType, "clientScript.ts"),
			this.destinationPath("packs", "behaviors", "scripts", "client", "client.ts"),
			templateVars
		);
		this.fs.copyTpl(
			this.templatePath("typescript", this.props.scriptType, "serverScript.ts"),
			this.destinationPath("packs", "behaviors", "scripts", "server", "server.ts"),
			templateVars
		);
		this.fs.copyTpl(this.templatePath("typescript", "tsconfig.json"), this.destinationPath("tsconfig.json"), templateVars);
	}

	_extendForJavaScript(templateVars) {
		this.fs.copyTpl(
			this.templatePath("javascript", this.props.scriptType, "clientScript.js"),
			this.destinationPath("packs", "behaviors", "scripts", "client", "client.js"),
			templateVars
		);
		this.fs.copyTpl(
			this.templatePath("javascript", this.props.scriptType, "serverScript.js"),
			this.destinationPath("packs", "behaviors", "scripts", "server", "server.js"),
			templateVars
		);
	}

	install() {
		this.installDependencies({
			npm: true,
			bower: false
		});
	}
};
