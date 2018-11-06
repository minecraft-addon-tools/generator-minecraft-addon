'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `So I heard you'd like to create an addon using ${chalk.red(
          'generator-minecraft-addon'
        )}?`
      )
    );

    this.props = await this.prompt([
      {
        type: 'input',
        name: 'addonName',
        message: 'What will be the name of your addon?'
      },
      {
        type: 'input',
        name: 'addonNamespace',
        message: 'What namespace will you use?',
        default: response => response.addonName.toLowerCase().replace(/[^a-zA-Z_]/g, '')
      },
      {
        type: 'checkbox',
        name: 'addonModules',
        message: 'What kind of modules will make up the addon?',
        choices: ['behavior', 'resources']
      },
      {
        type: 'confirm',
        name: 'hasScripts',
        message: 'Will you be adding scripts?',
        when: response => response.addonModules.find(r => r === 'behavior')
      },
      {
        type: 'choice',
        name: 'scriptLanguage',
        message: 'What language do you want to script in?',
        when: response => response.hasScripts,
        choices: ['JavaScript', 'TypeScript']
      }
    ]);
  }

  writing() {
    const basePkgJson = {
      name: this.props.addonNamespace,
      private: 'true',
      scripts: {
        build: 'gulp build',
        watch: 'gulp watch',
        installmod: 'gulp install'
      },
      devDependencies: {
        'minecraft-scripting-toolchain':
          'github:minecraft-addon-tools/minecraft-scripting-toolchain'
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), basePkgJson);

    if (this.props.scriptLanguage === 'TypeScript') {
      const typeScriptPkgAdditions = {
        devDependencies: {
          'minecraft-scripting-types':
            'github:minecraft-addon-tools/minecraft-scripting-types',
          typescript: '^3.1.3',
          'gulp-typescript': '^5.0.0-alpha.3'
        }
      };

      this.fs.extendJSON(this.destinationPath('package.json'), typeScriptPkgAdditions);
    } else if (this.props.scriptLanguage === 'JavaScript') {
    }

    /*this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );*/
  }

  install() {
    this.installDependencies();
  }
};
