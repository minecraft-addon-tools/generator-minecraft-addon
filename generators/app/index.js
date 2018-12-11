'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const uuid = require('uuid');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`So I heard you'd like to create a ${chalk.red('minecraft-addon')}?`));

    this.props = await this.prompt([
      {
        type: 'input',
        name: 'addonName',
        message: 'What will be the name of your addon?'
      },
      {
        type: 'input',
        name: 'addonDescription',
        message: 'What will your addon do or provide?'
      },
      {
        type: 'input',
        name: 'addonNamespace',
        message: 'What namespace will you use?',
        default: response => response.addonName.toLowerCase().replace(/[^a-z0-9_]/g, '')
      },
      {
        type: 'checkbox',
        name: 'addonModules',
        message: 'What kind of modules will make up the addon?',
        choices: ['Behaviors', 'Resources']
      },
      {
        type: 'confirm',
        name: 'hasScripts',
        message: 'Will you be adding scripts?',
        when: response => response.addonModules.find(r => r === 'Behaviors')
      },
      {
        type: 'checkbox',
        name: 'scriptLanguage',
        message: 'What language do you want to script in?',
        when: response => response.hasScripts,
        choices: ['JavaScript', 'TypeScript']
      }
    ]);
  }

  writing() {
    this.log(JSON.stringify(this.props));
    this.destinationRoot(this.props.addonName.replace(/[^a-zA-Z0-9_]/g, ''));

    const basePkgJson = {
      name: this.props.addonNamespace,
      private: 'true',
      scripts: {
        build: 'gulp build',
        watch: 'gulp watch',
        installmod: 'gulp install',
        uninstallmod: 'gulp uninstall'
      },
      devDependencies: {
        'minecraft-scripting-toolchain': '^0.1.0'
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), basePkgJson);

    let resourcePack;
    if (this.props.addonModules.find(r => r === 'Resources')) {
      resourcePack = this._createResourcePack();
    }

    if (this.props.addonModules.find(r => r === 'Behaviors')) {
      this._createBehaviourPack(resourcePack);
    }

    if (this.props.hasScripts) {
      if (this.props.scriptLanguage.find(r => r === 'TypeScript')) {
        this._extendForTypeScript();
      } else {
        this._extendForJavaScript();
      }
    }
  }

  _createResourcePack() {
    const resourcesPack = {
      uuid: uuid.v4(),
      version: [1, 0, 0]
    };

    const resourceManifest = {
      // eslint-disable-next-line camelcase
      format_version: 1,
      header: {
        name: this.props.addonName,
        description: this.props.addonDescription,
        uuid: resourcesPack.uuid,
        version: resourcesPack.version
      },
      modules: [
        {
          description: `Resources for ${this.props.addonName}`,
          type: 'resources',
          uuid: uuid.v4(),
          version: [1, 0, 0]
        }
      ]
    };
    this.fs.extendJSON(this.destinationPath('src', 'resources', 'manifest.json'), resourceManifest);
    this.fs.copy(this.templatePath('resource_pack_icon.png'), this.destinationPath('src', 'resources', 'pack_icon.png'));
    return resourcesPack;
  }

  _createBehaviourPack(resourcePack) {
    const behaviorManifest = {
      // eslint-disable-next-line camelcase
      format_version: 1,
      header: {
        name: this.props.addonName,
        description: this.props.addonDescription,
        uuid: uuid.v4(),
        version: [1, 0, 0]
      },
      modules: [
        {
          description: `behaviours for ${this.props.addonName}`,
          type: 'client_data',
          uuid: uuid.v4(),
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

    this.fs.extendJSON(this.destinationPath('src', 'behaviors', 'manifest.json'), behaviorManifest);
    this.fs.copy(this.templatePath('behavior_pack_icon.png'), this.destinationPath('src', 'behaviors', 'pack_icon.png'));
  }

  _extendForTypeScript() {
    const typeScriptPkgAdditions = {
      devDependencies: {
        'minecraft-scripting-types-client': '^0.2.0',
        'minecraft-scripting-types-server': '^0.2.0',
        // eslint-disable-next-line prettier/prettier
        'typescript': '^3.1.3',
        'gulp-typescript': '^5.0.0-alpha.3'
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), typeScriptPkgAdditions);

    this.fs.copy(this.templatePath('typescript', 'clientScript.ts'), this.destinationPath('src', 'scripts', 'client', 'client.ts'));
    this.fs.copy(this.templatePath('typescript', 'serverScript.ts'), this.destinationPath('src', 'scripts', 'server', 'server.ts'));
    this.fs.copy(this.templatePath('typescript', 'tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copyTpl(this.templatePath('typescript', 'gulpfile.js'), this.destinationPath('gulpfile.js'), {
      addonName: this.props.addonName
    });
  }

  _extendForJavaScript() {
    this.fs.copy(this.templatePath('javascript', 'clientScript.js'), this.destinationPath('src', 'scripts', 'client', 'client.js'));
    this.fs.copy(this.templatePath('javascript', 'serverScript.js'), this.destinationPath('src', 'scripts', 'server', 'server.js'));
    this.fs.copyTpl(this.templatePath('javascript', 'gulpfile.js'), this.destinationPath('gulpfile.js'), {
      addonName: this.props.addonName
    });
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
